import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Button, ModalBody, Alert, Row, Col } from "reactstrap";
import styled from "styled-components";

import generateState from "../../common/misc/stateGenerator";
import config from "@/config";
import { Input } from "@/common/components/ui/input";

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

  const [resetKey, newPassword] = generateState(['', '']);

  const handleConfirm = (e: any) => {
    e.preventDefault();

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
          toast.success("Successfully changed your password!");
        } else {
          if (msg.detail) {
            toast.error(msg.detail);
          } else {
            toast.error("Something went wrong.");
          }
        }
      })
      .catch(error => {
        console.error("Error:", error);
        toast.error("An error occurred while processing your request.");
      });
  };

  return (
    <Form onSubmit={handleConfirm}>
      <Header id="login-title" data-cy="loginTitle">
        Reset password
      </Header>
      <p>Please check your email for the reset key.</p>
      <br></br>
      <ModalBody>
        <Row>
          <Col
            md="12"
            onChange={(e: any) => {
              switch (e.target.name) {
                case "reset_key":
                  resetKey.set(e.target.value.trim());
                  break;
                case "new_password":
                  newPassword.set(e.target.value.trim());
                  break;
              }
              e.stopPropagation();
            }}
          >
            <Input
              name="reset_key"
              placeholder="Reset key"
              required
              autoFocus
              data-cy="reset_key"
              value={resetKey.value}
              style={{ width: "225px" }}
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
            />
            <br />
          </Col>
        </Row>
        <div className="mt-1">&nbsp;</div>
        <BottomLinks>
          <Alert color="warning">
            <Link to="/login" data-cy="forgetYourPasswordSelector">
              Sign in
            </Link>
          </Alert>
          <Alert color="warning">
            <Link to="/signup">Sign up</Link>
          </Alert>
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

export default ResetPassword;
