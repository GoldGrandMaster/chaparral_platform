import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ModalBody, Row, Col } from "reactstrap";
import styled from "styled-components";
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';

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

  const [activationKey] = generateState(['']);

  const handleConfirm = (e: any) => {
    e.preventDefault();

    fetch(`activate/key=${activationKey.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response: Response) => {
        if (!response.ok) return response.json();
      })
      .then((data: any) => {
        if (data) {
          if (data.detail) {
            toast.error(data.detail);
          } else {
            toast.error('Something went wrong.');
          }
        } else {
          navigate('/login');
          toast.success('Successfully created a new account!');
        }
      }).catch((error: Error) => {
        console.error('Error:', error);
        toast.error('An error occurred while communicating with the server.');
      });
  }

  return (
    <Form onSubmit={handleConfirm}>
      <Header id="login-title" data-cy="loginTitle">
        Confirm account
      </Header>
      <p style={{ marginBottom: 20, fontSize: '0.8rem' }}>Please check your email for the activation key.</p>
      <ModalBody>
        <Row>
          <Col
            md="12"
            onChange={(e: any) => {
              switch (e.target.name) {
                case "activation-key":
                  activationKey.set(e.target.value.trim());
                  break;
              }
              e.stopPropagation();
            }}
          >
            <Input
              name="activation-key"
              placeholder="Activation key"
              required
              autoFocus
              data-cy="activation-key"
              value={activationKey.value}
              style={{ width: "225px" }}
            />
            <br />
          </Col>
        </Row>
        <BottomLinks>
          <Link to="/forgot-password" data-cy="forgetYourPasswordSelector">
            Forgot password?
          </Link>
          <Link to="/signup">Sign up</Link>
        </BottomLinks>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" data-cy="submit">
          Submit
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default Confirm;
