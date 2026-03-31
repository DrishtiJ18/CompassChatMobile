import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Screens from './constant';
import {
  ScreenNavigatorType,
  UnAuthNavigatorPropType,
  UnAuthStackParamList,
} from './types';

const UnAuthStackNavigator = createNativeStackNavigator<UnAuthStackParamList>();

export default function UnAuthNavigator({
  initialRoute,
}: UnAuthNavigatorPropType): JSX.Element {
  return (
    <UnAuthStackNavigator.Navigator
      initialRouteName={initialRoute as keyof UnAuthStackParamList}
      screenOptions={{
        headerShown: false,
        headerTitle: '',
      }}>
      {Array.from(Screens, ({Component, name, header}: ScreenNavigatorType) => {
        return (
          <UnAuthStackNavigator.Screen
            component={Component}
            key={name}
            name={name as keyof UnAuthStackParamList}
            options={header}
          />
        );
      })}
    </UnAuthStackNavigator.Navigator>
  );
}
