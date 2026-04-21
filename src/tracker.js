import React from 'react';
import { withRouter } from 'react-router';
import { getUserEmail } from './shared/helper';

class Tracker extends React.Component {
	// constructor(props){
	//     super(props);

	//     let userEmail = getUserEmail();
	//     if(window._paq){
	//         window._paq = [];
	//     }
	//     var _paq = window._paq || [];
	//     if(userEmail){
	//         _paq.push(['setUserId', userEmail.email]);
	//     }else{
	//         _paq.push(['resetUserId']);
	//     }
	//     _paq.push(['setDocumentTitle', document.title]);
	//     _paq.push(['setCustomUrl', this.props.location.pathname]);
	//     _paq.push(['trackPageView']);
	//     _paq.push(['enableLinkTracking']);

	//     (function() {
	//         console.log('consturctor called')
	//         var u=`${process.env.REACT_APP_MATOMO_URL}`;
	//         _paq.push(['setTrackerUrl', u+'matomo.php']);
	//         _paq.push(['setSiteId', `${process.env.REACT_APP_MATOMO_SITE_ID}`]);
	//         var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];

	//         console.log('consturctor scripts ===>', s, d.getElementsByTagName('script'))

	//         g.type='text/javascript'; g.async=false; g.defer=false; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
	//         console.log('g', g);

	//         console.log('consturctor g', g)
	//         console.log('consturctor s', s)
	//     })();

	//     window._paq = _paq;
	// }

	componentWillReceiveProps() {
		// let userEmail = getUserEmail();
		// if(window._paq){
		//     window._paq = [];
		// }
		// var _paq = window._paq || [];
		// if(userEmail){
		//     _paq.push(['setUserId', userEmail.email]);
		// }else{
		//     _paq.push(['resetUserId']);
		// }
		// _paq.push(['setDocumentTitle', document.title]);
		// _paq.push(['setCustomUrl', this.props.location.pathname]);
		// _paq.push(['trackPageView']);
		// _paq.push(['enableLinkTracking']);

		// (function() {
		//     console.log('componentWillReceiveProps called')
		//     var u=`${process.env.REACT_APP_MATOMO_URL}`;
		//     _paq.push(['setTrackerUrl', u+'matomo.php']);
		//     _paq.push(['setSiteId', `${process.env.REACT_APP_MATOMO_SITE_ID}`]);
		//     var d=document, p=d.createElement('script'), X=d.getElementsByTagName('script')[0];

		//     console.log('componentWillReceiveProps X', X, d.getElementsByTagName('script'))

		//     p.type='text/javascript'; p.async=true; p.defer=true; p.src=u+'matomo.js';

		//     X.parentNode.insertBefore(p,X);

		//     console.log('componentWillReceiveProps p', p)
		//     console.log('componentWillReceiveProps X', X)
		// })();

		// window._paq = _paq;

		console.log('props received');
		let userData = getUserEmail();
		var _paq = window._paq || [];
		if (userData) {
			_paq.push(['setUserId', userData.email]);
		} else {
			_paq.push(['resetUserId']);
		}
		_paq.push(['setDocumentTitle', document.title]);
		_paq.push(['setCustomUrl', this.props.location.pathname]);
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);

		(function () {
			var u = `${process.env.REACT_APP_MATOMO_URL}`;
			_paq.push(['setTrackerUrl', u + 'matomo.php']);
			_paq.push(['setSiteId', `${process.env.REACT_APP_MATOMO_SITE_ID}`]);
			var d = document,
				g = d.createElement('script'),
				s = d.getElementsByTagName('script')[0];
			console.log('===== d ==========>', d);
			console.log('===== s ==========>', s);
			g.type = 'text/javascript';
			g.async = true;
			g.defer = true;
			g.src = u + 'matomo.js';
			s.parentNode.insertBefore(g, s);

			console.log('===== g ==========>', g);
		})();

		window._paq = _paq;
	}

	render() {
		return null;
	}
}

export default withRouter(Tracker);
