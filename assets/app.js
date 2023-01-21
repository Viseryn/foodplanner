/**
 * app.js
 * 
 * @author Kevin Sporbeck
 * @version v1.2.2
 */

// Import CSS
import './styles/app.scss';

// Import SweetAlert
import swal from 'sweetalert';

// Import React
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './layouts/App';

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App version="v1.2.2-pre" />);
