import React, {useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Screens from './constant';
import {
  AuthNavigatorPropType,
  AuthStackParamList,
  ScreenNavigatorType,
} from './types';

const AuthStackNavigator = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator({
  initialRoute,
}: AuthNavigatorPropType): JSX.Element {
  const ScreenOption = useMemo(function () {
    return {
      headerShown: false,
    };
  }, []);

  return (
    <AuthStackNavigator.Navigator
      screenOptions={ScreenOption}
      initialRouteName={initialRoute as keyof AuthStackParamList}>
      {Array.from(Screens, ({Component, name, header}: ScreenNavigatorType) => {
        return (
          <AuthStackNavigator.Screen
            component={Component}
            key={name}
            name={name as keyof AuthStackParamList}
            options={header}
          />
        );
      })}
    </AuthStackNavigator.Navigator>
  );
}
