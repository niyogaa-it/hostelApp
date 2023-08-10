import {
  AUTH_TOKEN,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  NOTIFICATIONS,
  NOTIFICATIONS_COUNT,
  CLOSE_NOTIFICATIONS,
  STORE_USER_TOKEN,
} from "../actions/constant";

const INTIAL_STATE = { data: "", errors: {}, userToken: [] };

export default function(state = INTIAL_STATE, action) {
  switch (action.type) {
    case AUTH_TOKEN:
      return {
        token: action.payload.token,
        notificationData: action.payload.notificationData,
        countNotification: action.payload.countNotification,
        countUnreadNotification: action.payload.countUnreadNotification,
        openNotification: false,
      };
    case NOTIFICATIONS:
      return {
        notificationData: action.payload.notificationData,
        countNotification: action.payload.countNotification,
        countUnreadNotification: action.payload.countUnreadNotification,
        openNotification: action.payload.openNotification,
      };
    case NOTIFICATIONS_COUNT:
      return {
        countNotification: action.payload.countNotification,
        countUnreadNotification: action.payload.countUnreadNotification,
        openNotification: action.payload.openNotification,
      };
    case CLOSE_NOTIFICATIONS:
      return {
        openNotification: action.payload.openNotification,
        countNotification: action.payload.countNotification,
        countUnreadNotification: action.payload.countUnreadNotification,
      };

    case AUTH_FAILURE:
      return {
        errors: action.payload,
      };
    case AUTH_LOGOUT:
      return INTIAL_STATE;
    case STORE_USER_TOKEN:
      return {
        ...state,
        userToken: action.payload,
      };
    default:
      // persist token only if page reload
      if (state && action.type === "@@INIT") {
        let persist_token = "";
        if (localStorage.getItem("token")) {
          persist_token = localStorage.getItem("token");
        } else if (localStorage.getItem("admin_token")) {
          persist_token = localStorage.getItem("admin_token");
        }
        if (persist_token) {
          return {
            data: persist_token,
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
  }
}