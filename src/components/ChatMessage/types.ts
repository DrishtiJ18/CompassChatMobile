export type Message = {
  parent: string;
  children?: string[] | null;
  message: {
    id: string;
    author: {
      role: string;
    };
    create_time: string;
    content: {
      content_type: string;
      content: string;
    };
  };
  id: string;
  isFinal?: boolean;
  onOpenCitation: () => void;
};

export type Mapping = {
  [key: string]: Message;
};

export type ChatMessageProps = {
  message: string[];
  mainObj: Mapping;
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
  onOpenCitation: (fileUrl: any, name: any, pageNumber: any) => void;
};
