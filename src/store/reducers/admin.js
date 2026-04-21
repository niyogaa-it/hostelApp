import { ADMIN_LIST } from '../actions/constant';

const INTIAL_STATE = {
	admin_list: {},
};
export default function (state = INTIAL_STATE, action) {
	switch (action.type) {
		case ADMIN_LIST:
			return { ...state, admin_list: action.payload };
		default:
			return state;
	}
}
