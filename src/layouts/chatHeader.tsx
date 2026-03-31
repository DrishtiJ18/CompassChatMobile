import React, { useState } from 'react';
import { View, Text, Keyboard, TouchableOpacity, Dimensions } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SheetManager } from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';
import Edit from '@images/header/EditSquare.svg';
import Menu from '@images/header/menu.svg';
import DownArrow from '@images/header/arrow_down.svg';
import { navigationRef } from 'ROOTDIR/App';
import styles from './styles';
import { useStore } from '@src/stores';
import { languageRestart } from '@src/utils/UiUtils';
import { changeLanguage } from '@src/translation/config';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import CustomText from '@src/components/custom/CustomText';
import Profile from '@images/drawer/profile.svg';
import { getInitials, logOut } from '@src/utils';
import ProfilePopover from '@src/components/ProfilePopover';
import CustomPopover from '@src/components/custom/CustomPopover';

interface HeaderPropTypes {
  shadowVisible?: boolean;
  hasChats?: boolean;
}

const Header = ({ shadowVisible = false, hasChats = false }: HeaderPropTypes) => {
  const { t: translate } = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const language = useStore(state => state.language);
  const setLanguage = useStore(state => state.setLanguage);
  const getStyles = styles();
  const resetChat = useStore(state => state.resetChat);
  const conversationId = useStore(state => state.conversationId);
  const chatModel = useStore(state => state.chatModel?.toLowerCase);
  const view = useStore(state => state.view);
  const historyData = useStore(state => state.historyData);
  const setIsShowLoader = useStore(state => state.setIsShowLoader);
  const setLoading = useStore(state => state.setLoading);
  const userDetails = useStore(state => state.userDetails);
  const clearUserDetails = useStore(state => state.clearUserDetails);
  const abortSignal = useStore(state => state.abortSignal);
  const canStop = useStore(state => state.canStop);
  const setCanStop = useStore(state => state.setCanStop);
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const openDrawer = () => {
    if (historyData.length < 1) {
      setIsShowLoader(true);
    }
    navigationRef?.dispatch(DrawerActions.toggleDrawer());
  };

  const languageChange = async () => {
    setLoading(true);
    setLanguage(language === 'en' ? 'ar' : 'en');
    await changeLanguage(language === 'en' ? 'ar' : 'en');
    await AsyncStorage.setItem(
      'conversation_id',
      JSON.stringify({
        conversationId: conversationId,
      }),
    );
    languageRestart(language);
  };

  const onNewChat = async () => {
    if (abortSignal && canStop) {
      abortSignal.abort();
      setCanStop(false);
    }

    setTimeout(async () => {
      await AsyncStorage.removeItem('conversation_id');
      resetChat();
    }, 500);
  };

  function closeDrawer() {
    SheetManager.hide('switch-modal');
  }

  function onAssistantSwitch() {
    Keyboard.dismiss();
    SheetManager.show('switch-modal', {
      payload: { closeDrawer: closeDrawer },
    });
  }

  const onUserLogOut = async () => {
    try {
      setShowPopover(false);
      await logOut(clearUserDetails, setIsShowLoader);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View
      style={shadowVisible ? getStyles.headerShadow : null}
      className={
        'w-full h-[44px] flex-row justify-between items-center pl-[15px] bg-white'
      }
      testID="chat-header-view">
      <View className="flex-row w-[20%]">
        <CustomTouchableOpacity
          className="items-center flex-row"
          onHandlePress={openDrawer}
          testID="header-menu-btn">
          <Menu testID="menu-icon" />
        </CustomTouchableOpacity>

        {hasChats && (
          <CustomTouchableOpacity
            className="w-[44px] ml-5"
            onHandlePress={onNewChat}
            testID="header-edit-icon">
            <Edit className="aspect-square" testID="edit-icon" />
          </CustomTouchableOpacity>
        )}
      </View>
      <View className="justify-center items-center">
        <CustomTouchableOpacity
          className="flex-row justify-center items-center"
          onHandlePress={onAssistantSwitch}
          testID="header-chat-model-btn">
          <Text
            className="text-black text-[16px] leading-[24px] font-medium"
            testID="header-chat-model-text">
            {translate(`header.${chatModel}`)}
          </Text>
          <DownArrow
            className="aspect-square ml-[2px] self-center"
            height={14}
            width={14}
            testID="downArrow-icon"
          />
        </CustomTouchableOpacity>
        <View className="flex-1 flex gap-1 justify-center self-center min-w-[200px]">
          <Text className="text-slate-500 text-center text-[12px] font-normal font-['Montserrat'] leading-[15px]">
            {view == "work"
              ? `${translate("header.web")} ${translate("header.off")}`
              : `${translate("header.web")} ${translate("header.on")}`}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mr-3">
        <CustomTouchableOpacity
          className="w-[44px]"
          onHandlePress={languageChange}
          testID="header-language-btn">
          <CustomText
            styles="text-lg font-normal text-primary-black text-left"
            testID="header-language">
            {translate(language === 'en' ? 'header.ar' : 'header.en')}
          </CustomText>
        </CustomTouchableOpacity>

        <CustomPopover
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}
          offset={6}
          popoverWidth={screenWidth * 0.8}
          testID="logout"
          from={
            <TouchableOpacity
              className="w-8 h-8 rounded-[90px] border border-slate-200 bg-slate-200 flex justify-center items-center text-slate-500"
              onPress={() => setShowPopover(true)}
              testID="profile-btn">
              {userDetails?.name ? (
                <CustomText
                  styles="text-sm font-medium text-slate-500 flex justify-center"
                  testID="user-name">
                  {getInitials(userDetails?.name)}
                </CustomText>
              ) : (
                <Profile height={32} width={32} testID="profile-icon" />
              )}
            </TouchableOpacity>
          }>
          <ProfilePopover onUserLogOut={onUserLogOut} />
        </CustomPopover>
      </View>
    </View>
  );
};

export default Header;
