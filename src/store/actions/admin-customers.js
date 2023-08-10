import axios from "../../shared/axios";
import { FETCH_CUSTOMER, FAIL_RESPONSE, STORE_USER_TOKEN } from "./constant";
import API from "../../shared/admin-axios";

export const fetchCustomer = () => {
  let customErr = { process: "Invalid response" };

  return (dispatch) => {
    axios
      .get("/api/customers")
      .then((res) => {
        dispatch({
          type: FETCH_CUSTOMER,
          payload: res.data.data,
        });
      })
      .catch((error) => {
        if (error !== undefined) {
          switch (error.status) {
            case 400:
            case 404:
              dispatch({
                type: FAIL_RESPONSE,
                payload: error.data,
              });
              break;

            default:
              dispatch({
                type: FAIL_RESPONSE,
                payload: customErr,
              });
              break;
          }
        } else {
          dispatch({
            type: FAIL_RESPONSE,
            payload: customErr,
          });
        }
      });
  };
};
