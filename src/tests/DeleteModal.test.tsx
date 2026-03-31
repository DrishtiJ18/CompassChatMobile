import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
jest.mock('react-native-actions-sheet', () => {
  const { View } = require('react-native');
  return{
  
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  ActionSheet: ({ children }) => (
    <View >{children}</View> // ✅ Add label
  ),
  registerSheet: jest.fn(), // ✅ Mock registerSheet
  SheetManager: {
    show: jest.fn(), // ✅ Prevents the 'undefined' error
    hide: jest.fn(),
  },
}});
import DeleteModal from '@src/components/Modals/DeleteModal/index';
import { useTranslation } from 'react-i18next';
import ActionSheet, { registerSheet, SheetManager, SheetProvider } from 'react-native-actions-sheet';
console.log('DeleteModal:', DeleteModal);

// ✅ Mock `useTranslation` to prevent actual translations during tests
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Returns the key instead of actual translation
  }),
}));
jest.mock('@images/drawer/deleteIcon.svg', () => ({
  __esModule: true,
  default: 'Delete.svg',
}));


console.log("action sheet",ActionSheet)
jest.mock('@src/context/NetInfoContext', () => {
  const React = require('react'); // ✅ Required inside mock
  return {
    NetInfoContext: React.createContext({ isOnline: true }),
  };
});

describe('DeleteModal Component', () => {
  const mockOnDeleteChat = jest.fn();

  it('renders the delete modal correctly', async () => {

    const { getByTestId } = render(<ActionSheet><DeleteModal sheetId="test-sheet" payload={{ onDeleteChat: mockOnDeleteChat }} /></ActionSheet>

    );
   
    expect(getByTestId('delete-chat-icon')).toBeTruthy(); // ✅ Delete icon exists
    expect(getByTestId('delete-chat-text').props.children).toBe('side_bar.delete_chat'); // ✅ Translation key
  });

  it('calls `onDeleteChat` when delete button is pressed', () => {
    const mockOnDeleteChat = jest.fn().mockResolvedValue(undefined);
    const { getByTestId } = render(
      <ActionSheet>
        <DeleteModal sheetId="test-sheet" payload={{ onDeleteChat: mockOnDeleteChat }} />
      </ActionSheet>
    );
screen.debug()
expect(screen.getByTestId('delete-chat-btn')).toBeTruthy();
const promptButton = screen.getByTestId('delete-chat-btn');

console.log('Prompt Button:', promptButton);
fireEvent.press(promptButton);
    

    expect(mockOnDeleteChat).toHaveBeenCalledTimes(1); // ✅ Function was called
  });
});
