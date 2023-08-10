import swal from 'sweetalert';

export function showErrorMessage(err, token_rm, props) {
	let errText = '';
	if (err && err.data) {
		errText = err.data.message ? err.data.message : '';
	}

	swal({
		closeOnClickOutside: false,
		title: 'Access Denied',
		text: errText,
		icon: 'error',
	}).then(() => {
		if (localStorage.getItem('logistics_token') && token_rm === 1) {
			localStorage.removeItem('logistics_token');
			window.location.href = '/';
		} else {
			window.location.href = '/';
		}
	});
}
