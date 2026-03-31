import React, {useEffect, useMemo, useContext} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useDrawerStatus} from '@react-navigation/drawer';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

import {useStore} from '@src/stores';
import {getConversation, getHistory} from '@src/apiConfigs/apiServices';
import {GroupedByDate, HistoryDataType} from '@src/utils/types';
import {groupByCreateDate} from '@src/utils';
import CustomText from '../custom/CustomText';
import {showToast, textDirection} from '@src/utils/UiUtils';
import ChatHistoryTitle from './ChatHistoryTitle';
import ChatHistoryData from './ChatHistoryData';
import {NetInfoContext} from '@src/context/NetInfoContext';
interface ChatHistoryPropType {
  onOpenDeleteModal(id: string, title: string): void;
  closeDrawer(): void;
}

function ChatHistory({
  onOpenDeleteModal,
  closeDrawer,
}: ChatHistoryPropType): JSX.Element {
  const {isOnline} = useContext(NetInfoContext);
  const {t: translate} = useTranslation();
  const historyData = useStore(state => state.historyData);
  const setHistoryData = useStore(state => state.setHistoryData);
  const resetChat = useStore(state => state.resetChat);
  const setConversationId = useStore(state => state.setConversationId);
  const setNewMess = useStore(state => state.setConversations);
  const language = useStore(state => state.language);
  const isShowLoader = useStore(state => state.isShowLoader);
  const setIsShowLoader = useStore(state => state.setIsShowLoader);
  const isDrawerOpen = useDrawerStatus() === 'open';

  const groupedByDate: GroupedByDate = useMemo(() => {
    moment.locale(language);
    return groupByCreateDate(historyData, language);
  }, [historyData, language]);

  useEffect(() => {
    if (isDrawerOpen) {
      if (!isOnline) {
        showToast(translate('landing_page.no_internet'));
        return;
      }

      getHistory()
        .then(response => {
          setIsShowLoader(false);
          setHistoryData(response.data);
        })
        .catch(err => {
          console.log('getHistory err', err.toString());
        });
    }
  }, [setHistoryData, isDrawerOpen, setIsShowLoader]);

  const handleClick = async (item: HistoryDataType) => {
    if (!isOnline) {
      showToast(translate('landing_page.no_internet'));
      return;
    }

    closeDrawer();
    setConversationId(item?.conversation_id);
    try {
      const res = await getConversation(item?.conversation_id);
      setNewMess(res?.data?.mapping);
    } catch (error) {
      console.log('Get conversation error', error);
    }
  };

  function onNewChat() {
    resetChat();
    closeDrawer();
  }

  return (
    <View className="mx-4 shrink grow" testID="chat-history-view">
      <ChatHistoryTitle onNewChat={onNewChat} />

      {isShowLoader ? (
        <ActivityIndicator
          size="large"
          className="grow"
          testID="chat-history-loader"
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          testID="chat-history-scroll-view">
          {Object.keys(groupedByDate).map(
            (yearMonth: string, index: number) => (
              <View
                key={yearMonth}
                className="flex flex-col mt-5"
                testID={`${yearMonth}-view`}>
                <CustomText
                  styles={`mb-3 text-3 font-medium text-slate-400 leading-4 text-${textDirection(
                    language,
                    yearMonth,
                  )}`}
                  testID={yearMonth}>
                  {`${yearMonth} `}
                </CustomText>

                {groupedByDate[yearMonth].map((item, itemIndex) => (
                  <ChatHistoryData
                    key={item.conversation_id}
                    item={item}
                    handleClick={handleClick}
                    onOpenDeleteModal={onOpenDeleteModal}
                    testId={`${index}-${itemIndex}`}
                  />
                ))}
              </View>
            ),
          )}
        </ScrollView>
      )}
    </View>
  );
}

export default ChatHistory;
