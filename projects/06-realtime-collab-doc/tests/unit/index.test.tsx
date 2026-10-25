import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HolographicCollabDoc } from '../../src/HolographicCollabDoc';

describe('06-realtime-collab-doc', () => {
  it('renders blocks', () => {
    const blocks = [{ id: 'b1', content: 'Sample Block' }];
    render(<HolographicCollabDoc initialBlocks={blocks} />);
    expect(screen.getByTestId('collab-root')).toBeInTheDocument();
  });
});