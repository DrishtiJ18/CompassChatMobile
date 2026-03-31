import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  ScrollView,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useStore} from '@src/stores';
import {GeneratingState} from '@src/screens/Home';
import PromptCard from '../PromptCard';
import ChatMessage from '../ChatMessage';
import {Mapping} from '../ChatMessage/types';
import GeneratingAnimation from '../GeneratingAnimation';
import i18n from '@src/translation/config';
import {flexDirection} from '@src/utils/UiUtils';
import CustomText from '../custom/CustomText';
import CitationFiles from './CitationFiles';
import {getCitation} from '@src/apiConfigs/apiServices';
import {blobToBase64} from '@src/utils';
import {useNavigation} from '@react-navigation/native';
import screenNameConstants from '@src/navigator/AuthNavigator/screenNameConstants';
interface ChatContainerPropsType {
  message: string[];
  mainObj: Mapping;
  id: string;
  generating: GeneratingState;
  onSend: (mess: string) => Promise<void>;
  regenerate: ({
    parentId,
    prompt,
    setSelectedIndex,
    selectedIndex,
  }: {
    parentId: any;
    prompt: any;
    setSelectedIndex: any;
    selectedIndex: any;
  }) => Promise<void>;
  editPrompt: ({
    parentId,
    messageId,
    prompt,
    setSelectedIndex,
    selectedIndex,
  }: {
    parentId: string;
    messageId: string;
    prompt: string;
    setSelectedIndex: any;
    selectedIndex: string;
  }) => Promise<void>;
  selectedIndexRef: React.MutableRefObject<number | undefined>;
}
const ChatContainer: React.FC<ChatContainerPropsType> = ({
  message,
  mainObj,
  id,
  generating,
  onSend,
  regenerate,
  editPrompt,
  selectedIndexRef,
}) => {
  const {t: translate} = useTranslation();
  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);
  const endNode = useStore(state => state.endNode);
  const language = useStore(state => state.language);
  const canStop = useStore(state => state.canStop);
  const PromptExampeData = [
    {
      title: i18n.t('sample_prompts.prompt_1_title'),
    },
    {
      title: i18n.t('sample_prompts.prompt_2_title'),
    },
    {
      title: i18n.t('sample_prompts.prompt_3_title'),
    },
  ];
  const userDetails = useStore(state => state.userDetails);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [page, setPage] = useState('1');
  const [activeCitationName, setActiveCitationName] = useState('');
  const [fileType, setFileType] = useState('');
  const navigation = useNavigation();

  function navigateToCitationFiles(params) {
    navigation.navigate(screenNameConstants.CITATION_FILES_SCREEN, params);
  }

  const onOpenCitation = async (fileurl: any, name: any, pageNumber: any) => {
    // console.log("citation clicked")
    // console.log(name)
    // console.log("fileurl", fileurl)
    // setUrl(fileurl)
    // setShowLoader(true);
    // setTimeout(() => { setShowLoader(false) }, 3000)
    // setPage(pageNumber);
    console.log('pageNumber', pageNumber);

    const res = await getCitation(name);
    const fileName = res.data.file_name.split('/')[1];
    const fileUrl = fileurl;
    const sourceFileExt = fileUrl?.split('?')[0].split('.').pop();
    const nameOfFile = name?.split('/')?.at(-2);
    // setActiveCitationName(nameOfFile);
    if (fileUrl?.includes('.html')) {
      blobToBase64(fileUrl)
        .then(base64String => {
          const iframeSrc = `data:text/html;base64,${base64String}`;
          // setModalVisible(true);
          navigateToCitationFiles({
            fileUrl: iframeSrc,
            name: nameOfFile,
            type: '1',
            page: pageNumber,
          });
          // setActiveUrl(iframeSrc);
          // setFileType('1');
        })
        .catch(error => {
          console.error('Error converting Blob URL to base64:', error);
        });
    } else {
      // setModalVisible(true);
      // setActiveUrl(fileUrl);
      let fileType = 'default';
      if (
        [
          'xlsx',
          'pptx',
          'pdf',
          'md',
          'json',
          'txt',
          'xml',
          'docx',
          'doc',
        ].includes(sourceFileExt)
      ) {
        // setFileType(sourceFileExt);
        fileType = sourceFileExt;
      }
      // else {
      //    setFileType('default');
      // }
      navigateToCitationFiles({
        fileUrl: fileUrl,
        name: nameOfFile,
        type: fileType,
        page: pageNumber,
      });
    }
  };

  useEffect(() => {
    if (modalVisible) setShowLoader(false);
  }, [modalVisible]);

  const closeModal = () => {
    setModalVisible(false);
    setActiveUrl('');
    setPage('1');
    setFileType('');
    setActiveCitationName('');
  };
  useEffect(() => {
    if (!scrollRef || !canStop) {
      return;
    }
    if (Object.keys(mainObj)?.length === 1) {
      scrollRef.current?.scrollTo({x: 0, y: 0});
      return;
    }
    scrollRef.current?.scrollToEnd();
  }, [Object.keys(mainObj)?.length, endNode]);

  return (
    <>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        className="shrink overflow-scroll"
        testID="chats-scroll-view">
        {Object.values(mainObj)?.length > 1 ? (
          <View className="w-full mt-10 px-5" testID="chat-messages-vew">
            {!!id && Object.values(mainObj)?.length > 1 && (
              <ChatMessage
                key={id}
                message={message}
                mainObj={mainObj}
                regenerate={regenerate}
                editPrompt={editPrompt}
                onOpenCitation={onOpenCitation}
                selectedIndexRef={selectedIndexRef}
              />
            )}

            <GeneratingAnimation
              show={generating?.show}
              animationfDirection={flexDirection(language, generating?.content)}
            />
          </View>
        ) : (
          <>
            <View
              className="justify-center items-center mt-[68px]"
              testID="default-prompts-title-view">
              <CustomText
                styles="text-center font-medium text-[30px] text-black leading-[40px]"
                testID="user-name">
                {`${translate('chat_page.hi')}, ${userDetails?.name}!`}
              </CustomText>

              <CustomText
                styles="text-center font-medium text-[30px] text-black leading-[40px]"
                testID="how-can-i-assist">
                {translate('chat_page.how_can_i_assist')}
              </CustomText>
            </View>

            <View className="w-full mt-10 px-5">
              {PromptExampeData.map((item, index) => (
                <PromptCard
                  key={item?.title + index}
                  index={index}
                  {...item}
                  onSend={onSend}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
      {/* <CitationFiles
        fileUrl={activeUrl}
        isOpen={modalVisible}
        onClose={closeModal}
        name={activeCitationName}
        type={fileType}
        page={page}
      /> */}
      {showLoader && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          size={'large'}
          testID="chat-container-loader"
        />
      )}
    </>
  );
};

export default ChatContainer;
