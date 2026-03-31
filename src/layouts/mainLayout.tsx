import {useStore} from '@src/stores';
import {styled} from 'nativewind';
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const StyledView = styled(View);
const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  // Define styled components
  const loading = useStore(state => state.loading);
  const SafeAreaWrapper = ({children}: {children: React.ReactNode}) => {
    const insets = useSafeAreaInsets();

    return (
      <View style={{flex: 1, paddingTop: insets.top, backgroundColor: 'white'}}>
        {children}
      </View>
    );
  };
  return (
    <>
      {loading ? (
        <StyledView className="flex-1 flex-row justify-center items-center">
          <ActivityIndicator size={'large'} />
        </StyledView>
      ) : (
        <SafeAreaProvider>
          <SafeAreaWrapper>{children}</SafeAreaWrapper>
        </SafeAreaProvider>
      )}
    </>
  );
};

export default MainLayout;
