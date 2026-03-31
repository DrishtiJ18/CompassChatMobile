import React from 'react';
import CustomTouchableOpacity from './CustomTouchableOpacity';

const IconButton = ({
  Icon,
  onButtonPress = () => [],
  iconHeight = 20,
  iconWidth = 20,
  disabled = false,
  style = {},
  testID = '',
}): JSX.Element => {
  return (
    <CustomTouchableOpacity
      disabled={disabled}
      style={[{marginRight: 16}, style]}
      onHandlePress={onButtonPress}
      testID={`${testID}-btn`}>
      <Icon height={iconHeight} width={iconWidth} testID={testID} />
    </CustomTouchableOpacity>
  );
};

export default IconButton;
