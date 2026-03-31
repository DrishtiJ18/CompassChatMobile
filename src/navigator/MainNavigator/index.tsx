import React, {useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainNavigatorPropType, MainStackParamList} from './types';
import AuthNavigator from '../AuthNavigator';
import UnAuthNavigator from '../UnAuthNavigator';

const MainStackNavigator = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator({
  initialRoute,
}: MainNavigatorPropType): JSX.Element {
  const ScreenOption = useMemo(function () {
    return {
      headerShown: false,
    };
  }, []);
  return (
    <MainStackNavigator.Navigator
      initialRouteName={initialRoute}
      screenOptions={ScreenOption}>
      <MainStackNavigator.Screen
        name="AuthScreen"
        component={AuthNavigator}
        key="AuthScreen"
      />
      <MainStackNavigator.Screen
        name="UnAuthScreen"
        component={UnAuthNavigator}
        key="UnAuthScreen"
      />
    </MainStackNavigator.Navigator>
  );
}
