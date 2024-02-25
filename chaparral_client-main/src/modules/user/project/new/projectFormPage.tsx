import { styled } from "styled-components";
import BreadCrumbs from "../breadCrumbs";
import ProjectForm from "@/modules/user/project/new/projectForm";

const Wrapper = styled.div({
    margin: '20px 0px 0px 20px'
});

const ProjectFormPage = () => {
    return (
        <Wrapper>
            <BreadCrumbs />
            <br />
            <ProjectForm />
        </Wrapper>
    );
};

export default ProjectFormPage;