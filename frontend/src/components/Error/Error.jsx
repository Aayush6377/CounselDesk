import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { BsEmojiFrown } from "react-icons/bs";

const Error = ({
  errorCode = 500,
  title = "Something Went Wrong",
  message = "We've encountered an unexpected issue. Please try again later or contact support if the problem persists.",
}) => {

  const navigate = useNavigate();

  const onGoBack = () => {
    navigate(-1);
  }

  return (
    <main className="bg-[var(--secondary-color)] h-screen px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center items-center py-8 pt-15 text-center">
      <div className="layout-content-container flex flex-col max-w-3xl flex-1 items-center gap-8 animate-fadeIn">
        <BsEmojiFrown className="w-64 h-64 object-contain text-[var(--primary-color)] glow-effect rounded-full" />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[var(--accent-color)] tracking-tight text-5xl md:text-6xl font-bold leading-tight">{title}</h1>
          <p className="text-gray-400 mt-2 text-lg max-w-lg">{message}</p>
          {errorCode && (
            <p className="text-[var(--primary-color)] font-bold text-xl mt-2">
              Error Code: {errorCode}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-50 max-w-sm mt-4">
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-all duration-300 transform hover:scale-105 glow-effect w-full"
          >
            <IoArrowBack />
            <span className="truncate">Go Back</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Error;