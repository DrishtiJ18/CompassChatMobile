import React from 'react';
import CustomPressable from '../CustomPressable';
import {Text} from 'react-native';

export default function MenuComponent(onPress: () => void): JSX.Element {
  return (
    <CustomPressable style={{height: 20, width: 20}} onPress={onPress}>
      <Text>{'Menu'}</Text>
    </CustomPressable>
  );
}
