import React, { Component, lazy, Suspense } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import Tracker from './tracker'; // SATYAJIT

//import AdminLayout from './components/admin/layout/Layout';

import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

var path = require('path');
var UrlPattern = require('url-pattern');

const UserComponent = lazy(() => import(/* webpackChunkName: "user-module" */ './routes/User'));
const AdminComponent = lazy(() => import(/* webpackChunkName: "admin-module" */ './routes/Admin'));
const QAComponent = lazy(() => import(/* webpackChunkName: "QA-module" */ './routes/QA'));
const PlantComponent = lazy(() => import(/* webpackChunkName: "plant-module" */ './routes/Plant'));
const LogisticsComponent = lazy(() =>
	import(/* webpackChunkName: "logistics-module" */ './routes/Logistics')
);

const WaitingComponent = (Component) => {
	return (props) => (
		<Suspense fallback={<div>Loading...</div>}>
			<Component {...props} />
		</Suspense>
	);
};

class App extends Component {
	constructor(props) {
		super(props);

		// var url = new URL(window.location.href);

		// var query_string = url.search;

		// console.log('app',query_string);
		var url_pattern = '';
		var url_pattern_review = '';
		var current_url = window.location.href;
		if (process.env.REACT_APP_CUSTOM_ENV == 'production') {
			url_pattern = /\bhttps:\/\/xceed.mydrreddys.com\/user\/dashboard\/outlook\/\b[A-Za-z0-9]*$/;
		} else if (process.env.REACT_APP_CUSTOM_ENV == 'qa') {
			url_pattern =
				/\bhttps:\/\/xceed-qa-frontend.mydrreddys.com\/user\/dashboard\/outlook\/\b[A-Za-z0-9]*$/;
		} else if (process.env.REACT_APP_CUSTOM_ENV == 'development') {
			url_pattern =
				/\bhttps:\/\/xceed.indusnettechnologies.com\/user\/dashboard\/outlook\/\b[A-Za-z0-9]*$/;
		}

		if (process.env.REACT_APP_CUSTOM_ENV == 'production') {
			url_pattern_review =
				/\bhttps:\/\/xceed.mydrreddys.com\/user\/dashboard\/review_request\/\b[A-Za-z0-9]*$/;
		} else if (process.env.REACT_APP_CUSTOM_ENV == 'qa') {
			url_pattern_review =
				/\bhttps:\/\/xceed-qa-frontend.mydrreddys.com\/user\/dashboard\/review_request\/\b[A-Za-z0-9]*$/;
		} else if (process.env.REACT_APP_CUSTOM_ENV == 'development') {
			url_pattern_review =
				/\bhttps:\/\/xceed.indusnettechnologies.com\/user\/dashboard\/review_request\/\b[A-Za-z0-9]*$/;
		}

		//console.log(process.env.REACT_APP_OUTLOOK_URL);
		//var pattern = `/[${process.env.REACT_APP_OUTLOOK_URL}/user/dashboard/outlook/][a-zA-Z0-9]*$/`;
		//console.log(pattern);
		// var options = {};
		// options.segmentNameCharset = 'a-zA-Z0-9';

		// var ot_url = `/user/dashboard/outlook/:id`;
		// var pattern = new UrlPattern(ot_url,options);
		// console.log(current_url.match(url_pattern_review));
		// console.log("URL",url_pattern_review);
		// console.log("CURRENT",current_url);

		//console.log(current_url.match(url_pattern));
		//console.log("URL",url_pattern);
		//console.log("CURRENT",current_url);

		if (current_url.match(url_pattern) != null && localStorage.getItem('token') === null) {
			localStorage.setItem('ot', path.basename(current_url));
		}

		if (current_url.match(url_pattern_review) != null && localStorage.getItem('token') === null) {
			localStorage.setItem('customer_approval', path.basename(current_url));
		}
	}

	render() {
		let currentLoginType = '';
		if (window.location.hostname == 'demo71v2.indusnet.cloud') {
			// For VAPT
			currentLoginType = history.location.pathname.split('/')[2];
		} else {
			currentLoginType = history.location.pathname.split('/')[1];
		}
		const isAdmin = currentLoginType && currentLoginType.indexOf('admin') > -1;
		const isQA = currentLoginType && currentLoginType.indexOf('qa') > -1;
		const isPlant = currentLoginType && currentLoginType.indexOf('plant') > -1;
		const isLogistics = currentLoginType && currentLoginType.indexOf('logistics') > -1;

		if (isAdmin) {
			return (
				<div className="wrapper" style={{ height: 'auto' }}>
					<Switch>
						<Route path="/admin" component={WaitingComponent(AdminComponent)} />
					</Switch>
				</div>
			);
		} else if (isQA) {
			return (
				<div className="wrapper" style={{ minHeight: '100vh' }}>
					<Switch>
						<Route path="/" component={WaitingComponent(QAComponent)} />
					</Switch>
				</div>
			);
		} else if (isPlant) {
			return (
				<div className="wrapper" style={{ minHeight: '100vh' }}>
					<Switch>
						<Route path="/" component={WaitingComponent(PlantComponent)} />
					</Switch>
				</div>
			);
		} else if (isLogistics) {
			return (
				<div className="wrapper" style={{ minHeight: '100vh' }}>
					<Switch>
						<Route path="/" component={WaitingComponent(LogisticsComponent)} />
					</Switch>
				</div>
			);
		} else {
			return (
				<div className="wrapper" style={{ height: 'auto' }}>
					<Switch>
						<Route path="/" component={WaitingComponent(UserComponent)} />
					</Switch>
				</div>
			);
		}
	}
}

export default withRouter(App);
