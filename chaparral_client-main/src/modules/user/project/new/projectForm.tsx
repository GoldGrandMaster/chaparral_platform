import React, { useState } from 'react';
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
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
            <Button onClick={handleSubmit}>
                Save Project
            </Button>
        </StyledForm>
    );
};

export default ProjectForm;