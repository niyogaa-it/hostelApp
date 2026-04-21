import swal from 'sweetalert';

export function showErrorMessage(err, props) {
	console.log({ 'ERROR =>': err });
	var errText = '';
	if (localStorage.getItem('admin_token')) {
		if (err && err.data) {
			errText = err.data.message
				? JSON.stringify(err.data.message)
				: err.data.errors
				? JSON.stringify(err.data.errors)
				: '';
		}
	} else {
		if (err && err.data) {
			errText = err.data.message
				? JSON.stringify(err.data.message)
				: err.data.errors
				? JSON.stringify(err.data.errors)
				: '';
		}
	}

	swal({
		closeOnClickOutside: false,
		title: 'Error',
		text: errText,
		icon: 'error',
	}).then(() => {
		if (localStorage.getItem('admin_token')) {
			if (err.data && err.data.status === 5) {
				localStorage.removeItem('admin_token');
			}
			//props.history.push('/admin');
			window.location.href = '/';
		} else {
			//props.history.push('/');
			window.location.href = '/';
		}
	});
}
