import React from 'react';
import {Pressable, PressableProps} from 'react-native';

interface CustomPressableProps extends PressableProps {
  tintColor?: string;
}

function CustomPressable(props: CustomPressableProps): JSX.Element {
  function getStyle({pressed}: {pressed: boolean}) {
    const {tintColor} = props;
    return [
      {...(props.style as object)},
      pressed && tintColor
        ? {backgroundColor: tintColor}
        : {opacity: pressed ? 0.5 : 1},
    ];
  }

  return <Pressable {...props} style={getStyle} />;
}

export default CustomPressable;
