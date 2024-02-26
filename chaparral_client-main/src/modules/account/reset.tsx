import { useToast } from "@/common/components/ui/use-toast"
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import generateState from "../../common/misc/stateGenerator";
import config from "@/config";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";

const Form = styled.form(() => ({
  display: "flex",
  height: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const Header = styled.h2(() => ({
  fontFamily: "sans-serif",
  marginTop: 0,
}));

const BottomLinks = styled.div(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const ModalFooter = styled.div(() => ({
  marginTop: "20px",
}));

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resetKey, newPassword, newPassword1] = generateState(['', '', '']);

  const handleConfirm = (e: any) => {
    e.preventDefault();
    if (newPassword.value != newPassword1.value) {
      toast({
        description: "Password must match",
        variant: 'error'
      });
      return;
    }
    fetch(config.backend_url + 'account/reset-password/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: resetKey.value,
        newPassword: newPassword.value,
      }),
    })
      .then(response => {
        if (!response.ok) return response.json();
      })
      .then(msg => {
        if (!msg) {
          navigate("/login");
          toast({
            description: "Successfully changed your password",
            variant: 'success'
          });
        } else {
          toast({
            description: msg.detail,
            variant: 'error'
          });
        }
      })
  };

  return (
    <Form onSubmit={handleConfirm}>
      <Header id="login-title" data-cy="loginTitle">
        Reset password
      </Header>
      <p>Please check your email for the reset key.</p>
      <br></br>
      <div>

        <Input
          name="reset_key"
          placeholder="Reset key"
          required
          autoFocus
          data-cy="reset_key"
          value={resetKey.value}
          style={{ width: "225px" }}
          onChange={(e: any) => resetKey.set(e.target.value.trim())}
        />
        <br />
        <Input
          name="new_password"
          type="password"
          placeholder="New password"
          required
          data-cy="new_password"
          value={newPassword.value}
          style={{ width: "225px" }}
          onChange={(e: any) => newPassword.set(e.target.value.trim())}
        />
        <br />
        <Input
          name="new_password1"
          type="password"
          placeholder="Confirm New password"
          required
          data-cy="new_password1"
          value={newPassword1.value}
          style={{ width: "225px" }}
          onChange={(e: any) => newPassword1.set(e.target.value.trim())}
        />
        <br />
        <BottomLinks>
          <Link to="/login" data-cy="forgetYourPasswordSelector">
            Sign in
          </Link>
          <Link to="/signup">Sign up</Link>
        </BottomLinks>
      </div>
      <ModalFooter>
        <Button color="primary" type="submit" data-cy="submit">
          Submit
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default ResetPassword;
