import moment from 'moment';
import { MdArrowForward, MdEdit, MdDelete, MdCorporateFare, MdOutlineRealEstateAgent } from 'react-icons/md';
import { FaGavel } from 'react-icons/fa';
import { PiPlantFill } from "react-icons/pi";
import { GrUserWorker } from "react-icons/gr";
import { GiFamilyHouse } from "react-icons/gi";
import { AiOutlinePropertySafety } from "react-icons/ai";
import { TbTax } from "react-icons/tb";
import { RiCriminalFill } from 'react-icons/ri';
import { SiCyberdefenders } from 'react-icons/si';
import { images } from '../../../assets/assets';

const categoryIcons = {
    'Family Law': <GiFamilyHouse />,
    'Corporate Law': <MdCorporateFare />,
    'Criminal Law': <RiCriminalFill />,
    'Tax Law': <TbTax />,
    'Cyber Law': <SiCyberdefenders />,
    'Real Estate Law': <MdOutlineRealEstateAgent />,
    'Environmental Law': <PiPlantFill />,
    'Labour Law': <GrUserWorker />,
    'Civil Law': <AiOutlinePropertySafety />
};


const QuestionCard = ({ question, onAnswer, onUpdate, onDelete }) => (
    <div className={`bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col justify-between gap-4 group transition-all duration-300 ${question.myAnswer ? 'hover:bg-black/40' : 'hover:bg-black/40 hover:border-[var(--primary-color)]/50 transform hover:-translate-y-1'}`}>
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-10 bg-[var(--primary-color)]/10 rounded-lg text-[var(--primary-color)]">
                    {categoryIcons[question.category] || <FaGavel />}
                </span>
                <span className="text-sm font-semibold bg-white/5 px-3 py-1 rounded-md text-[var(--accent-color)] border border-white/10">{question.category}</span>
            </div>
            <h2 className="text-lg font-bold text-[var(--accent-color)] line-clamp-2">{question.title}</h2>
            <p className="text-gray-400 mt-1 line-clamp-3 text-sm">{question.description}</p>
        </div>
        <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                    <img alt={question.username} className="size-8 rounded-full object-cover" src={question.userProfile || images.defaultProfile} />
                    <div className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">{question.username}</span>
                        <p>{moment(question.createdAt).fromNow()}</p>
                    </div>
                </div>
            </div>
            {question.myAnswer ? (
                <div className="flex items-center gap-3 mt-4">
                    <button onClick={() => onUpdate(question)} className="w-full flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect cursor-pointer">
                        <MdEdit /> <span>Update</span>
                    </button>
                    <button onClick={() => onDelete(question)} className="w-full flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-red-900/40 border border-red-500/50 text-red-300 hover:bg-red-900/60 transition-all duration-300 text-base font-bold cursor-pointer">
                        <MdDelete /> <span>Delete</span>
                    </button>
                </div>
            ) : (
                <button onClick={() => onAnswer(question)} className="w-full flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect cursor-pointer">
                    <span>Answer Question</span> <MdArrowForward />
                </button>
            )}
        </div>
    </div>
);

export default QuestionCard;