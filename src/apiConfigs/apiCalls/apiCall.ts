import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from 'axios';

interface ApiCallParams {
  interceptor: AxiosInstance;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  url: string;
  requestBody?: unknown;
  responseType?: ResponseType;
}

export const apiCall = async ({
  interceptor,
  method,
  url,
  requestBody = '',
  responseType = 'json',
}: ApiCallParams): Promise<AxiosResponse> => {
  // console.log("data====>>", { interceptor, method, url, requestBody });

  const config: AxiosRequestConfig = {
    method,
    url,
    ...(method !== 'get' ? {data: requestBody} : {}),
    responseType,
  };

  try {
    const response = await interceptor(config);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
