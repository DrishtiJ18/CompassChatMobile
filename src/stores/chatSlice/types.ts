import {HistoryDataType} from '@src/utils/types';

export interface Message {
  children: string[];
  parent: string | null;
  message: string | null;
  id: string;
}
export interface Conversations {
  [conversationId: string]: Message;
}

export interface MessageBody {
  [messageId: string]: {
    children: MessageBody[] | null;
    role: string;
    messageContent: string;
    dateTime: string;
    isFinal?: boolean;
  };
}

type ChatSliceInitialState = {
  conversationId: string | null;
  conversations: Conversations;
  endNode: null | MessageBody;
  canStop: boolean;
  chatModel: string;
  abortSignal: AbortController;
  generating: {
    show: boolean;
    content: string;
  };
  historyData: HistoryDataType[];
  deleteConversationId: {
    id: string | null;
    title: string | null;
  };
  showHeaderShadow: boolean;
  isShowLoader: boolean;
  didResponseFail: {prompt: string; pageIndex?: number};
};

interface ChatSliceState extends ChatSliceInitialState {
  setConversationId: (conversationId: string | null) => void;
  setConversations: (data: Conversations) => void;
  setEndNode: (data: MessageBody | null) => void;
  setChatModel: (model: string) => void;
  setCanStop: (value: boolean) => void;
  setAbortSignal: () => void;
  setGenerating: (value: {show: boolean; content: string}) => void;
  setHistoryData: (historyData: HistoryDataType[]) => void;
  setShowHeaderShadow: (value: boolean) => void;
  resetConversations: () => void;
  setDeleteConversationId: ({
    id,
    title,
  }: {
    id: string | null;
    title: string | null;
  }) => void;
  resetChat: () => void;
  setIsShowLoader: (value: boolean) => void;
  setDidResponseFail: (value: ChatSliceInitialState['didResponseFail']) => void;
}

export type {ChatSliceInitialState, ChatSliceState};
