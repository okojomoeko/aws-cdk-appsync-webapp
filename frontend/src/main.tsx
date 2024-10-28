import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.tsx';
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import config from "../aws-exports.ts";
import { AmplifyClientProvider } from './contexts/AmplifyClientContext';

Amplify.configure(config);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <AmplifyClientProvider>
            <App />
          </AmplifyClientProvider>
      </ThemeProvider>
    </Authenticator>
  </StrictMode>
);
