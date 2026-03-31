import React from 'react';
import CustomTouchableOpacity from '../custom/CustomTouchableOpacity';
import CustomText from '../custom/CustomText';

type PromptCardType = {
  title?: string;
  content?: string;
  onSend?: (title: string) => void;
  index?: number;
};

const PromptCard = ({
  title = '',
  content = '',
  onSend = () => {},
  index,
}: PromptCardType): JSX.Element => {
  return (
    <CustomTouchableOpacity
      className="w-full px-8 py-6 mb-6 rounded-2xl bg-history-border bg-slate-100 border-1 border-slate-200 justify-center items-center inline-flex"
      onHandlePress={() => onSend(title)}
      testID={`default-prompt-${index}`}>
      <CustomText
        styles="text-center text-primary-black font-normal text-[16px] leading-6 text-Montserrat"
        testID={`prompt-${index}`}>
        {title}
      </CustomText>
    </CustomTouchableOpacity>
  );
};

export default PromptCard;
