import {useStore} from '@src/stores';
import React, {ReactNode} from 'react';
import {Text} from 'react-native';

interface CustomTextPropType {
  styles?: string;
  children: ReactNode;
  numberOfLines?: number;
  testID?: string;
}

function CustomText({
  styles,
  children,
  numberOfLines,
  testID,
}: CustomTextPropType): JSX.Element {
  const language = useStore(state => state.language);

  return (
    <Text
      numberOfLines={numberOfLines}
      testID={`${testID}-text`}
      className={`text-sm font-normal ${
        language === 'en' ? 'text-left' : 'text-right'
      } ${styles ?? ''}`}>
      {children}
    </Text>
  );
}

export default CustomText;
