import uuid from 'react-native-uuid';
import {
  ChatSliceInitialState,
  ChatSliceState,
  Conversations,
  MessageBody,
} from './types';
import {HistoryDataType} from '@src/utils/types';

// Define the initial data
const initialSettingData: ChatSliceInitialState = {
  conversationId: null,
  conversations: {
    [uuid.v4() as string]: {
      children: [],
      parent: null,
      message: null,
      id: uuid.v4() as string,
    },
  },
  endNode: null,
  canStop: false,
  chatModel: 'GPT',
  abortSignal: new AbortController(),
  generating: {
    show: false,
    content: '',
  },
  historyData: [],
  showHeaderShadow: false,
  deleteConversationId: {
    id: null,
    title: null,
  },
  isShowLoader: false,
  didResponseFail: {prompt: '', pageIndex: undefined},
};

// Create the chat slice
export const createChatSlice = (
  set: (
    partial: Partial<ChatSliceState>,
    replace?: boolean,
    actionName?: string,
  ) => void,
): ChatSliceState => ({
  ...initialSettingData,
  setConversationId: (conversationId: string | null) =>
    set({conversationId}, false, 'setConversationId'),

  setConversations: (data: Conversations) =>
    set({conversations: data}, false, 'setConversations'),

  setEndNode: (data: MessageBody | null) =>
    set({endNode: data}, false, 'setEndNode'),

  setCanStop: (value: boolean) => set({canStop: value}, false, 'setCanStop'),

  setChatModel: (model: string) =>
    set({chatModel: model, endNode: null}, false, 'setChatModel'),

  setAbortSignal: () =>
    set({abortSignal: new AbortController()}, false, 'setAbortSignal'),

  setGenerating: (value: {show: boolean; content: string}) =>
    set({generating: value}, false, 'setGenerating'),

  setHistoryData: (historyData: HistoryDataType[]) =>
    set({historyData}, false, 'setHistoryData'),

  setDeleteConversationId: (conversationDetails: {
    id: string | null;
    title: string | null;
  }) =>
    set(
      {deleteConversationId: conversationDetails},
      false,
      'setDeleteConversationId',
    ),

  setShowHeaderShadow: (value: boolean) =>
    set({showHeaderShadow: value}, false, 'setShowHeaderShadow'),

  resetConversations: () =>
    set(
      {
        conversations: initialSettingData.conversations,
        endNode: null,
        showHeaderShadow: false,
        conversationId: null,
        abortSignal: new AbortController(),
        canStop: false,
      },
      false,
      'resetConversations',
    ),

  resetChat: () => {
    set(
      {
        conversationId: null,
        endNode: null,
        canStop: false,
        abortSignal: new AbortController(),
        generating: {
          show: false,
          content: '',
        },
        showHeaderShadow: false,
        deleteConversationId: {
          id: null,
          title: null,
        },
        conversations: initialSettingData.conversations,
      },
      false,
      'resetChat',
    );
  },

  setIsShowLoader: (value: boolean) =>
    set({isShowLoader: value}, false, 'setIsShowLoader'),
  setDidResponseFail: (value: ChatSliceInitialState['didResponseFail']) =>
    set({didResponseFail: value}, false, 'setDidResponseFail'),
});
