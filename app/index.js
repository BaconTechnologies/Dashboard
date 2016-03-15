import './semantic/dist/semantic.css';
import './semantic/dist/semantic.min.js';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.jsx';

const appContainerElement = document.getElementById('app');

ReactDOM.render(<App />, appContainerElement);
