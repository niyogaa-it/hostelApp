import axios from '../../shared/axios';
import { CSC_ALL_TASK, CSC_FAILURE } from './constant';

export const fetchAllCSCTask = () => {
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
									type: CSC_ALL_TASK,
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
											type: CSC_FAILURE,
											payload: error.data,
										});
										break;

									default:
										dispatch({
											type: CSC_FAILURE,
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
									type: CSC_FAILURE,
									payload: error.data,
								});
								break;

							default:
								dispatch({
									type: CSC_FAILURE,
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
								type: CSC_FAILURE,
								payload: error.data,
							});
							break;

						default:
							dispatch({
								type: CSC_FAILURE,
								payload: customErr,
							});
							break;
					}
				} else {
					dispatch({
						type: CSC_FAILURE,
						payload: customErr,
					});
				}
			});
	};
};
