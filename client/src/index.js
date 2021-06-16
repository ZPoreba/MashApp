import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./store";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Ion } from "cesium";

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NGEyNjAzZS1iZmE0LTQ1NjgtYmExYi00ZDI3Y2E2MjFkNzciLCJpZCI6NTc0NzEsImlhdCI6MTYyMjM4MzQ2NH0.VpG1iCXsVnlEmzJcCYB76vJ4YigLk11Klg-uABp8bHQ'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
