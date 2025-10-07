import { getPaymentHistory } from "../../../services/user.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import createTitleFromStatus from "../../../utils/createTitleFromStatus";
import Loader from "../../../components/Loader/Loader";
import Error from "../../../components/Error/Error";
import moment from "moment-timezone";

const getStatusClasses = (status) => {
  switch (status) {
    case 'success':
      return 'bg-green-500/20 text-green-400';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'failed':
      return 'bg-red-500/20 text-red-400';
    default:
      return '';
  }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).tz('Asia/Kolkata').format('MMMM Do, YYYY');
};

const PaymentHistory = () => {
  const [pagination, setPagination] = useState({});
  const [curPage, setCurPage] = useState(1);

  const { data: result, isLoading, isError, error } = useQuery({ 
    queryKey: ["PaymentHistory", curPage],
    queryFn: () => getPaymentHistory(curPage)
  });

  useEffect(() => {
    if (result){
      setPagination(result?.pagination);
    }
  }, [result]);

  if (isLoading){
      return <Loader />;
  }

  if (isError){
      const errorCode = error.response?.data?.status || 500;
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      const errorTitle = createTitleFromStatus(errorCode);

      return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />
  }

  const payments = result?.payments;

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col items-center max-w-6xl flex-1 gap-10 animate-fadeIn">
        <div className="w-full flex items-center gap-4">
          <h1 className="text-[var(--accent-color)] text-3xl sm:text-4xl font-bold">Payment History</h1>
        </div>
         {payments.length === 0 ? (
              <div className="w-full bg-black/20 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                  You have no payment history.
              </div>
          ) : (
            <>
                  {/* This div contains the table for medium and larger screens */}
              <div className="w-full bg-black/20 border border-white/10 rounded-2xl overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/30 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Lawyer</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {payments.map((payment, index) => (
                        <tr key={index} className="hover:bg-black/10 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <img 
                                alt="Lawyer Avatar" 
                                className="w-10 h-10 rounded-full object-cover" 
                                src={payment.lawyerId.userId.profileImage}
                              />
                              <div>
                                <p className="font-semibold text-[var(--accent-color)]">{payment.lawyerId.userId.name}</p>
                                <p className="text-sm text-gray-400">{payment.lawyerId.specialization}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatDate(payment.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize">{payment.type}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-gray-300 font-semibold ${payment.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusClasses(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls pagination={pagination} onPageChange={setCurPage} />
              </div>

              {/* This div contains the card-based layout for small screens */}
              <div className="w-full bg-black/20 border border-white/10 rounded-2xl md:hidden">
                <div className="p-4">
                  {payments.map((payment,index) => (
                    <div key={index} className="mb-4 p-4 border border-white/10 rounded-lg last:mb-0 bg-black/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            alt="Lawyer Avatar" 
                            className="w-10 h-10 rounded-full object-cover" 
                            src={payment.lawyerId.userId.profileImage}
                          />
                          <div>
                            <p className="font-semibold text-[var(--accent-color)]">{payment.lawyerId.userId.name}</p>
                            <p className="text-sm text-gray-400">{payment.lawyerId.specialization}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                          <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Date</p>
                              <p className="text-gray-300">{formatDate(payment.createdAt)}</p>
                          </div>
                          <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Type</p>
                              <p className="text-gray-300 capitalize">{payment.type}</p>
                          </div>
                          <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Amount</p>
                              <p className={`text-gray-300 font-semibold ${payment.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                          </div>
                          <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Status</p>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusClasses(payment.status)}`}>
                                  {payment.status}
                              </span>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>

                <PaginationControls pagination={pagination} onPageChange={setCurPage} />
              </div>
            </>
         )}
      </div>
    </main>
  );
};

const PaginationControls = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between p-4 border-t border-white/10">
            <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="py-2 px-4 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${pagination.currentPage === page ? 'bg-[var(--primary-color)] text-[var(--secondary-color)]' : 'text-gray-400 hover:bg-black/50'}`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="py-2 px-4 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

export default PaymentHistory;