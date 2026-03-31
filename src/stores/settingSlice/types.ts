type SettingSliceInitialState = {
  theme: string;
  language: 'en' | 'ar';
  direction: string;
  loading: boolean;
  view: string;
};

interface SettingSliceState extends SettingSliceInitialState {
  setLoading: (loading: boolean) => void;
  setTheme: (theme: string) => void;
  setLanguage: (language: 'en' | 'ar') => void;
  resetSettingData: () => void;
  setDirection: (direction: 'ltr' | 'rtl') => void;
  setView: (view: string) => void;
}

export type {SettingSliceInitialState, SettingSliceState};
