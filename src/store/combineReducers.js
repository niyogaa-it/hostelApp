import { combineReducers } from 'redux';

// Import reducer files
import Auth from './reducers/auth';
import bmoverview from './reducers/bmoverview';

export const AppCombineReducers = combineReducers({
	auth: Auth,
	bmoverview: bmoverview,
});
