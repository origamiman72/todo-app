import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

document.body.addEventListener('keyup', function(e) {
  if (e.which === 9) /* tab */ {
    document.documentElement.classList.remove('no-focus-outline');
  }
});

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
  );
  serviceWorker.unregister();