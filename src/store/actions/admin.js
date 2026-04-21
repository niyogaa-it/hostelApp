import API from "../../shared/admin-axios";
import {  STORE_USER_TOKEN } from "./constant";

export const store_user_token = (data) => {
	return (dispatch) => {
		  dispatch({
			type: STORE_USER_TOKEN,
			payload: data,
		  });
	};
  };