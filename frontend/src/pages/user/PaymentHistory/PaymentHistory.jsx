import { dummyPayment } from "../../../assets/assets";
import { FaDownload } from "react-icons/fa";

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
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const PaymentHistory = () => {
  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col items-center max-w-6xl flex-1 gap-10 animate-fadeIn">
        <div className="w-full flex items-center gap-4">
          <h1 className="text-[var(--accent-color)] text-3xl sm:text-4xl font-bold">Payment History</h1>
        </div>

        {/* This div contains the table for medium and larger screens */}
        <div className="w-full bg-black/20 border border-white/10 rounded-2xl overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/30 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Lawyer/Product</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {dummyPayment.map((payment) => (
                  <tr key={payment._id} className="hover:bg-black/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img 
                          alt="Lawyer Avatar" 
                          className="w-10 h-10 rounded-full object-cover" 
                          src={payment.lawyerId.profileImage}
                        />
                        <div>
                          <p className="font-semibold text-[var(--accent-color)]">{payment.lawyerId.name}</p>
                          <p className="text-sm text-gray-400">{payment.lawyerId.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatDate(payment.createdAt)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-gray-300 ${payment.status === 'refunded' ? 'line-through' : ''}`}>
                      ₹{payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusClasses(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="flex items-center justify-center h-8 w-8 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 hover:text-[var(--accent-color)] transition-colors">
                        <FaDownload className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <p className="text-sm text-gray-400">Showing {dummyPayment.length} results</p>
            <div className="flex items-center gap-2">
              <button className="py-2 px-4 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
              <button className="py-2 px-4 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 transition-colors text-sm font-medium">Next</button>
            </div>
          </div>
        </div>

        {/* This div contains the card-based layout for small screens */}
        <div className="w-full bg-black/20 border border-white/10 rounded-2xl md:hidden">
          <div className="p-4">
            {dummyPayment.map((payment) => (
              <div key={payment._id} className="mb-4 p-4 border border-white/10 rounded-lg last:mb-0 bg-black/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      alt="Lawyer Avatar" 
                      className="w-10 h-10 rounded-full object-cover" 
                      src={payment.lawyerId.profileImage}
                    />
                    <div>
                      <p className="font-semibold text-[var(--accent-color)]">{payment.lawyerId.name}</p>
                      <p className="text-sm text-gray-400">{payment.lawyerId.specialization}</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center h-8 w-8 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 hover:text-[var(--accent-color)] transition-colors">
                    <FaDownload className="text-sm" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Date</p>
                    <p className="text-gray-300">{formatDate(payment.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Amount</p>
                    <p className={`text-gray-300 ${payment.status === 'refunded' ? 'line-through' : ''}`}>
                      ₹{payment.amount}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Status</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusClasses(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <p className="text-sm text-gray-400">Showing {dummyPayment.length} results</p>
            <div className="flex items-center gap-2">
              <button className="py-2 px-4 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
              <button className="py-2 px-4 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 transition-colors text-sm font-medium">Next</button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default PaymentHistory;