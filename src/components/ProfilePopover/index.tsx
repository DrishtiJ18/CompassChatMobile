import React from 'react';
import {useTranslation} from 'react-i18next';

import {useStore} from '@src/stores';
import CustomTouchableOpacity from '../custom/CustomTouchableOpacity';
import CustomText from '../custom/CustomText';
import {View} from 'react-native';

interface ProfilePopoverPropType {
  onUserLogOut: () => Promise<void>;
}

export default function ProfilePopover({onUserLogOut}: ProfilePopoverPropType) {
  const {t: translate} = useTranslation();
  const userDetails = useStore(state => state.userDetails);

  return (
    <View testID="user-profile-modal-view">
      <View
        className="py-4 mx-4 border-b border-slate-200"
        testID="user-email-view">
        <CustomText
          styles="text-sm font-normal font-Montserrat text-primary-black text-left"
          testID="user-email">
          {userDetails.email}
        </CustomText>
      </View>

      <CustomTouchableOpacity
        className="p-4"
        onHandlePress={onUserLogOut}
        testID="logout-btn">
        <CustomText
          styles="text-base font-medium font-Montserrat text-primary-black text-left"
          testID="logout">
          {translate('profile.logout')}
        </CustomText>
      </CustomTouchableOpacity>
    </View>
  );
}
