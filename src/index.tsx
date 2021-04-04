import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/sass/index.sass';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("main-root") || document.getElementsByClassName("main-root")[0]
);