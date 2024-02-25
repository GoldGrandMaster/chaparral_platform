import BreadCrumbs from "../breadCrumbs";
import SearchPageForm from "./searchpageform";
const SearchPage = () => {
    return (
        <div className="p-5 h-full">
            <BreadCrumbs />
            <SearchPageForm />
        </div>
    );
};

export default SearchPage;