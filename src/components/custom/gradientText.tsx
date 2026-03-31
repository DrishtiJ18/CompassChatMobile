import React from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface GradientTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
  testID: string;
}

const GradientText = ({
  children,
  style,
  gradientColors,
  testID,
  ...rest
}: GradientTextProps) => {
  return (
    <MaskedView
      maskElement={
        <Text style={style} testID={`${testID}-masked-text`} {...rest}>
          {children}
        </Text>
      }>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text
          style={[style, {color: 'transparent'}]}
          testID={`${testID}-linear-text`}
          {...rest}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
