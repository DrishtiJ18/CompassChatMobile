import Home from '@src/screens/Home';
import {Keyboard} from 'react-native';
import screenNameConstants from './screenNameConstants';
import {AuthNavigatorConstantType} from './types';
import DrawerNavigator from '../Drawer';
import CitationFiles from '@src/components/ChatContainer/CitationFiles';

const MainNavigatorConstant: AuthNavigatorConstantType = [
  {
    key: 1,
    name: screenNameConstants.HOME_SCREEN,
    Component: () =>
      DrawerNavigator({
        component: Home,
        name: screenNameConstants.DRAWER_HOME_SCREEN,
        // headerLeft: () =>
        //   MenuComponent(() => {
        //     return navigationRef?.dispatch(
        //       DrawerActions.toggleDrawer(),
        //       Keyboard.dismiss(),
        //     );
        //   }),
        headerTitle: '',
      }),
    header: {
      headerShown: false,
    },
  },
  {
    key: 2,
    name: screenNameConstants.CITATION_FILES_SCREEN,
    Component: CitationFiles,
    header: {
      headerShown: false,
    },
  },
];

export default MainNavigatorConstant;
