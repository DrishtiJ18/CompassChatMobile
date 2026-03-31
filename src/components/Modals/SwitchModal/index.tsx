/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
import { Text, View, Switch } from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
// import { Switch } from 'react-native-switch';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '@src/stores';
import CustomText from '../../custom/CustomText';
import { isIos } from '@src/utils/UiUtils';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Check from '@images/drawer/check.svg';
import CustomSwitch from '@src/components/custom/CustomSwitch';

function SwitchModal({
  sheetId,
  payload,
}: SheetProps<{ sheetId: string; closeDrawer: Function }>): JSX.Element {
  const { t: translate } = useTranslation();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const setChatModel = useStore(state => state.setChatModel);
  const chatModel = useStore(state => state.chatModel);
  const resetChat = useStore(state => state.resetChat);
  const canStop = useStore(state => state.canStop);
  const setCanStop = useStore(state => state.setCanStop);
  const abortSignal = useStore(state => state.abortSignal);
  const view = useStore((state) => state.view);
  const setAbortSignal = useStore((state) => state.setAbortSignal);
  const setView = useStore((state) => state.setView);

  const viewWebSearch = "TRUE";
  async function onAssistantSwitch(label: string): Promise<void> {
    if (abortSignal && canStop) {
      abortSignal.abort();
      setCanStop(false);
    }

    setTimeout(async () => {
      await AsyncStorage.removeItem('conversation_id');
      resetChat();
    }, 500);

    setChatModel(label);
    if(label == 'Jais')
      setView("work");
      // payload?.closeDrawer();
  }
  function onRagSwitch(value: string): void {

    if (abortSignal && canStop) {
      abortSignal.abort();
      setCanStop(false);
      setAbortSignal();
    }

    setView(value == "web" ? "web" : "work");

    setTimeout(async () => {
      // payload?.closeDrawer()
      await AsyncStorage.removeItem('conversation_id');
      resetChat();
    }, 500);
    // navigate(value != "web" ? "/chat" : "/chat");

  }

  return (
    <ActionSheet
      id={sheetId}
      ref={actionSheetRef}
      testIDs={{ modal: 'switch-modal' }}
      useBottomSafeAreaPadding={true}
      isModal={true}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
      }}
      gestureEnabled={true}>
      {viewWebSearch && (
        <>
          <View
            className={`flex flex-col justify-center px-5 ${isIos() && 'py-1 '}`}
            testID="switch-modal-view">
            <Text className="px-5 mt-5 text-slate-400 text-xs font-medium font-['Montserrat'] leading-[15px]">
              {translate("modal.search")}
            </Text>


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal:10 }}>
              <Text className="p-4 text-base font-medium font-Montserrat text-primary-black text-left leading-[24px]">
                {translate("header.web")}
              </Text>

              <CustomSwitch
                testID={"switch-modal-custom-switch"}
                onPress={value => onRagSwitch(value ? 'web' : 'work')}
                disabled={chatModel === 'Jais'}
                trackColors={{off: '#FFFFFF', on: '#136C66'}}
                thumbColors={{
                  on: view === 'web' ? '#FFFFFF' : '#706882',
                  off: chatModel === 'Jais' ? '#11042E2A' : '#11042E6A',
                }}
                value={view === 'web'}
                switchValue={view === 'web'}
                style={{
                  transform: [{scaleX: 0.95}, {scaleY: 0.9}],
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor:
                    chatModel === 'Jais' ? '#11042E1A' : '#706882',
                }}
              />

            </View>
            {chatModel === 'Jais' && 
              <CustomText styles="px-7 text-slate-500 text-xs font-normal font-['Montserrat'] leading-[15px]">
                {translate("header.not_available_text")}
              </CustomText>
            }
          </View>
        </>
      )}
      <View
        className={`flex flex-col justify-center px-5 ${isIos() && 'py-1 '}`}
        testID="switch-modal-view">
        <Text className="px-5 mt-5 text-slate-400 text-xs font-medium font-['Montserrat'] leading-[15px]">
          {translate("modal.models")}
        </Text>
        <View style={{marginHorizontal:10}}>
        <CustomTouchableOpacity
          className="p-4 border-b-[1px] border-slate-200 cursor-pointer font-medium justify-between flex-row "
          onHandlePress={() => onAssistantSwitch('GPT')}
          testID="switch-modal-gpt-btn">
          <CustomText
            styles="text-base font-medium font-Montserrat text-primary-black text-left"
            testID="switch-modal-gpt">
            {translate('header.gpt')}
          </CustomText>
          {chatModel =='GPT'&&<Check className="aspect-square ml-[2px] self-center text-primary-black"
            height={25}
            width={25} />}
      
        </CustomTouchableOpacity>

        <CustomTouchableOpacity
          className="p-4 cursor-pointer justify-between flex-row"
          onHandlePress={() => onAssistantSwitch('Jais')}
          testID="switch-modal-jais-btn">
          <CustomText
            styles="text-base font-medium font-Montserrat text-primary-black text-left"
            testID="switch-modal-jais">
            {translate('header.jais')}
          </CustomText>
          {chatModel =='Jais'&&<Check className="aspect-square ml-[2px] self-center text-primary-black"
            height={25}
            width={25} />}
        </CustomTouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}


export default SwitchModal;