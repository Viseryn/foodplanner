/**
 * app.js
 * 
 * @author Kevin Sporbeck
 * @version v0.3
 */

// Load custom JavaScripts
import './custom';

// Import CSS
import './styles/app.scss';

// Start the Stimulus application
import './bootstrap';

// Import SweetAlert
import swal from 'sweetalert';

// Import React
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
