import moment from 'moment';
import {privateApi, requestMethod} from '..';
import {apiCall} from '../apiCalls/apiCall';
import {streamApiCall} from '../apiCalls/streamingApiCall';
import axios from 'axios';
import Config from 'react-native-config';

export const chatCompletion = ({body, abortSignal, eventCallBack}) => {
  return streamApiCall({
    interceptor: privateApi,
    method: requestMethod.post,
    url: '/conversation',
    requestBody: body,
    abortSignal,
    onEvenStreamCallBack: eventCallBack,
  });
};

export const getConversation = async (id: string | null) => {
  return apiCall({
    interceptor: privateApi,
    method: requestMethod.get,
    url: `/conversation/${id}/messages`,
  });
};

export const getHistory = async () => {
  const fromDate = moment()
    .subtract(30, 'days')
    .locale('en')
    .format('YYYY-MM-DD');
  const toDate = moment().add(1, 'days').locale('en').format('YYYY-MM-DD');
  const queryString = `&from_date=${fromDate}&to_date=${toDate}`;
  return apiCall({
    interceptor: privateApi,
    method: requestMethod.get,
    url: `/conversation/history?limit=9999${queryString}`,
  });
};

export const deleteConversation = async (conversationId = '') => {
  return apiCall({
    interceptor: privateApi,
    method: requestMethod.delete,
    url: `/conversation?conversation_id=${conversationId}`,
  });
};

export const getConfig = async (organizationId: string) => {
  return axios.get(`${Config.BASE_URL}/chat/${organizationId}/config/index.js`);
};

export const getUser = async () => {
  return apiCall({
    interceptor: privateApi,
    method: requestMethod.get,
    url: '/user',
  });
};

export const handleEvent = async (body: {type: string}) => {
  return apiCall({
    interceptor: privateApi,
    method: requestMethod.post,
    url: '/event',
    requestBody: body,
  });
};

export const getCitation = async (citation = "") => {
  return apiCall({
    interceptor: privateApi,
    method: requestMethod.post,
    url: `/conversation/getcitation`,
    requestBody: {
      citation,
    },
  });
};
