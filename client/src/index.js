import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { EmailProvider } from './Profile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <EmailProvider>
      <App />
    </EmailProvider>
);
