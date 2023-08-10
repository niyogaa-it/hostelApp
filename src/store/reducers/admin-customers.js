import {
  FETCH_CUSTOMER,
  FAIL_RESPONSE,
  AUTH_LOGOUT,
} from "../actions/constant";

const initialState = {
  customers: {},
  isLoading: true,
  errors: {},
  set_data: {},
 
};
export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CUSTOMER:
      return {
        customers: action.payload,
        isLoading: false,
      };
	  
    case FAIL_RESPONSE:
      return {
        errors: action.payload,
      };
    case AUTH_LOGOUT:
      return initialState;
  
    default:
      return state;
  }
}