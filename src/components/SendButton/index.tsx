import React from 'react';
import {View} from 'react-native';
import Arrow_upward from '@src/assets/images/footer/Arrow_upward.svg';
import {useStore} from '@src/stores';
import CustomTouchableOpacity from '../custom/CustomTouchableOpacity';

interface SendButtonPropType {
  onSend: (mess: string) => Promise<void>;
  text: string;
}

function SendButton({text, onSend}: SendButtonPropType): JSX.Element | null {
  const canStop = useStore(state => state.canStop);
  const abortSignal = useStore(state => state.abortSignal);
  const setCanStop = useStore(state => state.setCanStop);
  const setAbortSignal = useStore(state => state.setAbortSignal);
  return (
    <CustomTouchableOpacity
      className={`h-[35px] w-[35px] rounded-full items-center justify-center mx-2
        ${
          text?.trim() || canStop ? 'flex bg-black' : 'invisible'
        } absolute bottom-2 right-1`}
      onHandlePress={() => {
        try {
          if (canStop && abortSignal.abort) {
            abortSignal.abort();
            setCanStop(false);
            setAbortSignal();
          } else {
            onSend(text);
          }
        } catch (error) {
          console.log('error aborting', error);
        }
      }}
      testID="input-send-btn">
      {canStop ? (
        <View className="h-3 w-3 bg-white" testID="white-background-view" />
      ) : (
        <Arrow_upward height={15} width={15} testID="arrow-upward-icon" />
      )}
    </CustomTouchableOpacity>
  );
}

export default SendButton;
