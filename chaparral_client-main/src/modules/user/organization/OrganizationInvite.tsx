import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input'
import config from '@/config';
import { useState } from 'react'
import { useToast } from "@/common/components/ui/use-toast"

const OrganizationInvite = () => {
    const [userName, setUserName] = useState('');
    const token = localStorage.getItem('token');
    const { toast } = useToast();

    if (!token) {
        // Handle case where token is not available
        return;
    }
    const handleSubmit = (e: any) => {
        fetch(config.backend_url + 'organization/invite', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: userName,
        })
            .then((res: Response) => {
                if (!res.ok) return res.json();
            })
            .then((msg: any) => {
                if (msg) {
                    if (msg.detail) {
                        toast({
                            description: msg.detail,
                            variant: 'error'
                        });
                    } else {
                        toast({
                            description: "An error occurred while communicating with the server",
                            variant: 'error'
                        });
                    }
                } else {
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };
    return (
        <div className='flex flex-col gap-3 justify-center h-full items-center'>
            <p className='text-[30px]'>Invite other members to your organization</p>
            <Input
                name="username"
                placeholder="User name to invite"
                required
                autoFocus
                data-cy="username"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                style={{ width: '225px' }}
            />
            <Button type='submit' onClick={handleSubmit}>Invite</Button>
        </div>
    )
}

export default OrganizationInvite