import BreadCrumbs from "../breadCrumbs";
import ProjectsTable from "@/modules/user/project/listview/projectsTable";


const Project = () => {
    return (
        <div className="p-5">
            <BreadCrumbs />
            <br />
            <ProjectsTable />
        </div>
    );
};

export default Project;