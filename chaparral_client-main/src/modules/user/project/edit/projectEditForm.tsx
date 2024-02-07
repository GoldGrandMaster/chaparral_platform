import React, { useEffect, useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import config from '@/config';
import { FileUploader } from 'react-drag-drop-files';
import { event } from '@tauri-apps/api';
import { useFieldArray } from 'react-hook-form';
const Label = styled.label`
  font-weight: bold;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 500px;
`;

const ProjectForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [files, setFiles] = useState("");
    const navigate = useNavigate();
    const handleFileUpload = (files: any) => {
        setFiles(files);
    }
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Handle case where token is not available
            return;
        }
        const data = new FormData();
        data.append('id', JSON.parse(localStorage.getItem('currentProject') || "")[1]);
        data.append('name', formData.name);
        data.append('description', formData.description);
        console.log(files);
        for (let i = 0; i < files.length; i++) data.append('files', files[i]);
        // data.append('files', files);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        };

        fetch(config.backend_url + 'projects', requestOptions)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("There was an error");
            })
            .then(res => {
                navigate('/user/project/');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    useEffect(() => {
        const curProj = JSON.parse(localStorage.getItem('currentProject') || "");
        setFormData({
            name: curProj[2],
            description: curProj[3]
        });
    }, [])
    return (
        <StyledForm>
            <Label>Name</Label>
            <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <Label>Description</Label>
            <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
            />
            <div>
                <FileUploader
                    multiple={true}
                    handleChange={handleFileUpload}
                    label='upload files'
                />
                {files.length > 0 &&
                    Array.from(files).map((file: File, ind: Number) => <div key={ind}>- {file.name}</div>)
                }
            </div>
            <Button className="bg-primary-foreground border-[1px] border-solid border-tertiary text-primary" onClick={handleSubmit}>
                Update Project
            </Button>
        </StyledForm>
    );
};

export default ProjectForm;