import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMeetingLink } from '../../services/jitsi.service';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';
import createTitleFromStatus from '../../utils/createTitleFromStatus';

const MeetingPage = () => {
    const { appointmentId } = useParams();

    const { data: result, isLoading, isError, error } = useQuery({
        queryKey: ['meetingLink', appointmentId],
        queryFn: () => getMeetingLink(appointmentId),
        retry: false,
    });

    const meetingLink = result?.meetingLink;

    useEffect(() => {
        if (meetingLink) {
            window.location.href = meetingLink;
        }
    }, [meetingLink]);

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        const errorCode = error.response?.data?.status || 500;
        const errorMessage = error.response?.data?.message || "You are not authorized to join this meeting.";
        const errorTitle = createTitleFromStatus(errorCode);
        return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[var(--secondary-color)] text-white">
            <p className="text-lg">Redirecting to your meeting...</p>
        </div>
    );
};

export default MeetingPage;