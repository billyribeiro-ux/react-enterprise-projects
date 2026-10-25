import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CyberAuditFeed } from '../../src/CyberAuditFeed';

describe('05-virtual-audit-feed', () => {
  it('renders cyber audit table', () => {
    const logs = [{ id: '1', actorEmail: 'sec@corp.io', actionType: 'AUTH', severity: 'info', ipAddress: '127.0.0.1', timestamp: '2026-10-25' }];
    render(<CyberAuditFeed initialLogs={logs} />);
    expect(screen.getByTestId('audit-feed-root')).toBeInTheDocument();
    expect(screen.getByText('sec@corp.io')).toBeInTheDocument();
  });
});