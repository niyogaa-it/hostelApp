import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
	(config) => {
		// Insert authorization token on request call
		const token = localStorage.getItem('token');

		config.headers['Authorization'] = `Bearer ${token}`;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add a response interceptor
instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.clear();
			window.location.href = '/'; // SATYAJIT
			return Promise.reject(error.response);
		} else {
			return Promise.reject(error.response);
		}
	}
);

export default instance;
