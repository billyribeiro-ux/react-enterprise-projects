import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CinematicWizard } from '../../src/CinematicWizard';

describe('04-multi-step-wizard', () => {
  it('renders step 1 inputs and authorization button', () => {
    render(<CinematicWizard sessionToken="tok-1" />);
    expect(screen.getByTestId('wizard-root')).toBeInTheDocument();
    expect(screen.getByTestId('wizard-submit')).toBeInTheDocument();
  });
});