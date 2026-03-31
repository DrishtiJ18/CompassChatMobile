import React, {useEffect, useState} from 'react';
import {ChatMessageProps} from './types';
import Message from './Message';

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  mainObj,
  regenerate,
  editPrompt,
  selectedIndexRef,
  onOpenCitation,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const childrenObjects = Array.isArray(message)
    ? message.map(msg => mainObj[msg])
    : null;

  const handleSetSelectedIndex = (index: number) => {
    selectedIndexRef.current = index;
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (!mainObj[message[selectedIndex]]?.children && selectedIndex !== 0) {
      handleSetSelectedIndex(0);
    }
  }, [mainObj, message, selectedIndex]);

  return (
    <>
      <Message
        message={childrenObjects}
        setSelectedIndex={handleSetSelectedIndex}
        selectedIndex={selectedIndex}
        mainObj={mainObj}
        onRegenerate={regenerate}
        editPrompt={editPrompt}
        onOpenCitation={onOpenCitation}
      />
      {!!mainObj[message[selectedIndex]]?.children?.length && (
        <ChatMessage
          message={mainObj[message[selectedIndex]]?.children || []}
          mainObj={mainObj}
          regenerate={regenerate}
          editPrompt={editPrompt}
          selectedIndexRef={selectedIndexRef}
          onOpenCitation={onOpenCitation}
        />
      )}
    </>
  );
};

export default ChatMessage;
