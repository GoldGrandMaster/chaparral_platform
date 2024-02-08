import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import LoginModal from "./login-modal";
import config from "@/config";
export const Login = () => {
  const navigate = useNavigate();
  const handleLogin = async (
    username: string,
    password: string,
    rememberMe = false
  ) => {
    fetch(config.backend_url + "authenticate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        rememberme: "false"
      }),
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          toast.error("Something went wrong. Please check your credentials.");
        }
      })
      .then((data: any) => {
        if (!data) return;
        localStorage.setItem("token", data.id_token);
        fetch(config.backend_url + "account", {
          method: "GET",
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
          .then((response: Response) => response.json())
          .then((account: any) => {
            if (!account.activated) {
              localStorage.removeItem("account");
              toast.error("Your account is not activated");
            } else {
              localStorage.setItem("account", JSON.stringify(account));
              navigate('/user');
              toast.success("Successfully logged in!");
            }
          })
          .catch((error: Error) => {
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
          })
      })
      .catch((error: Error) => {
        console.error("Error during login:", error);
        toast.error("An error occurred during login.\n" + error.message + error.name + error.cause);
      })
  };

  // const handleLogin = async (
  //   username: any,
  //   password: any,
  //   rememberMe = false
  // ) => {
  //   let msg: any = await invoke("login", { username, password, rememberMe });
  //   msg = msg && JSON.parse(msg);
  //   if (msg && msg.id_token) {
  //     localStorage.setItem("token", msg.id_token);
  //     let account: any = await invoke("get_account", { authorization: 'Bearer ' + localStorage.getItem('token') });
  //     account = account && JSON.parse(account);
  //     if (account.activated) {
  //       localStorage.setItem("account", JSON.stringify(account));
  //       navigate('/user');
  //       toast.success("Successfully logged in!");
  //     } else {
  //       localStorage.removeItem("account");
  //       toast.error("Your account is not activated");
  //     }
  //   } else {
  //     toast.error("Something went wrong. Please check your credentials.");
  //   }
  // };

  return (
    <LoginModal
      handleLogin={handleLogin}
    />
  );
};

export default Login;
