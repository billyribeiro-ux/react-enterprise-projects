import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThreeAudioDaw } from '../../src/ThreeAudioDaw';

describe('10-web-audio-daw', () => {
  it('toggles audio synthesizer', () => {
    const tracks = [{ id: '1', name: 'Kick', steps: '1000' }];
    render(<ThreeAudioDaw tracks={tracks} />);
    expect(screen.getByTestId('daw-root')).toBeInTheDocument();
    const btn = screen.getByTestId('play-btn');
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('Pause Synthesizer');
  });
});