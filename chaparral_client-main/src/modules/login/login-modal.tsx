import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';

const Form = styled.form(() => ({
  display: 'flex',
  height: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}));

const Header = styled.h1(() => ({
  fontFamily: 'sans-serif',
  marginTop: 0,
  marginBottom: '20px'
}));

const BottomLinks = styled.div(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  "a": {
    fontSize: '0.9rem',
  }
}));

const ModalFooter = styled.div(() => ({
  marginTop: '20px'
}));

const RememberMe = styled.span(() => ({
  fontFamily: 'sans-serif',
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
  "input": {
    marginRight: '5px'
  }
}));

export interface ILoginModalProps {
  handleLogin: (username: string, password: string, remember_me: boolean) => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const login = ({ userName, password, rememberMe }: { userName: any, password: any, rememberMe: any }) => {
    props.handleLogin(userName, password, rememberMe);
  };

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: any) => {
    e.preventDefault();
    login({ ...e, userName, password });
  };

  return (
    <Form
      onSubmit={(handleLoginSubmit)}
    >
      <Header id="login-title" data-cy="loginTitle"
      >
        Sign in
      </Header>
      <div>
        <Input
          name="username"
          placeholder="Your username"
          required
          autoFocus
          data-cy="username"
          value={userName}
          style={{ width: '225px' }}
          onChange={(e: any) => setUserName(e.target.value.trim())}
        />
        <br />
        <Input
          name="password"
          type="password"
          placeholder="Your password"
          required
          data-cy="password"
          value={password}
          style={{ width: '225px', marginBottom: '15px' }}
          onChange={(e: any) => setPassword(e.target.value.trim())}
        />
        {/* <RememberMe>
              <input name="rememberMe" type="checkbox" 
              // check
              //  label="Remember me"
              //  value={true} 
              //  register={register} 
               /> Remember me</RememberMe> */}
        <BottomLinks>
          <Link to="/forgot-password" data-cy="forgetYourPasswordSelector">
            Forgot password?
          </Link>
          <Link to="/signup">
            Signup
          </Link>
        </BottomLinks>
      </div>
      <ModalFooter>
        <Button color="primary" type="submit" data-cy="submit">
          Sign in
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default LoginModal;
