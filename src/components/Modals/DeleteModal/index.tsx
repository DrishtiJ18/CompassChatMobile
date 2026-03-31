/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {View} from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import {useTranslation} from 'react-i18next';

import Delete from '@images/drawer/deleteIcon.svg';
import {isIos} from '@src/utils/UiUtils';
import CustomText from '../../custom/CustomText';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';

function DeleteModal({
  sheetId,
  payload,
}: SheetProps<{sheetId: string; onDeleteChat: Function}>): JSX.Element {
  const {t: translation} = useTranslation();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <ActionSheet
      id={sheetId}
      testIDs={{modal: 'delete-modal',sheet:"delete-sheet"}}
      ref={actionSheetRef}
      accessibilityLabel="delete-model"
      isModal={true}
      useBottomSafeAreaPadding={true}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
      }}
      gestureEnabled={true}>
      <CustomTouchableOpacity
        className={`flex flex-row items-center px-6 pt-2 ${
          isIos() ? 'pb-2' : 'pb-6'
        }`}
        onHandlePress={payload?.onDeleteChat}
        testID="delete-chat-btn">
        <View
          className="h-8 w-8 flex items-center justify-center"
          testID="delete-chat-icon">
          <Delete height={24} width={22} testID="delete-icon" />
        </View>

        <CustomText
          styles="text-primary-black font-medium leading-6 text-base ml-4 font-Montserrat"
          testID="delete-chat">
          {translation('side_bar.delete_chat')}
        </CustomText>
      </CustomTouchableOpacity>
    </ActionSheet>
  );
}

export default DeleteModal;
