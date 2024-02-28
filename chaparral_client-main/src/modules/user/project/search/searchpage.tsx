import config from "@/config";
import BreadCrumbs from "../breadCrumbs";
import { SearchParams } from "./SearchParams";
import { SageParams } from "./types";
import { useToast } from "@/common/components/ui/use-toast";
const SearchPage = () => {
    const token = localStorage.getItem('token');
    const { toast } = useToast();
    const handleSubmit = (params: SageParams) => {
        fetch(config.backend_url + 'search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(params),
        })
            .then((res: Response) => {
                if (!res.ok) return res.json();
                return res.text();
            })
            .then((msg: any) => {
                if (msg == "true")
                    toast({
                        description: "Searching...",
                        variant: 'success'
                    });
                else {
                    toast({
                        description: msg.detail,
                        variant: 'error'
                    });
                }
            });
    };
    return (
        <div className="p-5 h-full">
            <BreadCrumbs />
            <SearchParams onSubmit={handleSubmit} />
        </div>
    );
};

export default SearchPage;