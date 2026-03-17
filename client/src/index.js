import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import { ThemeProvider,createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff8a65',
        },
        secondary: {
            main: '#E85F50',
        }
    },
    typography: {
        useNextVariants: true
    }
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);
registerServiceWorker();
