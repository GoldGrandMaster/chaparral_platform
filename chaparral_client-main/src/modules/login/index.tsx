import React from "react";
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
          .then((response: Response) => {
            if (response.ok) return response.json();
            else {
              localStorage.removeItem("account");
              toast.error("Your account is not activated");
            }
          })
          .then((account: any) => {
            localStorage.setItem("account", JSON.stringify(account));
            navigate('/user');
            toast.success("Successfully logged in!");
          })
          .catch((error: Error) => {
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
          })
      })
      .catch((error: Error) => {
        console.error("Error during login:", error);
        toast.error("An error occurred during login.");
      })
  };


  return (
    <LoginModal
      handleLogin={handleLogin}
    />
  );
};

export default Login;
