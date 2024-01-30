import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const Nav = styled.nav(() => ({
    height: "50px",
    width: "100vw",
    background: "#22272E",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

const LogoutLink = styled(Link)(() => ({
    marginRight: '10px'
}));

const AccountContent = styled.div(() => ({
    marginTop: "10px",
    textAlign: 'center',
}));

const Account = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('account');
        navigate('/login');
    };
    const account = JSON.parse(localStorage.getItem('account') || '{}');

    return (
        <div>
            <Nav>
                <span></span>
                <LogoutLink to="#" onClick={handleLogout}>Logout</LogoutLink>
            </Nav>
            <AccountContent>
                Welcome to your account, {account.login}!
            </AccountContent>
        </div>
    );
};

export default Account;