import { Button } from "@/common/components/ui/button"
import { Link } from "react-router-dom"
import { styled } from "styled-components";

const PageWrapper = styled.div(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh'
}));

const NotFoundPage = () => {
    return (
        <PageWrapper>
            <h3 style={{marginBottom: '20px'}}>Page not found.</h3>
            <Link to="/user"><Button>Go back to your account</Button></Link>
        </PageWrapper>
    );
};

export default NotFoundPage;