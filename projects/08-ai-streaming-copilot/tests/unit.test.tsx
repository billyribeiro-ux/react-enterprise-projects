import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AiCopilotWorkspace } from '../src/AiCopilotWorkspace';

describe('Project 08: Streaming AI Copilot & Generative UI Workspace', () => {
  it('appends user prompt and streams generative diagnostic response inside transition', () => {
    render(<AiCopilotWorkspace />);
    const input = screen.getByLabelText('Copilot Prompt Input');
    fireEvent.change(input, { target: { value: 'Audit Prisma OCC' } });
    fireEvent.click(screen.getByRole('button', { name: /Stream Synthesis/i }));

    expect(screen.getByTestId('copilot-log').textContent).toContain('Audit Prisma OCC');
    expect(screen.getByTestId('copilot-log').textContent).toContain('Generative UI Diagnostic');
  });
});
