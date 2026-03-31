/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {Dimensions, StyleProp, ViewStyle} from 'react-native';
import {PopoverProps} from 'react-native-popover-view/dist/Types';
import Popover from 'react-native-popover-view/dist/Popover';
import {useStore} from '@src/stores';
import {isIos} from '@src/utils/UiUtils';

interface CustomPopoverProps extends PopoverProps {
  children: ReactNode;
  popoverStyle?: StyleProp<ViewStyle>;
  popoverWidth?: number;
  from: ReactNode;
  testID: string;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({
  popoverStyle,
  popoverWidth,
  children,
  arrowSize,
  backgroundStyle,
  from,
  testID,
  ...rest
}) => {
  const screenWidth = Dimensions.get('window').width;
  const language = useStore(state => state.language);

  return (
    <Popover
      arrowSize={arrowSize || {width: 0, height: 0}}
      backgroundStyle={backgroundStyle || {opacity: 0}}
      popoverStyle={
        popoverStyle || {
          width: popoverWidth || screenWidth * 0.7,
          marginLeft: language === 'en' ? -5 : screenWidth * 0.17,
          borderBottomWidth: isIos() ? 0 : 1,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5, // For Android shadow
        }
      }
      from={from}
      testID={`${testID}-popover`}
      {...rest}>
      {children}
    </Popover>
  );
};

export default CustomPopover;
