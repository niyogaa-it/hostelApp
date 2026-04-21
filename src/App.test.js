import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './store/createStore';
import App from './App';

it('renders without crashing', () => {
	const div = document.createElement('div');
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
		div
	);
	ReactDOM.unmountComponentAtNode(div);
});
