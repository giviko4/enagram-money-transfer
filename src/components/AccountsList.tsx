import { Account } from "../types";

interface AccountsListProps {
  accounts: Account[];
  loading: boolean;
}

export default function AccountsList({ accounts, loading }: AccountsListProps) {
  if (loading) {
    return <div className="animate-pulse flex space-x-4 p-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>;
  }

  return (
    <>
      <div className="p-4 border-b border-black bg-gray-50 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest">Active Accounts</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {accounts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">No accounts found.</div>
        ) : (
          accounts.map((account, index) => (
            <div key={account.id} className={`p-4 border border-gray-200 bg-white ${index > 2 ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-400">ACC NO: {account.accountNumber}</span>
              </div>
              <div className="text-sm font-bold uppercase">{account.ownerName}</div>
              <div className="text-2xl font-mono mt-1">
                ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
