import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ModalBody, Alert, Row, Col } from "reactstrap";
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
  marginBottom: '10px'
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

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email] = generateState(['']);

  const handleConfirm = async (e: any) => {
    e.preventDefault();
    fetch(config.backend_url + 'account/reset-password/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email.value),
    }).then((res: Response) => {
      if (!res.ok) return res.json();
    })
      .then((data: any) => {
        if (data) {
          if (data.errorData.detail) {
            toast.error(data.detail);
          } else {
            toast.error("Something went wrong.");
          }
        } else {
          navigate("/reset-password");
        }
      })
      .catch((error: Error) => {
        console.error("Error occurred:", error);
        // Handle error as needed
      });
  }

  return (
    <Form onSubmit={handleConfirm}>
      <Header id="login-title" data-cy="loginTitle">
        Recover your account
      </Header>
      <p style={{ marginBottom: 20, fontSize: '0.8rem' }}>Enter the email address you used to register.</p>
      <ModalBody>
        <Row>
          <Col
            md="12"
            onChange={(e: any) => {
              switch (e.target.name) {
                case "email":
                  email.set(e.target.value.trim());
                  break;
              }
              e.stopPropagation();
            }}
          >
            <Input
              name="email"
              placeholder="Email address"
              required
              autoFocus
              data-cy="email"
              value={email.value}
              style={{ width: "225px" }}
            />
            <br />
          </Col>
        </Row>
        <BottomLinks>
          <Link to="/login" data-cy="forgetYourPasswordSelector">
            Sign in
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

export default ForgotPassword;
