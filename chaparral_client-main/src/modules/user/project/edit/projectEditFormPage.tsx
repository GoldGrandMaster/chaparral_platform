
import BreadCrumbs from "../breadCrumbs";
import ProjectEditForm from "@/modules/user/project/edit/projectEditForm";


const ProjectFormPage = () => {
    return (
        <div className="p-5">
            <BreadCrumbs />
            <br />
            <ProjectEditForm />
        </div>
    );
};

export default ProjectFormPage;