import React, {ReactNode, useState} from 'react';
import {View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import CopyIcon from '@images/message/file_copy.svg';
import CheckIcon from '@images/message/check_circle.svg';
import CustomTouchableOpacity from '../custom/CustomTouchableOpacity';

type CodeCopyBtnPropType = {
  children: ReactNode;
  className?: string;
  iconStyle?: string;
  testID: string;
};

export default function CodeCopyBtn({
  children,
  className,
  testID,
}: CodeCopyBtnPropType) {
  const [copyOk, setCopyOk] = useState(false);

  const handleOnCopy = () => {
    Clipboard.setString(children?.props.children);
    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 5000);
  };

  return (
    <View className={`${className ?? ''}`} testID={`${testID}-code-copy-view`}>
      <CustomTouchableOpacity
        onHandlePress={handleOnCopy}
        testID={`${testID}-btn`}>
        {copyOk ? (
          <CheckIcon width={20} height={20} testID={`${testID}-check-icon`} />
        ) : (
          <CopyIcon width={20} height={20} testID={`${testID}-copy-icon`} />
        )}
      </CustomTouchableOpacity>
    </View>
  );
}
