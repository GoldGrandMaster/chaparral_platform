import React, { useEffect, useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import config from '@/config';

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
    const navigate = useNavigate();

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

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: JSON.parse(localStorage.getItem('currentProject') || "")[1],
                name: formData.name,
                description: formData.description
            })
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
            <Button className="bg-primary-foreground border-[1px] border-solid border-tertiary text-primary" onClick={handleSubmit}>
                Update Project
            </Button>
        </StyledForm>
    );
};

export default ProjectForm;