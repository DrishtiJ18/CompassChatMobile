import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import Header from '@src/layouts/chatHeader';
import {useStore} from '@src/stores';
import Footer from '@src/layouts/footer';
import {
  deepClone,
  eventStreamCallBack,
  findParents,
  getFormattedMessageArr,
  getModel,
  getRequestBody,
  insertPromptMessage,
} from '@src/utils';
import {
  chatCompletion,
  getConversation,
  getHistory,
} from '@src/apiConfigs/apiServices';
import {isIos, showToast} from '@src/utils/UiUtils';
import ChatContainer from '@src/components/ChatContainer';
import {NetInfoContext} from '@src/context/NetInfoContext';
import MainLayout from '@src/layouts/mainLayout';
import {useNetInfo} from '@react-native-community/netinfo';
import Config from 'react-native-config';

export type GeneratingState = {
  show: boolean;
  content: string;
};

function Home() {
  const {isOnline} = useContext(NetInfoContext);
  const {t: translate} = useTranslation();
  const conversationId = useStore(state => state.conversationId);
  const setConversationId = useStore(state => state.setConversationId);
  const newMess = useStore(state => state.conversations);
  const setNewMess = useStore(state => state.setConversations);
  const endNode = useStore(state => state.endNode);
  const setEndNode = useStore(state => state.setEndNode);
  const canStop = useStore(state => state.canStop);
  const setCanStop = useStore(state => state.setCanStop);
  const chatModel = useStore(state => state.chatModel);
  const setChatModel = useStore(state => state.setChatModel);
  const abortSignal = useStore(state => state.abortSignal);
  const generating = useStore(state => state.generating);
  const setGenerating = useStore(state => state.setGenerating);
  const setAbortSignal = useStore(state => state.setAbortSignal);
  const setHistoryData = useStore(state => state.setHistoryData);
  const isShowLoader = useStore(state => state.isShowLoader);
  const setDidResponseFail = useStore(state => state.setDidResponseFail);
  const selectedIndexRef = useRef<number | undefined>();

  const view = useStore(state => state.view);
  const setView = useStore(state => state.setView);
  const {isConnected} = useNetInfo();

  const id = uuid.v4();
  const chatId = useRef(conversationId || null);
  const [text, setText] = useState<string>('');

  const rootNode = useMemo(
    () => Object.values(newMess)?.find(item => item?.parent == null),
    [newMess],
  );
  useEffect(() => {
    const model = newMess[rootNode?.children[0]]?.message?.content?.model;
    const ragType = newMess[rootNode?.children[0]]?.message?.content?.rag_type;
    if (model) {
      setChatModel(model === 'jais-30b' ? 'Jais' : 'GPT');
    }
    if (ragType) {
      setView(ragType === 'web' ? 'web' : 'work');
    }
  }, [rootNode]);
  const conversationIdRef = useRef(conversationId);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    if (!abortSignal.signal) {
      setAbortSignal();
    }
  }, [abortSignal, setAbortSignal]);

  useEffect(() => {
    if (isConnected !== null && !isConnected) {
      showToast(translate('landing_page.no_internet'));
      return;
    }
    if (isConnected) {
      getHistory()
        .then(response => {
          setHistoryData(response.data);
        })
        .catch(err => {
          console.log('getHistory err', err.toString());
        });
    }
  }, [setHistoryData, translate, conversationId, isConnected]);

  useEffect(() => {
    if (!conversationId) {
      setNewMess({
        [id as string]: {
          children: [],
          parent: null,
          message: null,
          id: id as string,
        },
      });
    }
    setGenerating({
      show: false,
      content: '',
    });
    if (canStop) {
      setCanStop(false);
    }
    setEndNode(null);
  }, [conversationId]);

  useEffect(() => {
    return () => {
      if (canStop) {
        setCanStop(false);
      }
    };
  }, [canStop, setCanStop]);

  const fetchConversationList = useCallback(async () => {
    if (isConnected !== null && !isConnected) {
      showToast(translate('landing_page.no_internet'));
      return;
    }
    if (isConnected && conversationIdRef.current) {
      const res = await getConversation(conversationId);
      if (conversationIdRef.current) {
        setNewMess(res?.data?.mapping);
      }
    }
  }, [conversationId, isConnected, setNewMess, translate]);

  const getConversationId = useCallback(async () => {
    const details = await AsyncStorage.getItem('conversation_id');

    if (details) {
      const conversationDetails = JSON.parse(details);
      setConversationId(conversationDetails.conversationId);

      await AsyncStorage.setItem(
        'conversation_id',
        JSON.stringify({
          conversationId: conversationId,
        }),
      );
    }
  }, [conversationId, setConversationId]);

  useEffect(() => {
    if (!conversationId) {
      getConversationId();
      chatId.current = null;
      return;
    }
    fetchConversationList();
  }, [conversationId]);

  function onUserInput(input: string): void {
    if (typeof selectedIndexRef.current === 'number') {
      selectedIndexRef.current = undefined;
      setDidResponseFail({prompt: '', pageIndex: undefined});
    }
    setText(input);
  }

  const onCancel = ({temp, error}, prompt) => {
    if (chatId.current && !conversationId) {
      setConversationId(chatId.current);
    }
    if (error?.message === 'canceled') {
      setEndNode(temp[Object.keys(temp)[Object.keys(temp)?.length - 1]]);
      temp[Object.keys(temp)[Object.keys(temp)?.length - 1]].isFinal = true;
      setNewMess(temp);
    } else {
      abortSignal?.abort();
      setAbortSignal();
      if (Config.ENABLE_RETRY === 'TRUE') {
        showToast(translate('landing_page.no_response'));
        setDidResponseFail({prompt, pageIndex: selectedIndexRef.current || 0});
      }
    }
  };

  const onSend = async (mess: string) => {
    Keyboard.dismiss();
    if (!mess) {
      return;
    }
    setText('');
    const temp = deepClone(newMess);
    const newId = uuid.v4() as string;
    try {
      const parent =
        !conversationId || endNode === null
          ? Object.keys(newMess)[Object.keys(newMess)?.length - 1]
          : endNode?.id;
      insertPromptMessage({
        temp,
        newId,
        parentId: parent,
        text: mess,
        setGenerating,
        setCanStop,
        setNewMess,
      });
      let arrNew = [];
      if (conversationId) {
        arrNew = endNode?.id
          ? findParents(temp, endNode?.id, chatModel)
          : getFormattedMessageArr(newMess, chatModel);
      }
      const body = getRequestBody({
        conversationId: conversationId ?? null,
        previousMessages: arrNew,
        message: mess,
        chatModel,
        approachType: view == 'web' ? 4 : 1,
      });

      const {convoDetails} = await chatCompletion({
        body,
        abortSignal: abortSignal?.signal,
        eventCallBack: data => {
          if (data.convoDetails?.conversation_id) {
            chatId.current = data.convoDetails.conversation_id;
          }
          const newData = { ...data, ...data.convoDetails };
          eventStreamCallBack({
            data:newData,
            temp,
            newId,
            mess,
            parent,
            setNewMess,
            setCanStop,
            setGenerating,
            type: 'new',
          });
        },
      });

      if (!conversationId) {
        const newConversationId = convoDetails.conversation_id;
        setConversationId(newConversationId);
      }
    } catch (error) {
      console.log('onSend err', {error, temp});
      onCancel({error, temp}, mess);
    } finally {
      setGenerating({show: false, content: ''});
    }
  };

  const regeneratePrompt = async ({
    parentId,
    prompt,
    setSelectedIndex,
    selectedIndex,
  }) => {
    //logic to regenerate the prompt
    const temp = deepClone(newMess);
    try {
      if (!prompt) {
        return;
      }
      setText('');
      setGenerating({show: true, content: prompt});
      setCanStop(true);
      const parents = newMess[parentId]?.parent
        ? findParents(newMess, newMess[parentId]?.parent, chatModel)
        : [];
      const body = getRequestBody({
        conversationId: conversationId,
        parentId: newMess[parentId]?.parent,
        previousMessages: parents,
        message: newMess[parentId]?.message?.content?.content,
        chatModel,
        messageId: parentId,
        approachType: view == 'web' ? 4 : 1,
      });
      await chatCompletion({
        body,
        abortSignal: abortSignal?.signal,
        eventCallBack:(data) => {
          const newData = { ...data, ...data.convoDetails };
          eventStreamCallBack({
           data: newData,
            temp,
            setNewMess,
            setCanStop,
            setGenerating,
            setSelectedIndex,
            selectedIndex,
            parent: parentId,
            type: 'regenerate',
          });
        },
      });
    } catch (error) {
      console.log('regenerate error==', error);
      onCancel({error, temp}, prompt);
    } finally {
      setGenerating({show: false, content: ''});
    }
  };

  const editPrompt = async ({
    messageId,
    parentId,
    prompt,
    setSelectedIndex,
    selectedIndex,
  }: {
    parentId: string;
    prompt: string;
    messageId: string;
    setSelectedIndex: void;
    selectedIndex: number;
  }): Promise<void> => {
    Keyboard.dismiss();
    setText('');
    const temp = deepClone(newMess);
    try {
      if (!prompt) {
        return;
      }
      const newId = uuid.v4() + 'local';
      insertPromptMessage({
        temp,
        newId,
        parentId: parentId,
        text: prompt,
        setGenerating,
        setCanStop,
        setNewMess,
      });
      const parents = findParents(newMess, messageId, chatModel);
      const body = {
        conversation_id: conversationId,
        messages: [
          ...parents,
          {
            role: 'user',
            model: getModel(chatModel),
            content: prompt,
          },
        ],
        approach: view == 'web' ? 4 : 1,
      };
      await chatCompletion({
        body,
        abortSignal: abortSignal?.signal,
        eventCallBack: data => {
          eventStreamCallBack({
            data,
            temp,
            newId,
            mess: prompt,
            parent: parentId,
            setSelectedIndex,
            selectedIndex,
            setNewMess,
            setCanStop,
            setGenerating,
            type: 'edit',
          });
        },
      });
    } catch (error) {
      console.log('edit prompt error==', error);
      onCancel({error, temp}, prompt);
    } finally {
      setGenerating({show: false, content: ''});
    }
  };

  return (
    <MainLayout>
      <KeyboardAvoidingView
        behavior={isIos() ? 'padding' : 'height'}
        className="flex-1 bg-white">
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          bounces={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          testID="home-scroll-voiew">
          <Header hasChats={Object.values(newMess)?.length > 1} />

          {isShowLoader ||
          (Object.keys(newMess)?.length === 1 && conversationId) ? (
            <ActivityIndicator size={'large'} testID="chat-container-loader" />
          ) : (
            <ChatContainer
              id={rootNode?.id}
              message={rootNode?.children}
              mainObj={newMess}
              generating={generating}
              onSend={onSend}
              regenerate={regeneratePrompt}
              editPrompt={editPrompt}
              selectedIndexRef={selectedIndexRef}
            />
          )}

          <Footer onUserInput={onUserInput} onSend={onSend} text={text} />
        </ScrollView>
      </KeyboardAvoidingView>
    </MainLayout>
  );
}

export default Home;
