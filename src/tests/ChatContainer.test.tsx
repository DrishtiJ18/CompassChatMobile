import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import ChatContainer from '@src/components/ChatContainer';
import { useStore } from '@src/stores';

jest.mock('@src/stores', () => ({
  useStore: jest.fn(() => ({
    userDetails: { name: 'John Doe' },
  })),
}));
jest.mock('@src/context/NetInfoContext', () => {
  const React = require('react'); // ✅ Required inside mock
  return {
    NetInfoContext: React.createContext({ isOnline: true }),
  };
});
jest.mock('@src/translation/config', () => ({
  t: (key: string) => key, // Mock translation function
}));
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn(() =>
    Promise.resolve(JSON.stringify({idToken: 'auth_token'})),
  ),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));
describe('ChatContainer - Prompt Data', () => {
  const mockOnSend = jest.fn().mockResolvedValue(undefined);

  it('renders default prompts correctly', () => {
    render(
      <ChatContainer
        message={[]} 
        mainObj={{}}
        id=""
        generating={{ show: false, content: '' }}
        onSend={mockOnSend}
        regenerate={jest.fn()}
        editPrompt={jest.fn()}
        selectedIndexRef={{ current: 0 }}
      />
    );

    // Check if all three prompts are rendered
    expect(screen.getByTestId('default-prompt-0')).toBeTruthy();
    expect(screen.getByTestId('default-prompt-1')).toBeTruthy();
    expect(screen.getByTestId('default-prompt-2')).toBeTruthy();

    // Check if prompt titles are displayed (mocked translations)
    expect(screen.getByText('sample_prompts.prompt_1_title')).toBeTruthy();
    expect(screen.getByText('sample_prompts.prompt_2_title')).toBeTruthy();
    expect(screen.getByText('sample_prompts.prompt_3_title')).toBeTruthy();
  });

  it('calls onSend when a prompt is clicked', async () => {
    const mockOnSend = jest.fn().mockResolvedValue(undefined);
    render(
      <ChatContainer
        message={[]} 
        mainObj={{}}
        id=""
        generating={{ show: false, content: '' }}
        onSend={mockOnSend}
        regenerate={jest.fn()}
        editPrompt={jest.fn()}
        selectedIndexRef={{ current: 0 }}
      />
    );
    screen.debug();
     expect(screen.getByTestId('default-prompt-0')).toBeTruthy();
    const promptButton = screen.getByTestId('default-prompt-0');

  console.log('Prompt Button:', promptButton);
    fireEvent.press(promptButton);
expect(screen.getByTestId('default-prompt-1')).toBeTruthy()
    await waitFor(() =>{expect(mockOnSend).toHaveBeenCalledWith('sample_prompts.prompt_1_title')});
  });
});
