import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Kube Credential title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Kube Credential/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  const issueLinks = screen.getAllByText(/Issue Credential/i);
  const verifyLink = screen.getByText(/Verify Credential/i);
  expect(issueLinks.length).toBeGreaterThan(0);
  expect(verifyLink).toBeInTheDocument();
});