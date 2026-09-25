
import API from "../../../shared/admin-axios";
const userLog = (moduleName,action_perform) =>{
  const isLoggedIn = localStorage.getItem("admin_token") !== null ? 'Admin' : 'Other';
  const username = localStorage.getItem("username");
 
  let data = {
    userName: username,
    moduleName: moduleName,
    action_perform: action_perform,
  };

  API.post(`/admin/secure/logs/addlog`, data)
  .then((res) => {
    console.log("res:", res);

  })
  .catch((err) => {
    console.log("err:", err);
    
  });
}

export default userLog;


