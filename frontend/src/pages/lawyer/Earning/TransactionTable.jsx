import moment from "moment-timezone";

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).tz('Asia/Kolkata').format('MMMM Do, YYYY');
};

const StatusPill = ({ status }) => {
  const statusStyles = {
    success: 'bg-green-900 text-green-300',
    pending: 'bg-yellow-900 text-yellow-300',
    failed: 'bg-red-900 text-red-300',
  };
  const style = statusStyles[status.toLowerCase()] || 'bg-gray-700 text-gray-300';
  return (
    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium ${style} capitalize`}>
      {status}
    </span>
  );
};

const TransactionTable = ({ transactions, pagination, setCurPage }) => {
    return (
        <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
            <div className="w-full">
                <table className="w-full text-left">
                    <thead className="hidden md:table-header-group">
                        <tr className="bg-black/30">
                            <th className="p-4 text-gray-400 text-sm font-bold tracking-wider">Date</th>
                            <th className="p-4 text-gray-400 text-sm font-bold tracking-wider">Type</th>
                            <th className="p-4 text-gray-400 text-sm font-bold tracking-wider">Client</th>
                            <th className="p-4 text-gray-400 text-sm font-bold tracking-wider text-right">Amount</th>
                            <th className="p-4 text-gray-400 text-sm font-bold tracking-wider text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 md:divide-y-0">
                        {transactions && transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="block p-4 border-b border-white/10 md:table-row md:border-none hover:bg-black/30 transition-colors">
                                    <td className="flex justify-between items-center py-1 md:table-cell md:p-4 text-[var(--accent-color)]" data-label="Date">
                                        <span className="md:hidden text-gray-400 font-bold text-sm">Date</span>
                                        <span>{formatDate(tx.date)}</span>
                                    </td>
                                    <td className="flex justify-between items-center py-1 md:table-cell md:p-4 text-gray-300" data-label="Type">
                                        <span className="md:hidden text-gray-400 font-bold text-sm">Type</span>
                                        <span className="capitalize">{tx.type}</span>
                                    </td>
                                    <td className="flex justify-between items-center py-1 md:table-cell md:p-4 text-gray-300" data-label="Client">
                                        <span className="md:hidden text-gray-400 font-bold text-sm">Client</span>
                                        <span>{tx.client}</span>
                                    </td>
                                    <td className={`flex justify-between items-center py-1 md:table-cell md:p-4 md:text-right font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`} data-label="Amount">
                                        <span className="md:hidden text-gray-400 font-bold text-sm">Amount</span>
                                        <span>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                        </span>
                                    </td>
                                    <td className="flex justify-between items-center py-1 md:table-cell md:p-4 md:text-center" data-label="Status">
                                        <span className="md:hidden text-gray-400 font-bold text-sm">Status</span>
                                        <StatusPill status={tx.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-8 text-gray-400">
                                    You have no transaction history yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {pagination && pagination.totalPages > 1 && (
                <div className="p-4 flex flex-wrap justify-between items-center gap-4 bg-black/30">
                    <button 
                        onClick={() => setCurPage(pagination.prevPage)} 
                        disabled={!pagination.hasPrevPage}
                        className="text-gray-400 hover:text-[var(--accent-color)] text-sm font-medium disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer">
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button 
                                key={page}
                                onClick={() => setCurPage(page)}
                                className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${pagination.currentPage === page ? 'bg-[var(--primary-color)] text-[var(--secondary-color)]' : 'text-gray-400 hover:bg-black/50 hover:text-[var(--accent-color)]'} cursor-pointer`}>
                                {page}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setCurPage(pagination.nextPage)}
                        disabled={!pagination.hasNextPage}
                        className="text-gray-400 hover:text-[var(--accent-color)] text-sm font-medium disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionTable;