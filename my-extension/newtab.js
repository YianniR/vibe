import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../my-app/redux/store';
import App from './App';

const NewTab = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<NewTab />, document.getElementById('app'));
