import React, { useState, useEffect, useMemo } from 'react';
import { MdSearch } from 'react-icons/md';
import { FaGavel } from 'react-icons/fa';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import SectionDetailModal from './SectionDetailModal';
import allLegalCodes from '../../../assets/indian_legal_codes.json';

const codeOptions = [
    { value: '', label: 'All Codes' },
    { value: 'Constitution', label: 'Constitution of India' },
    { value: 'IPC', label: 'Indian Penal Code (IPC)' },
    { value: 'CrPC', label: 'Code of Criminal Procedure (CrPC)' },
    { value: 'CPC', label: 'Code of Civil Procedure (CPC)' },
    { value: 'IEA', label: 'Indian Evidence Act (IEA)' },
    { value: 'NIA', label: 'Negotiable Instruments Act (NIA)' },
    { value: 'HMA', label: 'Hindu Marriage Act (HMA)' },
    { value: 'IDA', label: 'Indian Divorce Act (IDA)' },
    { value: 'MVA', label: 'The Motor Vehicles Act (MVA)' }
];

const LegalCodeExplorer = () => {
    const [filters, setFilters] = useState({ search: '', code: '' });
    const [liveSearchTerm, setLiveSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (liveSearchTerm !== filters.search) {
                setFilters(prev => ({ ...prev, search: liveSearchTerm }));
            }
        }, 300); 
        return () => clearTimeout(handler);
    }, [liveSearchTerm, filters.search]);

    const filteredSections = useMemo(() => {
        const searchTerm = filters.search.toLowerCase();
        
        return allLegalCodes.filter(section => {
            const matchesCode = !filters.code || section.code === filters.code;
            const matchesSearch = !searchTerm || 
                (section.title || '').toLowerCase().includes(searchTerm) || 
                (section.verbatimText || '').toLowerCase().includes(searchTerm) ||
                `${(section.code || '').toLowerCase()} ${section.sectionNumber}`.includes(searchTerm);

            return matchesCode && matchesSearch;
        });
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
                <div className="flex flex-col w-full max-w-4xl gap-8 animate-fadeIn">
                    <div>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Legal Code Explorer</h1>
                        <p className="text-gray-400 mt-2 text-lg">Search and reference key sections of Indian Law.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 py-4">
                        <div className="relative w-full flex-1">
                            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                value={liveSearchTerm}
                                onChange={(e) => setLiveSearchTerm(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                                placeholder="Search by keyword or section (e.g., IPC 302)..."
                                type="text"
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <CustomSelect name="code" value={filters.code} onChange={handleFilterChange} options={codeOptions} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredSections.length > 0 ? (
                            filteredSections.slice(0, 10).map(section => (
                                <div 
                                    key={`${section.code}-${section.sectionNumber}`} 
                                    onClick={() => setSelectedSection(section)}
                                    className="bg-black/20 border border-white/10 rounded-lg p-4 flex items-center gap-4 hover:bg-black/40 hover:border-[var(--primary-color)]/50 cursor-pointer transition-colors"
                                >
                                    <div className="flex-shrink-0 flex items-center justify-center size-10 bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-md">
                                        <FaGavel />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[var(--accent-color)]">{section.code} - Section {section.sectionNumber}</p>
                                        <p className="text-sm text-gray-400 truncate">{section.title}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-black/20 rounded-lg">
                                <p className="text-gray-400">No sections found. Try adjusting your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <SectionDetailModal
                isOpen={!!selectedSection}
                onClose={() => setSelectedSection(null)}
                section={selectedSection}
            />
        </>
    );
};

export default LegalCodeExplorer;

