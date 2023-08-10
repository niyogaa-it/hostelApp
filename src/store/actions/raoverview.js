import axios from '../../shared/axios';
import { RA_ALL_TASK, RA_FAILURE } from './constant';

export const fetchAllRATask = () => {
	console.log('Action called');

	let customErr = { process: 'Invalid access' };

	return (dispatch) => {
		axios
			.get('/api/tasks/allocated')
			.then((response) => {
				axios
					.get('/api/tasks')
					.then((res) => {
						axios
							.get('/api/tasks/closed')
							.then((result) => {
								dispatch({
									type: RA_ALL_TASK,
									payload: {
										allocatedTasks: response.data.data,
										myTasks: res.data.data,
										closed: result.data.data,
									},
								});
							})
							.catch((error) => {
								switch (error.status) {
									case 404:
									case 400:
										dispatch({
											type: RA_FAILURE,
											payload: error.data,
										});
										break;

									default:
										dispatch({
											type: RA_FAILURE,
											payload: customErr,
										});
										break;
								}
							});
					})
					.catch((error) => {
						switch (error.status) {
							case 404:
							case 400:
								dispatch({
									type: RA_FAILURE,
									payload: error.data,
								});
								break;

							default:
								dispatch({
									type: RA_FAILURE,
									payload: customErr,
								});
								break;
						}
					});
			})
			.catch((error) => {
				if (error !== undefined) {
					switch (error.status) {
						case 400:
						case 404:
							dispatch({
								type: RA_FAILURE,
								payload: error.data,
							});
							break;

						default:
							dispatch({
								type: RA_FAILURE,
								payload: customErr,
							});
							break;
					}
				} else {
					dispatch({
						type: RA_FAILURE,
						payload: customErr,
					});
				}
			});
	};
};
