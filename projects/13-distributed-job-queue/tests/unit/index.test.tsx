import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { JobQueueDashboard } from '../../src/JobQueueDashboard';

describe('13-distributed-job-queue', () => {
  it('renders job status rows', () => {
    const jobs = [{ id: 'j1', queueName: 'video', status: 'failed', attempts: 3 }];
    render(<JobQueueDashboard initialJobs={jobs} />);
    expect(screen.getByTestId('jobqueue-root')).toBeInTheDocument();
  });
});