import React, { useEffect, useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import config from '@/config';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import UploadProgress from '@/common/misc/Upload/UploadProgress/UploadProgress';
import { useDispatch } from 'react-redux';
import { setUploadFile } from '@/redux/uploadFile/uploadFile.actions';
const Label = styled.label`
  font-weight: bold;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 500px;
`;

const ProjectFileUploadForm = () => {
    const dispatch = useDispatch();
    const [curProject, setCurProject] = useState([]);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const handleFileUpload = (files: any) => {
        setFiles(files);
    }
    const handleSubmit = () => {
        dispatch(setUploadFile(files, curProject[1]));
        setFiles([]);
    }
    /*
    const handleSubmit = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Handle case where token is not available
            return;
        }
        const data = new FormData();
        data.append('project_id', JSON.parse(localStorage.getItem('currentProject') || "")[1]);
        console.log(files);
        for (let i = 0; i < files.length; i++) data.append('files', files[i]);
        // data.append('files', files);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        };

        fetch(config.backend_url + 'projects/upload', requestOptions)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("There was an error");
            })
            .then(res => {
                // navigate('/user/project/');
                toast.success("Successfully uploaded");
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error("There was an error uploading files")
            });
    };
    */
    useEffect(() => {
        const curProj = JSON.parse(localStorage.getItem('currentProject') || "");
        setCurProject(curProj);
    }, [])
    return (
        <StyledForm>
            <p style={{ fontSize: "30px" }}>{curProject[2]}</p>
            <h1>{curProject[3]}</h1>
            <div>
                <FileUploader
                    multiple={true}
                    handleChange={handleFileUpload}
                    label='Upload files'
                />
                {files.length > 0 &&
                    Array.from(files).map((file: File, ind: number) => <div key={ind}>- {file.name}</div>)
                }
            </div>
            <Button className="bg-primary-foreground border-[1px] border-solid border-tertiary text-primary" onClick={handleSubmit}>
                Upload files.
            </Button>
            <UploadProgress />
        </StyledForm>
    );
};

export default ProjectFileUploadForm;