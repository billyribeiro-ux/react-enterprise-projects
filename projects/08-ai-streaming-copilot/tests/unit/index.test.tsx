import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CinematicCopilot } from '../../src/CinematicCopilot';

describe('08-ai-streaming-copilot', () => {
  it('renders chat interface', () => {
    const msgs = [{ id: '1', role: 'assistant', content: 'Ready for prompt.' }];
    render(<CinematicCopilot initialMessages={msgs} convId="c1" />);
    expect(screen.getByTestId('copilot-root')).toBeInTheDocument();
    expect(screen.getByText('Ready for prompt.')).toBeInTheDocument();
  });
});