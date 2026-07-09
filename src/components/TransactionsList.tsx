import { Transaction, Account } from "../types";

interface TransactionsListProps {
  transactions: Transaction[];
  accounts: Account[];
  loading: boolean;
}

export default function TransactionsList({ transactions, accounts, loading }: TransactionsListProps) {
  if (loading) {
    return <div className="animate-pulse p-4"><div className="h-4 bg-gray-200 w-1/2 mb-4"></div><div className="h-4 bg-gray-200 w-full"></div></div>;
  }

  // We are keeping real functionality but displaying it in the styled table format
  return (
    <>
      <div className="p-4 border-b border-black bg-gray-50 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest">Recent Transactions</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-0 bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="text-[10px] font-bold uppercase bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 border-b border-black">PARTIES</th>
              <th className="p-3 border-b border-black">AMOUNT</th>
              <th className="p-3 border-b border-black">STATUS</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">No transactions yet.</td>
              </tr>
            ) : (
              transactions.map((tx, idx) => {
                const sender = accounts.find(a => a.id === tx.senderAccountId)?.ownerName || "Unknown";
                const receiver = accounts.find(a => a.id === tx.receiverAccountId)?.ownerName || "Unknown";
                
                return (
                <tr key={tx.id} className={`border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                  <td className="p-3 w-1/2">
                    <div className="flex items-center w-full">
                      <span className="font-bold flex-1 text-right">{sender}</span>
                      <span className="text-gray-400 shrink-0 px-3">➔</span>
                      <span className="font-bold flex-1 text-left">{receiver}</span>
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5 text-center">TX ID: #{tx.id.substring(0, 8)}</div>
                  </td>
                  <td className="p-3">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-green-600">COMMIT</td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
