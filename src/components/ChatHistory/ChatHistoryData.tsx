import React from 'react';
import {View} from 'react-native';
import {useStore} from '@src/stores';
import {HistoryDataType} from '@src/utils/types';
import ThreeDots from '@images/drawer/three_dots.svg';
import CustomText from '../custom/CustomText';
import {textDirection} from '@src/utils/UiUtils';
import CustomTouchableOpacity from '../custom/CustomTouchableOpacity';

interface ChatHistoryDataPropType {
  item: HistoryDataType;
  handleClick: (item: HistoryDataType) => () => void;
  onOpenDeleteModal(id: string, title: string): void;
  testId: string;
}

function ChatHistoryData({
  item,
  handleClick,
  onOpenDeleteModal,
  testId,
}: ChatHistoryDataPropType): JSX.Element {
  const conversationId = useStore(state => state.conversationId);
  const language = useStore(state => state.language);

  return (
    <View
      key={item?.conversation_id}
      className="py-2 flex flex-row border-slate-200 border-b items-center justify-center"
      testID={`${testId}-chat-view`}>
      <CustomTouchableOpacity
        className="w-[90%] h-full pt-3"
        onHandlePress={() => handleClick(item)}
        testID={`${testId}-chat-btn`}>
        <CustomText
          numberOfLines={1}
          testID={`${testId}-chat`}
          styles={`whitespace-nowrap text-[14px] leading-5 text-${textDirection(
            language,
            item?.title,
          )}
          ${
            conversationId === item?.conversation_id
              ? 'text-black font-medium'
              : 'text-slate-700 font-normal'
          } `}>
          {item?.title}
        </CustomText>
      </CustomTouchableOpacity>

      <CustomTouchableOpacity
        className="h-10 flex items-end justify-center w-[10%] pr-2"
        testID={`${testId}-three-dots-view`}
        onHandlePress={() =>
          onOpenDeleteModal(item.conversation_id, item.title)
        }>
        <ThreeDots
          height={16}
          width={4}
          color={'#94A3B8'}
          testID={`${testId}-three-dots-icon`}
        />
      </CustomTouchableOpacity>
    </View>
  );
}

export default ChatHistoryData;
