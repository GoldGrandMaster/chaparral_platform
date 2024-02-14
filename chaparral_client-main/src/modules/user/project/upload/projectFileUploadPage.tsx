import { styled } from "styled-components";
import BreadCrumbs from "../breadCrumbs";
import ProjectFileUploadForm from "./projectFileUploadForm";

const ProjectFileUploadPage = () => {
    return (
        <div className="p-5 h-full">
            <BreadCrumbs />
            <ProjectFileUploadForm />
        </div>
    );
};

export default ProjectFileUploadPage;