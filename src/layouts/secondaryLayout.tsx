import React from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {styled} from 'nativewind';
import Header from './header'; // Import your MobileHeader component
import {useStore} from '@src/stores';
import BG from '../assets/images/bg.png';

const SecondaryLayout = ({children}): React.JSX.Element => {
  // Define styled components
  const StyledView = styled(View);
  const StyledSafeAreaView = styled(SafeAreaView);
  const StyledImageBackground = styled(ImageBackground);
  const loading = useStore(state => state.loading);
  return (
    <StyledSafeAreaView className="flex-1">
      <StyledView className="flex-1 w-full h-full">
        <StyledView className="flex-1 w-full h-full">
          <StyledImageBackground source={BG} className="flex-1 w-full h-full">
            {loading ? (
              <StyledView className="flex-1 flex-row justify-center items-center">
                <ActivityIndicator size={'large'} />
              </StyledView>
            ) : (
              <StyledView className="flex-1 w-full h-full flex flex-col">
                <Header />
                {children}
                {/* Render the child components (equivalent of <Outlet /> in React Router) */}
              </StyledView>
            )}
          </StyledImageBackground>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default SecondaryLayout;
