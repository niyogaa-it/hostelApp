import axios from '../../shared/axios';
import jwt_decode from 'jwt-decode';
import {
	AUTH_TOKEN,
	AUTH_LOGOUT,
	AUTH_FAILURE,
	NOTIFICATIONS,
	NOTIFICATIONS_COUNT,
	CLOSE_NOTIFICATIONS,
} from './constant';

export const frontEndLogin = (request, onSuccess, setErrors) => {
	let email = request.email,
		password = request.password,
		customErr = { process: 'Invalid access' }; // if server is down

	return (dispatch) => {
		axios
			.post('/api/employees/login', {
				email: email,
				password: password,
			})
			.then((response) => {
				dispatch({
					type: AUTH_TOKEN,
					payload: {
						token: response.data.token,
						notificationData: response.data.notificationData,
						countNotification: response.data.countNotification,
						countUnreadNotification: response.data.countUnreadNotification,
						openNotification: false,
					},
				});

				var ot = localStorage.getItem('ot');
				var ca = localStorage.getItem('customer_approval');

				localStorage.clear();
				localStorage.setItem('token', response.data.token);

				if (ot !== null) {
					localStorage.setItem('ot', ot);
				}

				if (ca !== null) {
					localStorage.setItem('customer_approval', ca);
				}

				onSuccess && onSuccess();
			})
			.catch((error) => {
				if (error !== undefined) {
					switch (error.status) {
						case 400:
						case 404:
							dispatch({
								type: AUTH_FAILURE,
								payload: error.data,
							});
							setErrors(error.data.errors);
							break;

						default:
							dispatch({
								type: AUTH_FAILURE,
								payload: customErr,
							});
							setErrors(customErr);
							break;
					}
				} else {
					dispatch({
						type: AUTH_FAILURE,
						payload: customErr,
					});
					setErrors(customErr);
				}
			});
	};
};

export const adminLogin = (request, onSuccess, setErrors) => {
	return (dispatch) => {
		let username = request.username,
			password = request.password,
			customErr = { process: 'Invalid access' };

		axios
			.post('/admin/un/secure/login', { username: username, password: password })
			.then((response) => {
				console.log("response>>>>>",response.data)

			if(response.data.status !=200){
				setErrors({password:response.data.message})
			}else{
				dispatch({
					type: AUTH_TOKEN,
					payload: response.data.token,
				});

				//localStorage.clear();
				localStorage.setItem('admin_token', response.data.token);
				onSuccess && onSuccess();
			}
				
				
			})
			.catch((error) => {
				console.log("error>>>>>",error)
				// switch (error.status) {
				// 	case 404:
				// 	case 400:
				// 		dispatch({
				// 			type: AUTH_FAILURE,
				// 			payload: error.data,
				// 		});
				// 		setErrors(error.data.errors);
				// 		break;

				// 	default:
				// 		dispatch({
				// 			type: AUTH_FAILURE,
				// 			payload: '',
				// 		});
				// 		setErrors(customErr);
				// 		break;
				// }
			});
	};
};

export const authLogout = () => {
	localStorage.removeItem('token');
	return (dispatch) => {
		dispatch({
			type: AUTH_LOGOUT,
		});
	};
};

export const adminLogout = () => {
	localStorage.removeItem('admin_token');

	return (dispatch) => {
		dispatch({
			type: AUTH_LOGOUT,
		});
	};
};

export const getNotifications = (request, onSuccess, setErrors) => {
	return (dispatch) => {
		axios
			.get(`/api/employees/notifications`)
			.then((res) => {
				axios.post(`/api/tasks/for_tracking`, { tracking_id: 17 }).then((res) => {});
				dispatch({
					type: NOTIFICATIONS,
					payload: {
						countNotification: res.data.total_count,
						countUnreadNotification: res.data.count,
						notificationData: res.data.data,
						openNotification: !request,
					},
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
};

export const getNotificationCount = (request, onSuccess, setErrors) => {
	return (dispatch) => {
		axios
			.get(`/api/employees/notifications`)
			.then((res) => {
				dispatch({
					type: NOTIFICATIONS_COUNT,
					payload: {
						countNotification: res.data.total_count,
						countUnreadNotification: res.data.count,
						openNotification: false,
					},
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
};

export const closeNotification = (request, onSuccess, setErrors) => {
	return (dispatch) => {
		dispatch({
			type: CLOSE_NOTIFICATIONS,
			payload: {
				openNotification: false,
				countUnreadNotification: request.countUnreadNotification,
				countNotification: request.countNotification,
			},
		});
	};
};