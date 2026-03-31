import {parseContentDraft} from '@src/utils';
import {AxiosInstance, AxiosRequestConfig, GenericAbortSignal} from 'axios';

interface ApiCallParams {
  interceptor: AxiosInstance;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  url: string;
  requestBody?: unknown;
  onEvenStreamCallBack: (progressEvent: {
    content: string;
    isFinal: boolean;
    convoDetails: unknown;
  }) => void;
  abortSignal: GenericAbortSignal;
}

export const streamApiCall = async ({
  interceptor,
  method,
  url,
  requestBody = '',
  abortSignal,
  onEvenStreamCallBack = () => {},
}: ApiCallParams): Promise<{
  content: string;
  isFinal: boolean;
  convoDetails: unknown;
}> => {
  try {
    let conversationDetails;
    const config: AxiosRequestConfig = {
      method,
      url,
      ...(method !== 'get' ? {data: requestBody} : {}),
      onDownloadProgress(progressEvent) {
        const formattedRes = parseContentDraft(
          progressEvent?.event?.currentTarget?.response ||
            progressEvent?.event?.target?.response ||
            '',
          conversationDetails,
        );

        conversationDetails = formattedRes.convoDetails;
        onEvenStreamCallBack(formattedRes);
      },
      responseType: 'stream',
      signal: abortSignal,
    };

    const response = await interceptor(config);
    const newRes = parseContentDraft(response?.data, conversationDetails);
    return newRes;
  } catch (error) {
    return Promise.reject(error);
  }
};
