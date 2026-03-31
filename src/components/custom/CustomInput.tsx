import {useStore} from '@src/stores';
import {writingDirection} from '@src/utils/UiUtils';
import React, {ReactNode} from 'react';
import {TextInput, View} from 'react-native';

interface CustomInputPropType {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onUserInput(input: string): void;
  text?: string;
  textInputStyles?: string;
  textInputViewStyles?: string;
  placeholderTextColor?: string;
  placeholderText: string;
  editable?: boolean;
}

function CustomInput({
  leftIcon,
  rightIcon,
  onUserInput,
  text,
  textInputViewStyles,
  textInputStyles,
  placeholderTextColor = '#94A3B8',
  placeholderText,
  editable = true,
}: CustomInputPropType): JSX.Element {
  const language = useStore(state => state.language);

  return (
    <View className={textInputViewStyles} testID="input-view">
      {leftIcon && leftIcon}
      <TextInput
        className={`${textInputStyles} text-sm font-normal max-h-[100px]`}
        placeholder={placeholderText}
        placeholderTextColor={placeholderTextColor}
        value={text}
        onChangeText={value => onUserInput(value)}
        multiline={true}
        editable={editable}
        textAlign={`${writingDirection(language, text)}`}
        testID={text ? `${text}-input` : placeholderText.replace(/\s+/g, '-')}
      />
      {rightIcon && rightIcon}
    </View>
  );
}

export default CustomInput;
