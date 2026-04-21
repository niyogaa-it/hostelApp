import { RA_ALL_TASK, RA_FAILURE } from '../actions/constant';

const INTIAL_STATE = {
	raoverview: {},
	isLoading: true,
	showCreateTasks: false,
	errors: {},
};

export default function (state = INTIAL_STATE, action) {
	switch (action.type) {
		case RA_ALL_TASK:
			//console.log("reducer", action.payload);
			return {
				data: action.payload,
				isLoading: false,
			};

		case RA_FAILURE:
			return { errors: action.payload, isLoading: false };

		default:
			// persist token only if page reload
			if (state && action.type === '@@INIT') {
				let persist_token = '';

				if (localStorage.getItem('token')) {
					persist_token = localStorage.getItem('token');
				} else if (localStorage.getItem('admin_token')) {
					persist_token = localStorage.getItem('admin_token');
				}

				if (persist_token) {
					return {
						data: persist_token,
					};
				} else {
					return state;
				}
			} else {
				return state;
			}
	}
}
