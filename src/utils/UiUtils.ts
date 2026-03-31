import RNRestart from 'react-native-restart';
import {
  Dimensions,
  I18nManager,
  PixelRatio,
  Platform,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {StyleTypes} from './types';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

//figma screen design  height & width
const widthBaseScale = SCREEN_WIDTH / 390;
const heightBaseScale = SCREEN_HEIGHT / 844;

function styleSheetCompose(style1: StyleTypes, style2: StyleTypes): StyleTypes {
  return StyleSheet.compose(style1, style2);
}

function styleSheetFlatten(styles: Array<StyleTypes>): StyleTypes {
  return StyleSheet.flatten(styles);
}

function normalize(size: number, based: string = 'width'): number {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

//for width  pixel
function widthPixel(size: number): number {
  return normalize(size, 'width');
}
//for height  pixel
function heightPixel(size: number): number {
  return normalize(size, 'height');
}
//for font  pixel
function fontPixel(size: number): number {
  return heightPixel(size);
}
//for Margin and Padding vertical pixel
function pixelSizeVertical(size: number): number {
  return heightPixel(size);
}
//for Margin and Padding horizontal pixel
function pixelSizeHorizontal(size: number): number {
  return widthPixel(size);
}

export function isIos(): boolean {
  return Platform.OS === 'ios';
}

export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

export const isArabic = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicPattern.test(text);
};

const writingDirection = (language: string, text: string | undefined) => {
  if (language === 'ar' && text?.trim()) {
    return isArabic(text ?? '') ? 'right' : 'left';
  } else if (language === 'en' && text?.trim()) {
    return isArabic(text ?? '') ? 'right' : 'left';
  } else {
    return language === 'ar' ? 'right' : 'left';
  }
};

const textDirection = (language: string, text: string | undefined) => {
  if (language === 'ar' && text?.trim()) {
    return isArabic(text ?? '') ? 'left' : 'right';
  } else if (language === 'en' && text?.trim()) {
    return isArabic(text ?? '') ? 'right' : 'left';
  } else {
    return language === 'ar' ? 'right' : 'left';
  }
};

const listDirection = (language: string, text: string | undefined) => {
  if (language === 'ar' && text?.trim()) {
    return isArabic(text ?? '') ? 'row' : 'row-reverse';
  } else if (language === 'en' && text?.trim()) {
    return isArabic(text ?? '') ? 'row-reverse' : 'row';
  }
};

function flexDirection(language: string, text?: string) {
  if (language === 'ar' && text?.trim()) {
    return isArabic(text ?? '') ? 'flex-row' : 'flex-row-reverse';
  } else if (language === 'en' && text?.trim()) {
    return isArabic(text ?? '') ? 'flex-row-reverse' : 'flex-row';
  } else {
    return language === 'ar' ? 'flex-row-reverse' : 'flex-row';
  }
}

function languageRestart(language: string) {
  if (language === 'en' && !I18nManager.isRTL) {
    I18nManager.forceRTL(true);
  } else {
    I18nManager.forceRTL(false);
  }
  setTimeout(() => {
    RNRestart.restart();
  }, 1000);
}

function showToast(message: string) {
  Toast.show(message, Toast.SHORT);
}

export {
  styleSheetCompose,
  styleSheetFlatten,
  widthPixel,
  heightPixel,
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
  languageRestart,
  flexDirection,
  writingDirection,
  textDirection,
  showToast,
  listDirection,
};
