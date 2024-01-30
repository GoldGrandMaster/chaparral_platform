import { styled } from "styled-components";
import Table from "../../dashboard/components/table";
import BreadCrumbs from "../breadCrumbs";
import ProjectsTable from "@/modules/user/project/listview/projectsTable";

const Wrapper = styled.div({
    margin: '20px 0px 0px 20px'
});

const Project = () => {
    return (
        <Wrapper>
            <BreadCrumbs />
            <br/>
            <ProjectsTable />
        </Wrapper>
    );
};

export default Project;