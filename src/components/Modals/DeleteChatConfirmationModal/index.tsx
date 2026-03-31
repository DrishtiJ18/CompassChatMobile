import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';

import CustomText from '@src/components/custom/CustomText';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import Close from '@images/drawer/close.svg';
import {textDirection} from '@src/utils/UiUtils';
import {useStore} from '@src/stores';

interface ModalPropType {
  isVisible: boolean;
  onCloseConfirmationModal: () => void;
  chatTitle: string;
  onDeleteChatAfterConfirmation: () => void;
}

export default function DeleteChatConfirmationModal({
  isVisible,
  onCloseConfirmationModal,
  chatTitle,
  onDeleteChatAfterConfirmation,
}: ModalPropType) {
  const {t: translate} = useTranslation();
  const language = useStore(state => state.language);

  const deleteChatTitle = useMemo(() => {
    if (chatTitle && chatTitle?.length >= 60) {
      return `${chatTitle?.substring(0, 60)}...`;
    }

    return chatTitle;
  }, [chatTitle]);

  return (
    <Modal isVisible={isVisible} testID="delete-confirmation-modal">
      <View
        className="bg-white pt-1 rounded-lg"
        testID="delete-confirmation-modal-view">
        <View
          className="flex flex-row justify-between border-slate-200 border-b p-3"
          testID="delete-confirmation-modal-header-view">
          <CustomText
            styles="font-medium text-sm text-primary-black "
            testID="delete-chat">
            {translate('side_bar.delete_chat')}
          </CustomText>

          <CustomTouchableOpacity
            className="flex items-center justify-center self-end"
            onHandlePress={onCloseConfirmationModal}
            testID="delete-confirmation-modal-close-btn">
            <Close
              height={12}
              width={12}
              color={'red'}
              testID="delete-confirmation-modal-close-icon"
            />
          </CustomTouchableOpacity>
        </View>

        <View className="p-3" testID="delete-confirmation-modal-text-view">
          <CustomText
            styles="text-sm text-primary-black text-left py-2"
            testID="this-will-delete">
            {translate('side_bar.this_will_delete')}
          </CustomText>
          <CustomText
            styles={`text-sm text-primary-black w-full text-${textDirection(
              language,
              chatTitle,
            )}`}
            testID={`${deleteChatTitle}`}>
            {`${deleteChatTitle}`}
          </CustomText>
        </View>

        <View
          className="flex flex-row justify-end p-3 pb-4 gap-4"
          testID="delete-confirmation-modal-bottom-view">
          <CustomTouchableOpacity
            className="border rounded-[100px] border-[#e5e7eb] w-[70px] h-[40px] flex justify-center items-center"
            onHandlePress={onCloseConfirmationModal}
            testID="delete-confirmation-modal-cancel-btn">
            <View className="w-[60px] h-[30px] flex items-center justify-center">
              <CustomText
                styles="text-[#1b1b19] font-medium capitalize"
                testID="delete-confirmation-modal-cancel">
                {translate('side_bar.cancel')}
              </CustomText>
            </View>
          </CustomTouchableOpacity>

          <CustomTouchableOpacity
            className="border rounded-[100px] border-red-600 w-[70px] h-[40px] justify-center items-center"
            onHandlePress={onDeleteChatAfterConfirmation}
            testID="delete-confirmation-modal-delete-btn">
            <View className="w-[60px] h-[30px] flex items-center justify-center bg-red-600 rounded-[100px]">
              <CustomText
                styles=" text-sm text-white capitalize"
                testID="delete-confirmation-modal-delete">
                {translate('side_bar.delete')}
              </CustomText>
            </View>
          </CustomTouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
