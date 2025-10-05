import React, { useEffect, useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { getLawyerAppointments } from '../../../services/lawyer.service';
import { useQuery } from '@tanstack/react-query';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import Pagination from '../../../components/Pagination/Pagination';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ["appointments", curPage],
    queryFn: () => getLawyerAppointments(curPage)
  });

  useEffect(() => {
      if (result) {
          setAppointments(result.data);
          setPagination(result.pagination);
      }
  }, [result]);

  const handlePageChange = (newPage) => {
      if (typeof newPage !== 'number') return; 

      if (newPage > 0 && newPage <= pagination.totalPages) {
          setCurPage(newPage);
      }
  };

  if (isLoading){
      return <Loader />;
  }

  if (isError){
      const errorCode = error.response?.data?.status || 500;
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      const errorTitle = createTitleFromStatus(errorCode);

      return (
      <Error 
          errorCode={errorCode}
          title={errorTitle}
          message={errorMessage} 
      />
      );
  }

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Booking Management</h1>
            <p className="text-gray-400 mt-2 text-lg">View and manage your client appointments.</p>
          </div>
        </div>
        <div className="flex flex-col gap-6"> 
          {appointments.map((app,index) => (
            <AppointmentCard key={index} appointment={app} />
          ))}
        </div>
        <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
      </div>
    </main>
  );
};

export default Appointments;