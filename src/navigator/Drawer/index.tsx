import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import {Platform} from 'react-native';

export type DrawerNavigatorProps = {
  component: () => JSX.Element;
  name: string;
  headerLeft?:
    | ((props: {
        tintColor?: string | undefined;
        pressColor?: string | undefined;
        pressOpacity?: number | undefined;
        labelVisible?: boolean | undefined;
      }) => React.ReactNode)
    | undefined;
  headerRight?:
    | ((props: {
        tintColor?: string | undefined;
        pressColor?: string | undefined;
        pressOpacity?: number | undefined;
      }) => React.ReactNode)
    | undefined;
  headerTitle?: string | (() => JSX.Element);
};

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({
  component,
  name,
  headerLeft,
  headerRight,
  headerTitle,
}: DrawerNavigatorProps): JSX.Element {
  const Component = component;

  function customDrawerComponent(props: DrawerContentComponentProps) {
    return <CustomDrawer {...props} />;
  }

  const drawerOptions: DrawerNavigationOptions = React.useMemo(
    function (): DrawerNavigationOptions {
      return {
        drawerType: 'front',
        headerShown: false,
        headerTitleAlign: 'center',
        overlayColor: 'transparent',
        drawerHideStatusBarOnOpen: false,
        drawerContentStyle: {
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        drawerStyle: {
          width: '100%',
          marginTop: Platform.OS === 'ios' ? 40 : 0,
        },
        header: () => null,
      };
    },
    [],
  );

  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      screenOptions={drawerOptions}
      drawerContent={customDrawerComponent}>
      <Drawer.Screen
        name={name}
        component={Component}
        options={{
          drawerType: 'front',
          headerShown: true,
          headerTitle: headerTitle,
          headerLeft: headerLeft,
          headerRight: headerRight,
          headerStyle: {},
        }}
      />
    </Drawer.Navigator>
  );
}
