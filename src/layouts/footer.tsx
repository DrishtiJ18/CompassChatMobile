import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Attach_file from '@src/assets/images/footer/Attach_file.svg';
import CustomInput from '@src/components/custom/CustomInput';
import SendButton from '@src/components/SendButton';
import CustomText from '@src/components/custom/CustomText';
import {isIos} from '@src/utils/UiUtils';
import styles from './styles';

interface FooterPropTypes {
  onUserInput(input: string): void;
  onSend: (mess: string) => Promise<void>;
  text: string;
  shadowVisible?: boolean;
}

function Footer({
  onUserInput,
  onSend,
  text,
  shadowVisible = false,
}: FooterPropTypes): JSX.Element {
  const getStyles = styles();
  const {t: translate} = useTranslation();

  const leftIcon = (
    <View
      className={`absolute ${isIos() ? 'bottom-[16px]' : 'bottom-[14px]'}`}
      testID="input-attachfile-icon">
      <Attach_file
        height={19}
        width={12}
        className="mx-4"
        color={`${text?.trim() ? '#1B1B19' : '#94A3B8'}`}
        testID="attach-file-icon"
      />
    </View>
  );

  return (
    <View
      style={shadowVisible ? getStyles.headerShadow : null}
      className={`w-full flex items-center px-4 pt-4 h-auto  ${
        isIos() ? 'pb-1' : 'pb-4'
      }`}
      testID="chat-page-bottom-view">
      <CustomInput
        // leftIcon={leftIcon}
        rightIcon={<SendButton onSend={onSend} text={text} />}
        onUserInput={onUserInput}
        text={text}
        textInputViewStyles={`flex flex-row items-center border-solid border-2 border-slate-300 rounded-[35px] w-full 
          ${isIos() && 'py-2'} relative`}
        textInputStyles={`grow max-w-[70%] max-h-[100px] font-normal leading-[17px] text-sm ml-10 ${
          isIos() && 'py-2'
        }`}
        placeholderText={translate('chat_page.type_message_here')}
      />

      <CustomText
        styles="text-slate-500 text-xs leading-[15px] mt-3"
        testID="chat-page-imp-info">
        {translate('chat_page.important_info')}
      </CustomText>
    </View>
  );
}

export default Footer;
