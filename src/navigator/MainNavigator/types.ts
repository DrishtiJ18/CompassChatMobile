export type MainStackParamList = {
  AuthScreen: undefined;
  UnAuthScreen: undefined;
};

export type MainNavigatorPropType = {
  initialRoute: keyof MainStackParamList;
};
