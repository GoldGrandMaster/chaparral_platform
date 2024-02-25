import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { useToast } from "@/common/components/ui/use-toast"
import generateState from "../../common/misc/stateGenerator";
import config from "@/config";

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
  "a": {
    fontSize: '0.9rem',
  }
}));

const ModalFooter = styled.div(() => ({
  marginTop: "20px",
}));

const Confirm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activationKey] = generateState(['']);

  const handleConfirm = (e: any) => {
    e.preventDefault();

    fetch(config.backend_url + 'activate?key=' + activationKey.value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response: Response) => {
        if (!response.ok) return response.json();
        return response.text();
      })
      .then((data: any) => {
        if (data)
          toast({
            description: data.detail,
            variant: 'error'
          });
        else {
          navigate('/login');
          toast({
            description: "Account was activated",
            variant: 'success'
          });
        }
      });
  }

  return (
    <Form onSubmit={handleConfirm}>
      <Header>Confirm account</Header>
      <p style={{ marginBottom: 20, fontSize: '0.8rem' }}>Please check your email for the activation key.</p>
      <div>
        <Input
          name="activation-key"
          placeholder="Activation key"
          required
          autoFocus
          data-cy="activation-key"
          value={activationKey.value}
          style={{ width: "225px" }}
          onChange={(e: any) => activationKey.set(e.target.value.trim())}
        />
        <br />
        <BottomLinks>
          <Link to="/forgot-password" data-cy="forgetYourPasswordSelector">
            Forgot password?
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

export default Confirm;
