import { useState, useEffect } from "react";
import { MdPersonSearch } from "react-icons/md";
import renderRating from "../../../utils/renderRating";
import { Link } from "react-router-dom";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import { getLawyersList } from "../../../services/user.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "../../../hooks/useStore";
import Loader from "../../../components/Loader/Loader";
import {images} from "../../../assets/assets";
import Pagination from "../../../components/Pagination/Pagination";

const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars & up' },
    { value: '3', label: '3 Stars & up' },
];

const specializationOptions = [
    { value: "", label: "All Specializations" },
    { value: "Family Law", label: "Family Law" },
    { value: "Corporate Law", label: "Corporate Law" },
    { value: "Criminal Law", label: "Criminal Law" },
    { value: "Tax Law", label: "Tax Law" },
    { value: "Cyber Law", label: "Cyber Law" },
    { value: "Real Estate Law", label: "Real Estate Law"},
    { value: "Environmental Law", label: "Environmental Law" },
    { value: "Labour Law", label: "Labour Law" },
    { value: "Civil Law", label: "Civil Law" }
];

const FindLawyers = () => {
    const queryClient = useQueryClient();
    const { userDetails } = useStore();
    const [lawyers, setLawyers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setfilters] = useState({
        search: "",
        specialization: "",
        rating: "0",
        page: 1
    });

    const { data: result, isPending } = useQuery({
        queryKey: ["lawyersList"],
        queryFn: () => getLawyersList(userDetails.address,filters.search, filters.specialization, filters.rating, filters.page),
    });

    useEffect(() => {
        if (result) {
            setLawyers(result.data);
            setPagination(result.pagination);
        }
    }, [result]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setfilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
        }, 500); 

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchTerm]);

    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ["lawyersList"]});
    }, [filters, queryClient]);
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setfilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (typeof newPage !== 'number') return; 
        
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setfilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        queryClient.invalidateQueries({queryKey: ["lawyersList"]});
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (isPending){
        return <Loader />;
    }

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-12 animate-fadeIn">
                {/* Page Header Section */}
                <div className="flex flex-wrap justify-between items-center gap-6">
                    <div>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Find Lawyers</h1>
                        <p className="text-gray-400 mt-2 text-lg">Search our network of verified legal professionals.</p>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <form onSubmit={handleSearch} className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-full md:flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MdPersonSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            name="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block h-12 w-full rounded-lg border-none bg-black/30 pl-12 pr-4 text-[var(--accent-color)] placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--primary-color)]"
                            placeholder="Search by name or keyword..."
                            type="text"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <CustomSelect name="specialization" options={specializationOptions} value={filters.specialization} onChange={handleChange} />
                        <CustomSelect name="rating" options={ratingOptions} value={filters.rating} onChange={handleChange}/>
                    </div>
                    <button type="submit" className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect w-full md:w-auto">
                        <span className="truncate">Search</span>
                    </button>
                </form>
                
                {/* Lawyer Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lawyers.length > 0 ? (
                        lawyers.map((lawyer, index) => (
                            <div key={index} className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col gap-4 hover:border-[var(--primary-color)]/50 hover:bg-black/30 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-center bg-no-repeat aspect-square bg-cover rounded-full" style={{ backgroundImage: `url("${lawyer.profileImage || images.defaultProfile}")` }}></div>
                                    <div className="flex-1">
                                        <h3 className="text-[var(--accent-color)] text-xl font-bold">{lawyer.name}</h3>
                                        <p className="text-gray-400 text-sm">{lawyer.specialization}</p>
                                        <div className="flex items-center mt-1">
                                            {renderRating(lawyer.rating)}
                                            <span className="text-gray-400 text-sm ml-2">{lawyer.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-3">{lawyer.bio}</p>
                                <div className="flex items-center gap-2 mt-auto pt-4">
                                    <Link to={`/user/lawyer-profile/${lawyer._id}`} className="flex-1 text-center py-2 px-4 rounded-lg bg-black/30 text-[var(--accent-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors text-sm font-semibold">
                                        View Profile
                                    </Link>
                                    <Link to={`/user/book-appointment/${lawyer._id}`} className="flex-1 text-center py-2 px-4 rounded-lg bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[#c0a97c] transition-colors text-sm font-bold">
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-400 text-lg">No lawyers found matching your criteria.</p>
                            </div>
                    )}
                </div>

                <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
            </div>
        </main>
    );
};

export default FindLawyers;