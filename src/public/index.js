import React from 'react';
import { createRoot } from 'react-dom/client';
import PublicApp from './PublicApp';
import './public.css';

// Initialize React app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('sureconsent-public-root');
  if (container) {
    const root = createRoot(container);
    root.render(<PublicApp />);
  }
});