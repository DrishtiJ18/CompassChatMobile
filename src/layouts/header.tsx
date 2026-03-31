import React from 'react';
import {View, Image} from 'react-native';

import Logo from '@src/assets/images/header/CompassLogo.svg';
import {useStore} from '@src/stores';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import {languageRestart} from '@src/utils/UiUtils';
import {changeLanguage} from '@src/translation/config';
import CustomText from '@src/components/custom/CustomText';
import {useTranslation} from 'react-i18next';
import Config from 'react-native-config';

import {SvgCssUri} from 'react-native-svg/css';

interface Props {
  setlanguageSwitchLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({setlanguageSwitchLoader}: Props) => {
  const {t: translate} = useTranslation();
  const language = useStore(state => state.language);
  const setLanguage = useStore(state => state.setLanguage);
  // const Flag = useCallback(
  //   () =>
  //     language === 'en' ? (
  //       <EngFlag className="aspect-square" />
  //     ) : (
  //       <ArabicFlag className="aspect-square" />
  //     ),
  //   [language],
  // );
  const [width, height] = Config.LOGO_SIZE.split(',');

  const languageChange = async () => {
    setlanguageSwitchLoader(true);
    setLanguage(language === 'en' ? 'ar' : 'en');
    await changeLanguage(language === 'en' ? 'ar' : 'en');
    languageRestart(language);
  };

  return (
    <View
      className={
        'w-full h-[40px] flex justify-between items-center pl-[15px] flex-row'
      }
      testID="landing-page-header-view">
      <View
        className="flex flex-row item-center align-center my-auto w-[150px]"
        testID="app-logo-view">
        {Config.APP_LOGO ? (
          Config.APP_LOGO.includes('.png') ||
          Config.APP_LOGO.includes('png') ? (
            <Image
              source={{uri: Config.APP_LOGO}}
              height={height}
              width={width}
              testID="app-logo-image"
            />
          ) : (
            <SvgCssUri
              width={width}
              height={height}
              uri={Config.APP_LOGO}
              onError={() => {}}
              onLoad={() => {}}
              testID="app-logo-svg"
            />
          )
        ) : (
          <Logo width={width} height={height} testID="app-logo" />
        )}
      </View>

      <View
        className="flex flex-row item-center align-center my-auto"
        testID="landing-header-lang-view">
        {/* <View className="w-[44px]"> */}
        {/* <ArabicFlag className="aspect-square" /> */}
        {/* <EngFlag className="aspect-square" />
        </View> */}
        <CustomTouchableOpacity
          className="w-[44px]"
          onHandlePress={languageChange}
          testID="landing-header-lang-btn">
          <CustomText
            styles="font-medium text-base text-primary-black text-left"
            testID="landing-header-lang">
            {translate(language === 'en' ? 'header.ar' : 'header.en')}
          </CustomText>
        </CustomTouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
