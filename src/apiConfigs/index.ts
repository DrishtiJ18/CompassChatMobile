import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {jwtDecode} from 'jwt-decode';

import {logOut} from '@src/utils';
import {refreshToken} from './tokens';
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  ApiError?: AxiosError;
}
interface CustomAxiosErrorConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface JwtPayload {
  exp: number;
}

const isTokenExpired = (token: string): boolean => {
  if (!token) {
    return true;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

const getStoredToken = async (): Promise<string | null> => {
  try {
    const authDetails = await EncryptedStorage.getItem('auth_token');
    return JSON.parse(authDetails)?.accessToken;
  } catch (error) {
    console.error('Error retrieving token from storage:', error);
    return null;
  }
};

const BASE_URL = Config.BASE_URL + Config.CLIENT_NAME + Config.BASE_PATH+'/rag';

const createAxiosInstance = (
  baseURL: string,
  withCredentials = false,
): AxiosInstance => {
  const instance = axios.create({baseURL, withCredentials});

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Headers'] = '*';
      config.headers['content-type'] = 'application/json';
      const accessToken = await getStoredToken();
      let token = accessToken;

      if (accessToken && isTokenExpired(accessToken)) {
        token = await refreshToken();
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosErrorConfig;
      if (!originalRequest) {
        return Promise.reject(error);
      }
      if (
        (error?.response?.status === 401 || error?.response?.status === 403) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        // Attempt to refresh the access token
        try {
          const token = await refreshToken();
          if (token) {
            // If the token is successfully refreshed, update the Authorization header and retry the original request
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          // If refreshing the token fails, logout user
          await logOut();
          console.error('Failed to refresh token:', refreshError);
          return Promise.reject(refreshError);
        }
      } else if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        await logOut();
      }
      const modifiedError = error as CustomAxiosRequestConfig;
      modifiedError.ApiError = error;
      return Promise.reject(modifiedError);
    },
  );

  return instance;
};

const unAuthorizedInstance = createAxiosInstance(BASE_URL);
const authorizedInstance = createAxiosInstance(BASE_URL, true);

export const setTokenForPrivate = (token: string): void => {
  if (token) {
    authorizedInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token}`;
  } else {
    delete authorizedInstance.defaults.headers.common['Authorization'];
  }
};

export const requestMethod = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch',
} as const;

export const api = unAuthorizedInstance;
export const privateApi = authorizedInstance;
