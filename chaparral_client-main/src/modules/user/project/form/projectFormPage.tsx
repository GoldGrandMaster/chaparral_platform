import { styled } from "styled-components";
import Table from "../../dashboard/components/table";
import BreadCrumbs from "../breadCrumbs";
import ProjectsTable from "@/modules/user/project/listview/projectsTable";
import ProjectForm from "@/modules/user/project/form/projectForm";

const Wrapper = styled.div({
    margin: '20px 0px 0px 20px'
});

const ProjectFormPage = () => {
    return (
        <Wrapper>
            <BreadCrumbs />
            <br/>
            <ProjectForm />
        </Wrapper>
    );
};

export default ProjectFormPage;