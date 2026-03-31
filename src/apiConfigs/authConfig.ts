import Config from 'react-native-config';

export const getConfig = () => ({
  issuer: Config.ISSUER,
  clientId: Config.CLIENT_ID,
  redirectUrl: Config.REDIRECT_URL,
  scopes: ['User.Read', 'profile', 'openid', 'offline_access'],
  serviceConfiguration: {
    authorizationEndpoint: `${Config.AUTHORITY_URL}/oauth2/v2.0/authorize`,
    tokenEndpoint: `${Config.AUTHORITY_URL}/oauth2/v2.0/token`,
    revocationEndpoint: `${Config.AUTHORITY_URL}/oauth2/v2.0/logout`,
  },
  additionalParameters: {
    prompt: 'select_account',
  },
});
