import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ModalBody, Alert, Row, Col } from "reactstrap";
import styled from "styled-components";
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';

import generateState from "../../common/misc/stateGenerator";
import config from "@/config";
import { P } from "@tauri-apps/api/tauri-d78b6be0";

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
  marginBottom: '20px'
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

const Signup = () => {
  const navigate = useNavigate();

  const [userName, email, password, passwordConfirm] = generateState(
    Array.apply(null, Array(5)).map(() => "")
  );

  const handleSignup = (e: any) => {
    e.preventDefault();

    fetch(config.backend_url + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: userName.value,
        email: email.value,
        password: password.value,
        langKey: "en",
      }),
    })
      .then((res: Response) => {
        if (!res.ok) return res.json();
      })
      .then((msg: any) => {
        if (msg) {
          if (msg.detail) {
            toast.error(msg.detail);
          } else {
            toast.error("Something went wrong.");
          }
        } else {
          navigate('/confirm')
        }
      })
      .catch(error => {
        console.error("Error:", error);
        toast.error("An error occurred while processing your signup request.");
      });
  };

  const handleInputChange = (e: any) => {
    switch (e.target.name) {
      case "username":
        userName.set(e.target.value);
        break;
      case "email":
        email.set(e.target.value.trim());
        break;
      case "password":
        password.set(e.target.value);
        break;
      case "password-confirm":
        passwordConfirm.set(e.target.value);
        break;
    }
    e.stopPropagation();
  }

  return (
    <Form onSubmit={handleSignup}>
      <Header id="login-title" data-cy="loginTitle">
        Create new account
      </Header>
      <ModalBody>
        <Row>
          <Col
            md="12"
            onChange={handleInputChange}
          >
            <Input
              name="username"
              placeholder="Username"
              required
              autoFocus
              data-cy="username"
              value={userName.value}
              style={{ width: "225px" }}
            />
            <br />

            <Input
              name="email"
              placeholder="Email"
              required
              autoFocus
              data-cy="email"
              value={email.value}
              style={{ width: "225px" }}
            />
            <br />

            <Input
              name="password"
              type="password"
              placeholder="Your password"
              required
              data-cy="password"
              value={password.value}
              style={{ width: "225px" }}
            />
            <br />

            <Input
              name="password-confirm"
              type="password"
              placeholder="Confirm password"
              required
              data-cy="password"
              value={passwordConfirm.value}
              style={{ width: "225px" }}
            />
            <br />
          </Col>
        </Row>
        <BottomLinks>
          <Link to="/forgot-password" data-cy="forgetYourPasswordSelector">
            Forgot password?
          </Link>
          <Link to="/login">Sign in</Link>
        </BottomLinks>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" data-cy="submit">
          Next
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default Signup;
