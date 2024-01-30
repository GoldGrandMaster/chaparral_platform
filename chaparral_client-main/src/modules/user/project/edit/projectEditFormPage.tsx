import { styled } from "styled-components";
import BreadCrumbs from "../breadCrumbs";
import ProjectEditForm from "@/modules/user/project/edit/projectEditForm";

const Wrapper = styled.div({
    margin: '20px 0px 0px 20px'
});

const ProjectFormPage = () => {
    return (
        <Wrapper>
            <BreadCrumbs />
            <br />
            <ProjectEditForm />
        </Wrapper>
    );
};

export default ProjectFormPage;