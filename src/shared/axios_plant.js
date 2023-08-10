import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
	(config) => {
		const auth_token = localStorage.plant_token;
		if (auth_token) {
			config.headers['Authorization'] = `Bearer ${auth_token}`;
		}
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
			window.location.href = '/plant_login';
			return Promise.reject(error.response);
		} else {
			return Promise.reject(error.response);
		}
	}
);

export default instance;
