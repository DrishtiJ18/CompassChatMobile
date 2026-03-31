import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, ActivityIndicator} from 'react-native';

import CustomInput from '@src/components/custom/CustomInput';
import CustomText from '@src/components/custom/CustomText';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import Close from '@images/drawer/close.svg';
import Modal from 'react-native-modal';

interface OrganizationSelectorModal {
  openModal: boolean;
  onUserInput(value: string): void;
  organizationId: string;
  invalidText: string;
  fetchConfig: () => Promise<void>;
  loader: boolean;
  onCloseModal(): void;
}

export default function OrganizationSelectorModal({
  openModal,
  onUserInput,
  organizationId,
  invalidText,
  fetchConfig,
  loader,
  onCloseModal,
}: OrganizationSelectorModal) {
  const {t: translate} = useTranslation();

  return (
    <Modal isVisible={openModal} testID="org-selector-modal">
      <View
        className="flex-1 justify-center items-center px-4"
        testID="org-selector-modal-view">
        <View
          className="bg-white rounded-xl w-[95%] pb-6 px-2"
          testID="org-selector-modal-inner-view">
          <CustomTouchableOpacity
            className="flex items-center justify-center self-end h-8 w-8 mt-3"
            onHandlePress={onCloseModal}
            testID="org-selector-modal-close-btn">
            <Close
              height={12}
              width={12}
              color={'#94A3B8'}
              testID="org-selector-modal-close-icon"
            />
          </CustomTouchableOpacity>

          <View className="px-3">
            <CustomText
              styles={
                'my-1 font-medium text-left text-[#1b1b19] font-montserrat text-base'
              }
              testID="enter-org-id">
              {translate('landing_page.enter_org_id')}
            </CustomText>

            <CustomInput
              onUserInput={onUserInput}
              text={organizationId}
              textInputViewStyles={
                'border border-slate-500 rounded-xl h-11 my-3 flex justify-center'
              }
              textInputStyles={'text-sm font-normal rounded-xl px-3 py-2'}
              placeholderText={translate(
                'landing_page.enter_org_id_placeholder',
              )}
              editable={!loader}
            />

            {invalidText && (
              <CustomText
                styles={'text-red-500 font-medium text-center mb-4'}
                testID="invalid-org">
                {invalidText}
              </CustomText>
            )}

            <CustomTouchableOpacity
              className="mt-2 bg-teal-400 w-[70px] h-[35px] self-center items-center justify-center rounded-lg"
              onHandlePress={fetchConfig}
              testID="org-selector-modal-submit-btn">
              {loader ? (
                <ActivityIndicator testID="submit-btn-loader" />
              ) : (
                <CustomText
                  styles={'text-white uppercase p-1'}
                  testID="org-selector-modal-submit">
                  {translate('landing_page.submit')}
                </CustomText>
              )}
            </CustomTouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
