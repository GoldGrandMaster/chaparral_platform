import React, { useEffect, useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import config from '@/config';
import { useToast } from '@/common/components/ui/use-toast';

const Label = styled.label`
  font-weight: bold;
`;

const StyledForm = styled.form`
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
    const { toast } = useToast();

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
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
                id: JSON.parse(localStorage.getItem('currentProject') || "")['id'],
                name: formData.name,
                description: formData.description
            })
        };

        fetch(config.backend_url + 'projects', requestOptions)
            .then(response => response.text())
            .then(res => {
                toast({ variant: 'success', description: 'Successfully updated' })
            })
    };
    useEffect(() => {
        const curProj = JSON.parse(localStorage.getItem('currentProject') || "");
        setFormData({
            name: curProj.name,
            description: curProj.description
        });
    }, [])
    return (
        <StyledForm onSubmit={handleSubmit}>
            <Label>Name</Label>
            <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Label>Description</Label>
            <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
            />
            <Button type='submit'>
                Update Project
            </Button>
        </StyledForm>
    );
};

export default ProjectForm;