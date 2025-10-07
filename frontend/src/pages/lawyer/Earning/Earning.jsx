import TransactionTable from "./TransactionTable";
import { FaCalendarAlt, FaWallet } from "react-icons/fa";
import { getEarningsData } from "../../../services/lawyer.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader/Loader";
import createTitleFromStatus from "../../../utils/createTitleFromStatus";
import Error from "../../../components/Error/Error";
import { useEffect, useState } from "react";


const Earnings = () => {
  const [pagination, setPagination] = useState({});
  const [curPage, setCurPage] = useState(1);

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ["EarningData", curPage],
    queryFn: () => getEarningsData(curPage)
  });

  useEffect(() => {
    if (result){
      setPagination(result?.transactions?.pagination);
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

  const summary = result?.summary;
  const transactions = result?.transactions?.docs;

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-12 animate-fadeIn">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h1 className="text-[var(--accent-color)] tracking-tight text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Earnings</h1>
            <p className="text-gray-400 mt-2 text-base sm:text-lg">Track your earnings and transaction history.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <SummaryCard title="This Month's Earnings" icon={<FaCalendarAlt className="text-xl" />} amount={summary.thisMonth.amount} description={summary.thisMonth.description}/>
            <SummaryCard title="Total Lifetime Earnings" icon={<FaWallet className="text-xl" />} amount={summary.lifetime.amount} description={summary.lifetime.description} />
        </div>

        <div>
            <h2 className="text-[var(--accent-color)] text-2xl font-bold leading-tight tracking-tight mb-4">Transaction History</h2>
            <TransactionTable transactions={transactions} pagination={pagination} setCurPage={setCurPage}/>
        </div>
      </div>
    </main>
  );
};

const SummaryCard = ({ title, icon, amount, description }) => (
  <div className="bg-black/20 border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col gap-2 hover:border-[var(--primary-color)]/50 hover:bg-black/30 transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between text-gray-400">
      <p className="text-sm font-medium">{title}</p>
      {icon}
    </div>
    <p className="text-[var(--accent-color)] text-2xl sm:text-3xl font-bold">
      {amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
    </p>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

export default Earnings;