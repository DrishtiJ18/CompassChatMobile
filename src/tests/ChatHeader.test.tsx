import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {useStore} from '@src/stores';
import Header from '@src/layouts/chatHeader';
import {NavigationContainer} from '@react-navigation/native';

jest.mock('@src/stores', () => ({
  useStore: jest.fn(),
}));

jest.mock('@src/utils', () => ({
  getInitials: jest.fn(name => name.charAt(0)),
  logOut: jest.fn(),
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
jest.mock('@src/utils/UiUtils', () => ({
  languageRestart: jest.fn(),
  showToast: jest.fn(),
  isIos: jest.fn(),
}));
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn(() =>
    Promise.resolve(JSON.stringify({idToken: 'auth_token'})),
  ),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));
jest.mock('@images/header/menu.svg', () => ({
  __esModule: true,
  default: 'Menu.svg',
}));
jest.mock('@images/header/EditSquare.svg', () => ({
  __esModule: true,
  default: 'Edit.svg',
}));
jest.mock('@images/header/arrow_down.svg', () => ({
  __esModule: true,
  default: 'arrow_down.svg',
}));
jest.mock('@images/drawer/profile.svg', () => ({
  __esModule: true,
  default: 'profile.svg',
}));

describe('ChatHeader in NavigationContainer', () => {
  let clearUserDetailsMock;
  const setShowPopover = jest.fn(value => {
    console.log('Popover state changed:', value);
    return value;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    clearUserDetailsMock = jest.fn();
    useStore.mockReturnValue({
      language: 'en',
      setLanguage: jest.fn(),
      resetChat: jest.fn(),
      conversationId: '123',
      chatModel: 'gpt-4',
      view: 'work',
      historyData: [],
      setIsShowLoader: jest.fn(),
      setLoading: jest.fn(),
      userDetails: {name: 'John Doe'},
      clearUserDetails: clearUserDetailsMock,
      abortSignal: {abort: jest.fn()},
      canStop: true,
      setCanStop: jest.fn(),
    });
  });
  it('renders Header correctly', () => {
    const mockNavigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };
    const {getByTestId} = render(
      <NavigationContainer>
        <Header navigation={mockNavigation} />
      </NavigationContainer>,
    );
    expect(getByTestId('chat-header-view')).toBeTruthy();
  });
  it('renders profile correctly', async () => {
    const mockNavigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    render(
      <NavigationContainer>
        <Header navigation={mockNavigation} />
      </NavigationContainer>,
    );
  });
  it('profile should be clickable', async () => {
    const mockNavigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const {getByTestId} = render(
      <NavigationContainer>
        <Header navigation={mockNavigation} />
      </NavigationContainer>,
    );
    fireEvent.press(getByTestId('profile-btn'));
    jest.spyOn(React, 'useState').mockReturnValue([true, setShowPopover]);
  });

  it('should render language correctly', async () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <Header />
      </NavigationContainer>,
    );
    const languageButton = getByTestId('header-language-btn');
    expect(languageButton).toBeTruthy();
  });
  it('should render menu correctly', async () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <Header />
      </NavigationContainer>,
    );
    const menu = getByTestId('header-menu-btn');
    expect(menu).toBeTruthy();
  });
  it('should render the chat model switch button properly', () => {
    const {getByTestId} = render(
      <NavigationContainer>
        <Header />
      </NavigationContainer>,
    );

    const modelSwitchButton = getByTestId('header-chat-model-btn');
    expect(modelSwitchButton).toBeTruthy();
  });
});
