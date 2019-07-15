import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";


// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    window.history.replaceState(
        {},
        document.title,
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

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

ReactDOM.render(
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        onRedirectCallback={onRedirectCallback}
    >
        <MyApp />
    </Auth0Provider>,
    document.getElementById('root')
);
registerServiceWorker();
