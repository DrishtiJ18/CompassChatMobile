import {changeLanguage} from '@src/translation/config';
import {SettingSliceInitialState, SettingSliceState} from './types';

const initialSettingData: SettingSliceInitialState = {
  theme: 'light',
  language: 'en',
  direction: 'ltr',
  loading: false,
    view:"work"
};

export const createSettingSlice = (
  set: (
    partial: Partial<SettingSliceState>,
    replace?: boolean,
    actionName?: string,
  ) => void,
): SettingSliceState => ({
  ...initialSettingData,
  setLoading: (loading: boolean) => set({loading}, false, 'setLoading'),
  setLanguage: (language: 'en' | 'ar') => {
    changeLanguage(language);
    set({language}, false, 'setLanguage');
  },
  setTheme: (theme: string) => set({theme}, false, 'setTheme'),
  resetSettingData: () => set(initialSettingData, false, 'resetSettingData'),
  setDirection: (direction: 'ltr' | 'rtl') => {
    set({direction: direction}, false, 'setDirection');
  },
  setView: (view: string) => set({ view }, false, "setView"),
});
