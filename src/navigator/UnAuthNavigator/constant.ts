import LandingPage from '@src/screens/LandingPage';
import screenNameConstants from './screenNameConstants';
import {UnAuthNavigatorConstantType} from './types';

const MainNavigatorConstant: UnAuthNavigatorConstantType = [
  {
    key: 1,
    name: screenNameConstants.LANDING_SCREEN,
    Component: LandingPage,
  },
];

export default MainNavigatorConstant;
