import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {configure} from 'mobx';

configure({enforceActions: "always"});

ReactDOM.render(<LocaleProvider locale={zhCN}><App/></LocaleProvider>, document.getElementById('root'));

// If you want your app to work offline and reload faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();