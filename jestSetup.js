
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.UIManager.getViewManagerConfig = name => {
    return {};
  };
  Object.defineProperty(RN, 'findNodeHandle', {
    get: jest.fn(() => () => 1),
    set: jest.fn(),
  });

  RN.NativeModules.UIManager = {
    measure: (node, callback) => {
      callback(undefined, undefined, 0, 0, 50, 50);
    },
  };

  return RN;
});

jest.mock('react-native-actions-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    SheetProvider: ({ children }) => <>{children}</>,
    ActionSheet: ({ children, testIDs }) => (
      <View testID={testIDs?.modal || 'mock-action-sheet'}>{children}</View>
    ),
    SheetManager: {
      show: jest.fn().mockImplementation((id) => {
        console.log(`🛠 SheetManager.show called with id: ${id}`);
        return Promise.resolve();
      }),
      hide: jest.fn().mockResolvedValue(undefined),
    },
    registerSheet: jest.fn(), // ✅ Ensure registerSheet is available
  };
});


// jest.mock('react-native-actions-sheet', () => {
//   return {
//     registerSheet: jest.fn(),
//     SheetManager: {
//       show: jest.fn(),
//       hide: jest.fn(),
//     },
//     SheetProvider: ({ children }) => {children}, // ✅ Mock SheetProvider
//     ActionSheet: ({ children }) =>{children},  // ✅ Mock ActionSheet
//   };
// });
// registerSheet('delete-modal', DeleteModal);


jest.mock('i18next', () => ({
  t: jest.fn(key => key),
}));

jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: 'PanGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
  LongPressGestureHandler: 'LongPressGestureHandler',
  TouchableOpacity: ({children, onPress, ...props}) => {
    const {default: React} = require('react');
    return React.createElement('View', {...props, onClick: onPress}, children);
  },
  TouchableWithoutFeedback: ({children, ...props}) => {
    const {default: React} = require('react');
    return React.createElement('View', props, children);
  },
  GestureHandlerRootView: ({children}) => children,
  State: {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  },
  createNativeWrapper: jest.fn(component => component),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  return {
    WebView: class MockWebView extends React.Component {
      static defaultProps = {
        source: {},
        onLoadStart: () => {},
        onLoadEnd: () => {},
        onLoad: () => {},
        onError: () => {},
        onNavigationStateChange: () => {},
        onMessage: () => {},
        onContentProcessDidTerminate: () => {},
        injectedJavaScript: '',
        injectedJavaScriptBeforeContentLoaded: '',
      };

      render() {
        return React.createElement(
          'View',
          {
            ...this.props,
            testID: this.props.testID || 'webview',
          },
          this.props.children,
        );
      }
    },
    default: class MockWebView extends React.Component {
      render() {
        return React.createElement(
          'View',
          {
            ...this.props,
            testID: this.props.testID || 'webview',
          },
          this.props.children,
        );
      }
    },
  };
});

jest.mock('react-native-pdf', () => {
  const React = require('react');
  return {
    default: class MockPdf extends React.Component {
      static defaultProps = {
        source: {},
        page: 1,
        scale: 1,
        horizontal: false,
        spacing: 0,
        password: '',
        loading: '',
        onLoadComplete: () => {},
        onPageChanged: () => {},
        onError: () => {},
        onPageSingleTap: () => {},
        onScaleChanged: () => {},
      };

      render() {
        return React.createElement('View', this.props, this.props.children);
      }
    },
  };
});

jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
      PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
      MICROPHONE: 'ios.permission.MICROPHONE',
    },
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
      WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
      RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
    },
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
    LIMITED: 'limited',
  },
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  checkMultiple: jest.fn(() => Promise.resolve({})),
  requestMultiple: jest.fn(() => Promise.resolve({})),
  openSettings: jest.fn(() => Promise.resolve()),
  checkNotifications: jest.fn(() => Promise.resolve({status: 'granted'})),
  requestNotifications: jest.fn(() => Promise.resolve({status: 'granted'})),
}));

jest.mock('react-native-fs', () => ({
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  copyFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  getFSInfo: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  stopDownload: jest.fn(),
  resumeDownload: jest.fn(),
  isResumable: jest.fn(),
  stopUpload: jest.fn(),
  completeHandlerIOS: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  existsAssets: jest.fn(),
  readFile: jest.fn(),
  read: jest.fn(),
  readFileAssets: jest.fn(),
  hash: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn(),
  write: jest.fn(),
  downloadFile: jest.fn(),
  uploadFiles: jest.fn(),
  touch: jest.fn(),
  MainBundlePath: jest.fn(),
  CachesDirectoryPath: jest.fn(),
  DocumentDirectoryPath: jest.fn(),
  ExternalDirectoryPath: jest.fn(),
  ExternalStorageDirectoryPath: jest.fn(),
  TemporaryDirectoryPath: jest.fn(),
  LibraryDirectoryPath: jest.fn(),
  PicturesDirectoryPath: jest.fn(),
}));

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  }),
  useDrawerNavigation: () => ({
    openDrawer: jest.fn(),
    closeDrawer: jest.fn(),
    toggleDrawer: jest.fn(),
    dispatch: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(() => ({
    dispatch: jest.fn(),
  })),
}));

jest.mock('i18next', () => ({
  default: {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue({}),
    t: jest.fn(key => key),
    changeLanguage: jest.fn().mockResolvedValue({}),
    language: 'en',
    languages: ['en', 'es'],
    exists: jest.fn().mockReturnValue(true),
    getFixedT: jest.fn((lng, ns) => jest.fn(key => key)),
    options: {
      fallbackLng: 'en',
      debug: false,
      resources: {
        en: {
          translation: {},
        },
        es: {
          translation: {},
        },
      },
    },
  },
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockResolvedValue({}),
  t: jest.fn(key => key),
  changeLanguage: jest.fn().mockResolvedValue({}),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn(key => key),
    i18n: {
      changeLanguage: jest.fn().mockResolvedValue({}),
      language: 'en',
      languages: ['en', 'es'],
      exists: jest.fn().mockReturnValue(true),
      t: jest.fn(key => key),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  Trans: ({children}) => children,
}));
jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: jest.fn(() => ({
      Navigator: ({children}: {children: React.ReactNode}) => <>{children}</>,
      Screen: ({children}: {children: React.ReactNode}) => <>{children}</>,
    })),
  }));
  
  jest.mock('react-native-reanimated', () =>
    require('react-native-reanimated/mock'),
  );
  
  jest.mock('react-native-simple-toast', () => ({
    show: jest.fn(),
    SHORT: jest.fn(),
    LONG: jest.fn(),
    BOTTOM: jest.fn(),
    CENTER: jest.fn(),
    TOP: jest.fn(),
  }));
  jest.mock('@react-native-clipboard/clipboard', () => ({
    setString: jest.fn(),
    getString: jest.fn(),
  }));
  jest.mock('@react-native-community/netinfo', () => ({
    addEventListener: jest.fn(),
    fetch: jest.fn().mockResolvedValue({isConnected: true}),
  }));
  jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }));