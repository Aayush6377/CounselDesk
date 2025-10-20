import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdAutoAwesome } from "react-icons/md";
import { generateContent } from '../../../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SectionDetailModal = ({ isOpen, onClose, section }) => {
    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAiSummary('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGenerateSummary = async () => {
        setIsLoadingSummary(true);
        setAiSummary('');

        const cleanedText = section.verbatimText.replace(/\n\s*\n/g, '\n');
        const prompt = `You are a helpful legal assistant for a professional Indian lawyer. Summarize the following legal text in clear, plain English, highlighting its key implications and applications. Format key terms and concepts using markdown for bolding. Do not add any introductory or concluding phrases. Just provide the summary directly.\n\nText:\n${cleanedText}`;

        try {
            const generatedSummary = await generateContent(prompt);
            setAiSummary(generatedSummary);
        } catch (error) {
            console.error("Error generating AI summary:", error);
            setAiSummary("Failed to generate summary. Please try again.");
        } finally {
            setIsLoadingSummary(false);
        }
    };

    const formattedVerbatimText = section.verbatimText.replace(/\n\s*\n/g, '\n');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--secondary-color)] border border-white/10 rounded-xl max-w-3xl w-full mx-auto flex flex-col h-[90vh] animate-fadeIn" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-6 flex justify-between items-center border-b border-white/10">
                    <div>
                        <h2 className="text-[var(--accent-color)] text-2xl font-bold">{section.code} - Section {section.sectionNumber}</h2>
                        <p className="text-gray-400">{section.title}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <IoClose size={28} />
                    </button>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Official Text</h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{formattedVerbatimText}</p>
                    </div>
                    
                    <div className="border-t border-white/10 pt-6">
                         <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">AI-Powered Summary</h3>
                             <button 
                                onClick={handleGenerateSummary}
                                disabled={isLoadingSummary}
                                className="flex items-center gap-2 text-sm text-[var(--primary-color)] hover:text-[var(--accent-color)] font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <MdAutoAwesome />
                                <span>{isLoadingSummary ? 'Generating...' : 'Ask CounselDesk AI'}</span>
                            </button>
                        </div>
                        <div className="mt-4 p-4 bg-black/30 rounded-lg min-h-[100px]">
                            {isLoadingSummary && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <svg className="animate-spin h-5 w-5 text-[var(--primary-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Generating response with CounselDesk AI...</span>
                                </div>
                            )}
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap prose prose-invert prose-strong:text-[var(--accent-color)]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {aiSummary}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionDetailModal;