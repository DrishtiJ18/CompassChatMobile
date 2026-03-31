export type UnAuthStackParamList = {
  Home: undefined;
};

export type UnAuthNavigatorPropType = {
  initialRoute: keyof UnAuthStackParamList;
};

export type UnAuthNavigatorConstantType = Array<ScreenNavigatorType>;

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
