import 'react-app-polyfill/ie11';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { BrowserRouter } from 'react-router-dom';

//import { Provider } from "react-redux";
//import {createAppStore} from './store/createStore';

import { Provider } from 'react-redux';
import { store, persistor } from './store/createStore';
import { PersistGate } from 'redux-persist/integration/react';

// ReactDOM.render(
//   <Provider store={createAppStore}>
//     <BrowserRouter>
//         <App/>
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root')
// );

// basename={process.env.NODE_ENV === 'production' ? '/dr_reddy_xceed' : ''}
// basename={process.env.REACT_APP_CUSTOM_ENV === 'vapt' ? '/dr_reddy_xceed' : ''}

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter
				basename={process.env.REACT_APP_CUSTOM_ENV === 'vapt' ? '/dr_reddy_xceed' : ''}
			>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.register();
