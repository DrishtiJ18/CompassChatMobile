import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import PromptCard from '@src/components/PromptCard/index';
jest.mock('@src/context/NetInfoContext', () => {
    const React = require('react'); // ✅ Required inside mock
    return {
      NetInfoContext: React.createContext({ isOnline: true }),
    };
  });
  
describe('PromptCard Component', () => {
  it('renders the PromptCard with given title', () => {
    const { getByTestId } = render(
      <PromptCard title="Sample Prompt" index={0} onSend={jest.fn()} />
    );

    expect(getByTestId('prompt-0-text').props.children).toBe('Sample Prompt');
  });

  it('triggers onSend when clicked', () => {
    const mockOnSend = jest.fn();
   
    const { getByTestId } = render(
      <PromptCard title="Sample Prompt" index={0} onSend={mockOnSend} />
    );
screen.debug()
const button = getByTestId('default-prompt-0');

fireEvent.press(button);

expect(mockOnSend).toHaveBeenCalledTimes(1);
  });
});
