import React from 'react';
import {Image, View} from 'react-native';
import Close from '@images/drawer/close.svg';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import {SvgCssUri} from 'react-native-svg/css';
import Logo from '@src/assets/images/header/CompassLogo.svg';
import Config from 'react-native-config';
interface DrawerHeaderPropType {
  closeDrawer(): void;
}

function CustomDrawerHeader({closeDrawer}: DrawerHeaderPropType): JSX.Element {
  const [width, height] = Config.LOGO_SIZE.split(',');
  return (
    <View
      className="flex flex-row justify-between items-center my-4 mx-2 "
      testID="drawer-header-view">
      <View className="w-[180px] h-[44px]" testID="drawer-app-logo-view">
        {Config.APP_LOGO ? (
          Config.APP_LOGO.includes('.png') ||
          Config.APP_LOGO.includes('png') ? (
            <Image
              source={{uri: Config.APP_LOGO}}
              height={height}
              width={width}
              testID="drawer-app-logo-image"
            />
          ) : (
            <SvgCssUri
              width={width}
              height={height}
              uri={'https://core42.ai/imgs/logo-dark.svg'}
              onError={() => {}}
              onLoad={() => {}}
              testID="drawer-app-logo-svg"
            />
          )
        ) : (
          <Logo width={width} height={height} testID="drawer-app-logo" />
        )}
      </View>

      <CustomTouchableOpacity
        className="h-11 w-11 flex items-center justify-center"
        onHandlePress={closeDrawer}
        testID="drawer-close-btn">
        <Close
          height={13}
          width={13}
          color={'#94A3B8'}
          testID="drawer-close-icon"
        />
      </CustomTouchableOpacity>
    </View>
  );
}

export default CustomDrawerHeader;
