import moment from 'moment';
import Config from 'react-native-config';
import { GroupedByDate, HistoryDataType } from './types';
import EncryptedStorage from 'react-native-encrypted-storage';
import { navigationRef } from 'ROOTDIR/App';
import { CommonActions } from '@react-navigation/native';
import { revoke } from 'react-native-app-auth';

import screenNameConstants from '@src/navigator/UnAuthNavigator/screenNameConstants';
import { getConfig } from '@src/apiConfigs/authConfig';
import { showToast } from './UiUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isValidJSON = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const parseContentDraft = (dataString: string, conversationDetails: object) => {
  const dataPrefix = 'data: ';
  const doneData = `${dataPrefix}[DONE]`;
  const ErrorData = `${dataPrefix}[ERROR]`;
  const isFinal =
    dataString.includes(doneData) || dataString.includes(ErrorData);
  const dataJsonLines = dataString
    .split(doneData)
    .join('')
    .trim()
    .split(dataPrefix)
    .filter(v => !!v); // Remove empty lines

  const contentSnippets = dataJsonLines?.map(dataJson => {
    if (!isValidJSON(dataJson)) {
      return '';
    }
    try {
      const parsed = JSON.parse(dataJson);
      const others = parsed?.type && parsed;
      const choices = parsed && parsed?.choices;

      const otherTypes: string[] = [
        'title_generation',
        'last_user_message_identifier',
        'new_response_message_identifier',
      ];

      if (others && otherTypes.includes(others?.type)) {
        // conversationDetails = {...conversationDetails, ...others};

        if (others.type === "new_response_message_identifier") {
          conversationDetails = {
            ...conversationDetails,
            message_id: others.message_id,
            parent_message_id: others.parent_message_id,
          };
        } else if (others.type === "title_generation") {
          conversationDetails = {
            ...conversationDetails,
            conversation_id: others.conversation_id,
            title: others.title,
          };
        }
       
      } else if (choices && choices[0].delta?.role) {
        conversationDetails = {
          ...conversationDetails,
          role: choices[0].delta?.role,
        };
      } else if (choices && Array.isArray(choices) && choices.length > 0) {
        return choices[0].delta?.content ?? '';
      } else if (parsed && parsed?.data_points) {
        conversationDetails = { ...conversationDetails, ...parsed };
      } else {
        throw new Error(dataJson);
      }
    } catch (error) {
      // notification.error({
      //   message: "Error parsing content",
      // })
      console.log('error===>>', { dataJson, dataString, error: error?.message });
    }
  });

  const content = contentSnippets.join('');

  return {
    content,
    isFinal,
    convoDetails: conversationDetails,
  };
};

const getModel = (model: string) => {
  let chatModels = {
    GPT: Config.GPT || 'gpt-4o',
    Jais: Config.Jais || 'jais-30b',
  };

  if (Config.CHAT_MODELS) {
    const models = Config.CHAT_MODELS;

    const modelsJsonString = models.replace(
      /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
      '"$2": ',
    );
    chatModels = JSON.parse(modelsJsonString);
  }

  if (chatModels[model]) {
    return chatModels[model];
  } else {
    return 'gpt-4o';
  }
};

const eventStreamCallBack = ({
  data,
  temp,
  setNewMess,
  setCanStop,
  setGenerating,
  setSelectedIndex = () => { },
  selectedIndex = 0,
  type,
  newId = '',
  mess = '',
  parent = '',
}) => {
  if (!data.convoDetails) {
    return;
  }
  const { message_id, parent_message_id } = data.convoDetails;
  if (type === 'new') {
    delete temp[newId];
    temp[parent].children = [parent_message_id];
    temp[parent_message_id] = {
      children: [message_id],
      parent: parent,
      message: {
        id: parent_message_id,
        author: {
          role: 'user',
        },
        create_time: new Date(),
        content: {
          content_type: 'text',
          content: mess,
        },
      },
      id: parent_message_id,
    };
  }

  if (type === 'regenerate' && !temp[parent].children.includes(message_id)) {
    temp[parent].children.push(message_id);
  }
  if (type === 'edit') {
    temp[parent].children.pop();
    temp[parent].children.push(parent_message_id);
    delete temp[newId];
    temp[parent_message_id] = {
      children: [],
      parent: parent,
      message: {
        id: parent_message_id,
        author: {
          role: 'user',
        },
        create_time: new Date(),
        content: {
          content_type: 'text',
          content: mess,
        },
      },
      id: parent_message_id,
    };
    if (!temp[parent_message_id].children.includes(message_id)) {
      temp[parent_message_id].children.push(message_id);
    }
  }

  if (data?.content) {
    setGenerating({ show: false, content: '' });
    setSelectedIndex(selectedIndex + 1);
    temp[message_id] = {
      parent: parent_message_id,
      message: {
        id: message_id,
        author: {
          role: 'assistant',
        },
        create_time: new Date(),
        content: {
          content_type: 'text',
          content: data?.content,
          thoughts: data?.thoughts,
          thought_chain: data?.thought_chain,
          work_citation_lookup: data?.work_citation_lookup,
          web_citation_lookup: data?.web_citation_lookup,
        },
      },
      id: message_id,
      isFinal: data?.isFinal,
      children: [],
    };
    if (data?.isFinal) {
      setCanStop(false);
    }

    setNewMess(temp);
  }
};

const deepClone = (obj: any) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  const clonedObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
};

export const getRecentUserMessages = (arr: any[], limit: number = 6) => {
  const result = arr.slice(0, limit).reverse();

  // Remove non-user messages from the beginning of the array
  while (result.length > 0 && result[0].role !== 'user') {
    result.shift();
  }

  return result;
};

const findParents = (originalObj, id, chatModel, parentsArr = []) => {
  const currentParentObj = originalObj[id];

  currentParentObj?.parent !== null &&
    !currentParentObj?.id?.includes('local') &&
    parentsArr.push({
      parent_message_id: currentParentObj?.parent,
      message_id: currentParentObj?.id,
      model: getModel(chatModel),
      role: currentParentObj?.message?.author?.role,
      content: currentParentObj?.message?.content?.content,
    });
  if (currentParentObj?.parent !== null) {
    findParents(originalObj, currentParentObj?.parent, chatModel, parentsArr);
  }

  const result = getRecentUserMessages(parentsArr);

  return result;
};

const getFormattedMessageArr = (newMess, chatModel) => {
  const arr = (
    Array.isArray(newMess) ? newMess : Object.values(newMess)
  ).reduce((acc, item) => {
    if (item?.message && item?.message?.author?.role) {
      acc.push({
        parent_message_id: item?.parent,
        message_id: item?.id,
        model: getModel(chatModel),
        role: item?.message?.author?.role,
        content: item?.message?.content?.content,
      });
    }
    return acc.reverse();
  }, []);

  const result = getRecentUserMessages(arr);

  return result;
};

function getInitials(name: string): string {
  const nameParts = name.trim().split(' ');
  const initials = nameParts.slice(0, 2).map(part => part[0].toUpperCase());
  return initials.join('');
}

function groupByCreateDate(
  data: Array<HistoryDataType>,
  language: string,
): GroupedByDate {
  const sortData = data?.sort((a, b) => {
    return (
      new Date(b?.updated_at)?.getTime() - new Date(a?.updated_at)?.getTime()
    );
  });
  return sortData.reduce((acc: GroupedByDate, item: HistoryDataType) => {
    const yearMonth = moment.unix(item?.updated_at)?.calendar(null, {
      sameDay: `${language === 'ar' ? '[اليوم]' : '[Today]'}`,
      lastDay: `${language === 'ar' ? '[البارحه]' : '[Yesterday]'}`,
      lastWeek: 'D MMMM YYYY',
      sameElse: 'D MMMM YYYY',
    });

    if (!acc?.[yearMonth]) {
      acc![yearMonth] = [];
    }

    acc![yearMonth].push(item);
    return acc;
  }, {});
}

const insertPromptMessage = ({
  temp,
  newId,
  parentId,
  text,
  setGenerating,
  setCanStop,
  setNewMess,
}) => {
  setGenerating({ show: true, content: text });
  setCanStop(true);
  const message = {
    id: newId,
    author: { role: 'user' },
    create_time: new Date(),
    content: { content_type: 'text', content: text },
  };
  if (temp[parentId].children?.length) {
    temp[parentId].children.push(newId);
  } else {
    temp[parentId as string].children = [newId];
  }
  temp[newId] = {
    children: [],
    parent: parentId,
    message,
    id: newId,
  };

  setNewMess(temp);
};

const getRequestBody = ({
  conversationId,
  previousMessages,
  message,
  chatModel,
  parentId = null,
  messageId = null,
  approachType
}) => {
  return {
    conversation_id: conversationId,
    messages: [
      ...previousMessages,
      {
        role: 'user',
        model: getModel(chatModel),
        content: message,
        parent_message_id: parentId,
        message_id: messageId,
      },
    ],
    approach: approachType
  };
};

const logOut = async (
  clearUserDetails?: () => void,
  setIsShowLoader?: (value: boolean) => void,
) => {
  EncryptedStorage.getItem('auth_token')
    .then(async authDetails => {
      if (!authDetails) {
        return;
      }

      if (setIsShowLoader) {
        setIsShowLoader(true);
      }
      const config = getConfig();
      const signOutRes = await revoke(config, {
        tokenToRevoke: JSON.parse(authDetails)?.accessToken,
        includeBasicAuth: true,
        sendClientId: true,
      });

      if (signOutRes?.ok) {
        await EncryptedStorage.clear();
        if (clearUserDetails) {
          clearUserDetails();
        }

        navigationRef?.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'UnAuthScreen',
                state: {
                  routes: [{ name: screenNameConstants.LANDING_SCREEN }],
                },
              },
            ],
          }),
        );
      } else {
        showToast('Please try logging out again.');
      }
    })
    .catch(err => {
      console.log('logout err', err);
    })
    .finally(() => {
      if (setIsShowLoader) {
        setIsShowLoader(false);
      }
    });
  // .finally(async () => {
  //   console.log('called');
  //   await EncryptedStorage.clear();
  //   if (clearUserDetails) {
  //     clearUserDetails();
  //   }

  //   navigationRef?.dispatch(
  //     CommonActions.reset({
  //       index: 1,
  //       routes: [
  //         {
  //           name: 'UnAuthScreen',
  //           state: {
  //             routes: [{name: screenNameConstants.LANDING_SCREEN}],
  //           },
  //         },
  //       ],
  //     }),
  //   );
  // });
};
const blobToBase64 = (blobUrl: string) => {
  return new Promise((resolve, reject) => {
    fetch(blobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsText(blob);
        reader.onloadend = () => {
          if (reader.result) {
            const base64String = Buffer.from(reader.result, "binary").toString(
              "base64"
            );
            resolve(base64String);
          } else {
            reject(new Error("Failed to read Blob content"));
          }
        };
        reader.onerror = reject;
      })
      .catch((error) => reject(error));
  });
};
const formatEnvVariables = (envString: string) => {
  const newObject = {};
  const keyValuePairs = envString
    ?.replace(/window\.ENV\s*=\s*{|};\s*$/g, '')
    ?.trim()
    ?.split('\n')
    ?.map(pair => pair.trim().split(/:(.+)/));

  keyValuePairs.forEach(([key, value]) => {
    key = key?.trim()?.replace(/['"]/g, '');
    value = value
      ?.trim()
      ?.replace(/['",]+$/g, '')
      ?.replace(/^['"]/, '');
    if (key === 'VITE_CHAT_MODELS') {
      value = JSON.parse(value.replace(/'/g, '"'));
    }
    newObject[key] = value;
  });

  AsyncStorage.setItem('EnvVariables', JSON.stringify(newObject));
  return newObject;
};

export {
  parseContentDraft,
  eventStreamCallBack,
  deepClone,
  getModel,
  findParents,
  getFormattedMessageArr,
  getInitials,
  groupByCreateDate,
  insertPromptMessage,
  getRequestBody,
  logOut,
  formatEnvVariables,
  blobToBase64
};
