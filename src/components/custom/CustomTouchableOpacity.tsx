import React, {ReactNode, useContext} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NetInfoContext} from '@src/context/NetInfoContext';
import {showToast} from '@src/utils/UiUtils';

interface CustomTouchableOpacityProps extends TouchableOpacityProps {
  children: ReactNode;
  onHandlePress: Function;
}

const CustomTouchableOpacity: React.FC<CustomTouchableOpacityProps> = ({
  children,
  onHandlePress,
  ...rest
}) => {
  const {isOnline} = useContext(NetInfoContext);
  const {t: translate} = useTranslation();

  return (
    <TouchableOpacity
      {...rest}
      hitSlop={{
        top: 20,
        left: 20,
        bottom: 20,
        right: 20,
      }}
      onPress={() => {
        if (!isOnline) {
          showToast(translate('landing_page.no_internet'));
          return;
        }

        onHandlePress();
      }}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomTouchableOpacity;
