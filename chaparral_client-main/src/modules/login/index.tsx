import { useToast } from "@/common/components/ui/use-toast"
import { useNavigate } from 'react-router-dom';
import LoginModal from "./login-modal";
import config from "@/config";
export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
          toast({
            description: "Credentials are not correct",
            variant: 'error'
          });
          return Promise.reject();
        }
      })
      .then((data: any) => {
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
              toast({
                description: "Your account is not activated",
                variant: 'error'
              });
            } else {
              localStorage.setItem("account", JSON.stringify(account));
              toast({
                description: "Successfully logged in!",
                variant: 'success'
              });
              navigate('/user');
            }
          })
      })
  };
  return (
    <LoginModal
      handleLogin={handleLogin}
    />
  );
};

export default Login;
