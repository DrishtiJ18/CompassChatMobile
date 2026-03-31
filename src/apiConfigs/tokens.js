import {authorize, refresh} from 'react-native-app-auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {jwtDecode} from 'jwt-decode';
import {getConfig} from '@src/apiConfigs/authConfig';
import {logOut} from '@src/utils';

export const authorizeUser = async () => {
  try {
    const config = getConfig();
    const {refreshToken, accessToken, idToken} = await authorize(config);
    const decodedResult = jwtDecode(idToken);
    const authTokenData = {
      refreshToken,
      accessToken,
      idToken,
      userName: decodedResult.name,
    };

    await EncryptedStorage.setItem('auth_token', JSON.stringify(authTokenData));

    return decodedResult;
  } catch (error) {
    console.error('Error acquiring token:', error.message || error);
    return null;
  }
};

export const refreshToken = async () => {
  try {
    const authDetails = await EncryptedStorage.getItem('auth_token');

    if (!authDetails) {
      return null;
    }
    const config = getConfig();
    const result = await refresh(config, {
      refreshToken: JSON.parse(authDetails)?.refreshToken,
    });

    if (!result?.accessToken) {
      await logOut();
      return null;
    }

    const {refreshToken: newRefreshToken, accessToken, idToken} = result;
    const decodedResult = idToken ? jwtDecode(idToken) : {};

    const authTokenData = {
      refreshToken: newRefreshToken,
      accessToken,
      idToken,
      userName: decodedResult?.name || authDetails?.userName,
    };
    await EncryptedStorage.setItem('auth_token', JSON.stringify(authTokenData));

    return accessToken;
  } catch (err) {
    console.log('refreshToken err', err);
    await logOut();
    return null;
  }
};
