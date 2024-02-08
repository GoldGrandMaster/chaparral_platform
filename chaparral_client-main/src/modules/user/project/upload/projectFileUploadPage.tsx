import { styled } from "styled-components";
import BreadCrumbs from "../breadCrumbs";
import ProjectFileUploadForm from "./projectFileUploadForm";

const Wrapper = styled.div({
    margin: '20px 0px 0px 20px'
});

const ProjectFileUploadPage = () => {
    return (
        <Wrapper>
            <BreadCrumbs />
            <br />
            <ProjectFileUploadForm />
        </Wrapper>
    );
};

export default ProjectFileUploadPage;