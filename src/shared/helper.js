//SATYAJIT
import jwt_decode from 'jwt-decode';
import dateFormat from 'dateformat';
//import { AllHtmlEntities } from 'html-entities';

export function checkCommercial() {
	try {
		let token = jwt_decode(localStorage.token);

		if (token.sid === 5) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getDashboard() {
	try {
		let token = jwt_decode(localStorage.token);

		if (token.sid === 1) {
			return 'BM';
		} else if (token.sid === 2 || token.sid === 5) {
			return 'CSC';
		} else if (token.sid === 3) {
			return 'RA';
		} else {
			return 'OTH';
		}
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getDesignation_other() {
	try {
		let token = jwt_decode(localStorage.token);
		//console.log("this is token :",token);
		return {
			sid : token.sid ,
			is_gg : token.is_gg
		}
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}
export function getDesignation() {
	try {
		let token = jwt_decode(localStorage.token);
		//console.log("this is token :",token);
		return  token.sid ;
		
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}
export function getOtherLogistic() {
	try {
		let token = jwt_decode(localStorage.token);
		if(token.sid == 4 && token.has_logistic == 1){
      return true;
		}else{
      return false;
		}
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}
export function getOtherOrder() {
	try {
		
		let token = jwt_decode(localStorage.token);
		//console.log("this is token : ",token);
		if(token.sid == 4 && token.has_plant == 1){
      return true;
		}else{
      return false;
		}
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function supportedFileType() {
	return [
		'doc',
		'docx',
		'pdf',
		'txt',
		'odt',
		'rtf',
		'wpd',
		'tex',
		'wks',
		'wps',
		'xls',
		'xlsx',
		'xlr',
		'ods',
		'csv',
		'ppt',
		'pptx',
		'pps',
		'key',
		'odp',
		'ai',
		'bmp',
		'gif',
		'ico',
		'jpeg',
		'jpg',
		'png',
		'svg',
		'tif',
		'tiff',
		'eml',
		'zip',
	];
}

export function getLPlusOne() {
	try {
		let token = jwt_decode(localStorage.token);
		return token.level;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getMyId() {
	try {
		let token_data = jwt_decode(localStorage.token);
		return token_data.did;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function isSPOC() {
	try {
		let token_data = jwt_decode(localStorage.token);
		return token_data.is_spoc;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function fullLangName() {
	try {
		let token_data = jwt_decode(localStorage.token);
		let lang = token_data.lang;

		if (lang == 'ja') {
			return 'Japanese';
		} else if (lang == 'zh') {
			return 'Mandarin';
		} else if (lang == 'es') {
			return 'Spanish';
		} else if (lang == 'pt') {
			return 'Portuguese';
		}
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getMyDrupalId(token) {
	try {
		let token_data = jwt_decode(token);
		return token_data.drid;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getAdminName(token) {
	try {
		let token_data = jwt_decode(token);
		return token_data.name;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getSuperAdmin(token) {
	try {
		let token_data = jwt_decode(token);
		return token_data.sa;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getAdminGroup(token) {
	try {
		let token_data = jwt_decode(token);
		return token_data.gp;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function getUserDisplayName() {
	try {
		let token_data = jwt_decode(localStorage.token);
		return {
			name: token_data.name,
			designation: token_data.desig_name,
			sid: token_data.sid,
			is_gg : token_data.is_gg
		};
	} catch (error) {
		localStorage.clear();
		window.location.href = '/';
	}
}

export function htmlDecode(string) {
	const Entities = require('html-entities').AllHtmlEntities;
	const entities = new Entities();
	return entities.decode(string);
}

export function localDate(cell) {
	var date_time = cell.split(' ');
	var date = date_time[0].split('-');
	var date_format = new Date(date[0], date[1] - 1, date[2]);
	return date_format;
}

export function localDateTime(cell) {
	if (cell) {
		var date_time = cell.split(' ');
		var date = date_time[0].split('-');
		var time = date_time[1].split(':');
		var date_format = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
		return date_format;
	}
}

export function localDateOnly(cell) {
	var date = cell.split('-');
	var date_format = new Date(date[0], date[1] - 1, date[2]);
	return date_format;
}

export function trimString(length, string) {
	var trimmedString = string.substring(0, length);
	return `${trimmedString}...`;
}

export function displayLeaveForm() {
	try {
		let token = jwt_decode(localStorage.token);
		return token.level === 2 || token.level === 3 ? true : false;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function displayCOASearch() {
	try {
		let token = jwt_decode(localStorage.token);

		return token.sid === 1 || token.sid === 2 ? true : false;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function displaySoldTo() {
	try {
		let token = jwt_decode(localStorage.token);

		return token.sid === 5 ? true : false;
	} catch (error) {
		localStorage.clear();
		window.location.href = '';
	}
}

export function inArray(needle, haystack) {
	var length = haystack.length;
	for (var i = 0; i < length; i++) {
		if (haystack[i] == needle) return true;
	}
	return false;
}

export function getMyPic() {
	try {
		let token_data = jwt_decode(localStorage.token);
		return token_data.profile_pic;
	} catch (error) {
		// localStorage.clear();
		// window.location.href="";
	}
}

export function choosePic() {
	try {
		let token_data = jwt_decode(localStorage.token);
		return token_data.choose;
	} catch (error) {
		// localStorage.clear();
		// window.location.href="";
	}
}

export function getUserEmail() {
	try {
		let token_data = jwt_decode(localStorage.token);
		return {
			email: token_data.email,
		};
	} catch (error) {
		// localStorage.clear();
		// window.location.href="/";
	}
}
export function getBase64(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			resolve(reader.result);
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
			reject(error);
		};
	});
}