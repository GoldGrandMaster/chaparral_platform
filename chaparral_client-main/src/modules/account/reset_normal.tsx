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
  display: "flex",
  marginTop: "20px",
  gap: "30px"
}));

const ResetPasswordNormal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, newPassword1] = generateState(['', '', '']);
  const token = localStorage.getItem('token');
  if (!token) {
    // Handle case where token is not available
    return;
  }
  const handleConfirm = (e: any) => {
    e.preventDefault();
    if (newPassword.value != newPassword1.value) {
      toast({
        description: "Password must match",
        variant: 'error'
      });
      return;
    }
    fetch(config.backend_url + 'account/reset-password/normal', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: newPassword.value,
    })
      .then(response => {
        if (!response.ok) return response.json();
      })
      .then(msg => {
        if (!msg) {
          toast({
            description: "Successfully changed your password",
            variant: 'success'
          });
        } else
          toast({
            description: msg.detail,
            variant: 'error'
          });
      })
  };

  return (
    <Form onSubmit={handleConfirm}>
      <Header id="login-title" data-cy="loginTitle">
        Reset password
      </Header>
      <br />
      <div>
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
      </div>
      <ModalFooter>
        <Button color="primary" type="submit" data-cy="submit">
          Change
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default ResetPasswordNormal;
