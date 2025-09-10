import React, { useState } from 'react';
import AppointmentCard from './AppointmentCard';

const initialAppointments = [
  {
    id: 1,
    clientName: 'Samantha Ray',
    service: 'Corporate Law Consultation',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256',
    date: 'Sep 12, 2025',
    time: '10:00 AM - 10:30 AM',
    status: 'pending'
  },
  {
    id: 2,
    clientName: 'Michael Chen',
    service: 'Intellectual Property Advice',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256',
    date: 'Sep 15, 2025',
    time: '02:00 PM - 02:30 PM',
    status: 'pending'
  },
  {
    id: 3,
    clientName: 'Jessica Williams',
    service: 'Family Law Matter',
    avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256',
    date: 'Sep 9, 2025',
    time: '11:00 AM - 11:30 AM',
    status: 'completed'
  },
  {
    id: 4,
    clientName: 'David Rodriguez',
    service: 'Real Estate Dispute',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256',
    date: 'Sep 8, 2025',
    time: '09:00 AM - 09:30 AM',
    status: 'completed'
  },
];


const Appointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    console.log(`Appointment ${id} updated to ${newStatus}`);
  };

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
          {appointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Appointments;