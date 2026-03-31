import React, {Ref, useEffect, useState} from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {SheetProvider} from 'react-native-actions-sheet';
import MainNavigator from '@src/navigator/MainNavigator';
import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import EncryptedStorage from 'react-native-encrypted-storage';
import {MainStackParamList} from '@src/navigator/MainNavigator/types';
import './src/translation/config';
import '@src/components/Modals/sheets';
import {NetInfoProvider} from '@src/context/NetInfoContext';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const navigationRef:
  | Ref<NavigationContainerRef<MainStackParamList>>
  | undefined = createNavigationContainerRef();

function App(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState<string>('');

  useEffect(() => {
    SplashScreen.hide();
    AsyncStorage.getItem('EnvVariables')
      .then(res => {
        if (res) {
          const parsed = JSON.parse(res);
          Config.CLIENT_ID = parsed.VITE_SSO_CLIENT_ID;
          Config.AUTHORITY_URL = parsed.VITE_SSO_AUTHORITY;
          Config.CLIENT_NAME = parsed.VITE_CLIENT_PATH;
          Config.GPT = parsed.VITE_CHAT_MODELS.GPT;
          Config.Jais = parsed.VITE_CHAT_MODELS.Jais;
          Config.APP_LOGO = parsed.VITE_LOGO;
          Config.ISSUER = parsed.VITE_SSO_AUTHORITY?.match(
            /^(https:\/\/[^\/]+\/)/,
          )[1];
          if (parsed?.VITE_LOGO_SIZE) {
            Config.LOGO_SIZE = parsed.VITE_LOGO_SIZE;
          }
        }
      })
      .catch(err => console.log('err<<<++', err));
  }, []);

  useEffect(() => {
    EncryptedStorage.getItem('auth_token')
      .then(authDetails => {
        if (authDetails && JSON.parse(authDetails)?.idToken) {
          setInitialRoute('AuthScreen');
        } else {
          setInitialRoute('UnAuthScreen');
        }
      })
      .catch(err => {
        console.log('onmount err', err);

        setInitialRoute('UnAuthScreen');
      });
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NetInfoProvider>
        <SheetProvider>
          <NavigationContainer ref={navigationRef}>
            {!!initialRoute && <MainNavigator initialRoute={initialRoute} />}
          </NavigationContainer>
        </SheetProvider>
      </NetInfoProvider>
    </GestureHandlerRootView>
  );
}

export default App;
