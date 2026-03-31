import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import EditSquare from '@images/drawer/edit_square.svg';
import CustomText from '../custom/CustomText';
import CustomTouchableOpacity from '../custom/CustomTouchableOpacity';

interface ChatHistoryTitlePropType {
  onNewChat(): void;
}

function ChatHistoryTitle({onNewChat}: ChatHistoryTitlePropType): JSX.Element {
  const {t: translation} = useTranslation();
  return (
    <View
      className="flex flex-row  justify-between items-center"
      testID="chat-history-title-view">
      <CustomText
        styles="text-slate-500 text-base font-medium"
        testID="chat-history">
        {translation('side_bar.chat_history')}
      </CustomText>

      <CustomTouchableOpacity
        className="cursor-pointer self-center w-11 h-11 flex justify-center items-end"
        onHandlePress={onNewChat}
        testID="chat-history-edit-btn">
        <EditSquare
          height={19}
          width={19}
          color={'#94A3B8'}
          testID="chat-history-edit-icon"
        />
      </CustomTouchableOpacity>
    </View>
  );
}

export default ChatHistoryTitle;
