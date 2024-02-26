import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { useToast } from '@/common/components/ui/use-toast';
import config from '@/config';
import React, { useEffect, useState } from 'react'
const OrganizationSetting = () => {
    const [orgName, setOrgName] = useState('');
    const token = localStorage.getItem('token');
    const { toast } = useToast();
    if (!token) {
        // Handle case where token is not available
        return;
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        fetch(config.backend_url + 'organization/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: orgName,
        })
            .then((res: Response) => res.json())
            .then((msg: any) => {
                if (msg.status == 500) toast({ variant: 'error', description: msg.detail });
                else toast({ variant: 'success', description: 'Successfully changed name' });
            });
    };
    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 justify-center h-full items-center'>
            <p className='text-[30px]'>Set your organization name</p>
            <Input
                name="orgname"
                placeholder="Your Organization Name"
                required
                autoFocus
                data-cy="orgname"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                style={{ width: '225px' }}
            />
            <Button type='submit'>Change</Button>
        </form>
    )
}

export default OrganizationSetting