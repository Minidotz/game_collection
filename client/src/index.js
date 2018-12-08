import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
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
function MyApp() {
    return (
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    );
}

ReactDOM.render(<MyApp />, document.getElementById('root'));
registerServiceWorker();
