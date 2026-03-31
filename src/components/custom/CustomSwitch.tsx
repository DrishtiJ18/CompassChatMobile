import React, {useEffect} from 'react';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useStore } from '@src/stores';

interface CustomSwitchProps {
  value: boolean;
  switchValue: boolean;
  onPress: (newValue: boolean) => void;
  style?: ViewStyle;
  disabled?: boolean;
  trackColors?: {on: string; off: string};
  thumbColors?: {on: string; off: string};
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  switchValue,
  onPress,
  style,
  disabled = false,
  trackColors = {on: '#136C66', off: '#d7d5dd'},
  thumbColors = {on: '#FFFFFF', off: '#706882'},
}) => {
  const switchStateValue = useSharedValue(switchValue ? 1 : 0);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const language = useStore(state => state.language);

  useEffect(() => {
    switchStateValue.value = value ? 1 : 0;
  }, [value, switchStateValue]);

  // Update the height and width when the layout changes
  const onLayout = (e: any) => {
    height.value = e.nativeEvent.layout.height;
    width.value = e.nativeEvent.layout.width;
  };

  // Animated style for the track
  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = disabled
      ? '#FFFFFF' // Set the background color to white when disabled
      : interpolateColor(
          switchStateValue.value,
          [0, 1],
          [trackColors.off, trackColors.on],
        );

    return {
      backgroundColor, // Use the interpolated color directly
      borderRadius: height.value / 2,
    };
  });

  // Animated style for the thumb
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      switchStateValue.value,
      [0, 1],
      [0, width.value - height.value],
    );
    const backgroundColor = interpolateColor(
      switchStateValue.value,
      [0, 1],
      [thumbColors.off, thumbColors.on], // Use thumb colors for interpolation
    );
    return {
      backgroundColor,
      transform: [{translateX: language === 'en' ? moveValue : -moveValue}],
      borderRadius: height.value / 2,
    };
  });

  return (
    <Pressable onPress={() => onPress(!value)} disabled={disabled}>
      <Animated.View
        onLayout={onLayout}
        style={[switchStyles.track, style, trackAnimatedStyle]}>
        <Animated.View style={[switchStyles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const switchStyles = StyleSheet.create({
  track: {
    alignItems: 'flex-start',
    width: 50,
    height: 30,
    padding: 4,
  },
  thumb: {
    height: '100%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
  },
});

export default CustomSwitch;
