import React from 'react';
declare module 'react-native-config' {
  export interface NativeConfig {
    BASE_URL: string;
    CLIENT_NAME: string;
    BASE_PATH: string;
    CLIENT_ID: string;
    AUTHORITY_URL: string;
    CHAT_MODELS: string;
    ISSUER: string;
    REDIRECT_URL: string;
    GPT: string;
    Jais: string;
    APP_LOGO: string;
    LOGO_SIZE: string;
    APP_NAME: string;
    ENABLE_RETRY: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
