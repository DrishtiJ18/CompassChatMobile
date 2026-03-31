export type AuthStackParamList = {
  Home: undefined;
};

export type AuthNavigatorPropType = {
  initialRoute: keyof AuthStackParamList;
};

export type AuthNavigatorConstantType = Array<ScreenNavigatorType>;

export interface ScreenNavigatorType {
  key: number;
  name: string;
  Component: () => JSX.Element;
  header?: {
    headerShown?: boolean;
    headerTitle?: () => JSX.Element;
    headerLeft?: () => JSX.Element;
    headerRight?: () => JSX.Element;
  };
}

export interface ScreenNameType {
  [key: string]: string;
}
