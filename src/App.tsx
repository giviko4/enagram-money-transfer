import { useState, useEffect, useCallback } from "react";
import AccountsList from "./components/AccountsList";
import TransactionsList from "./components/TransactionsList";
import TransferForm from "./components/TransferForm";
import { Account, Transaction } from "./types";

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [accRes, txRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/transactions")
      ]);
      
      if (accRes.ok) setAccounts(await accRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full h-screen bg-white flex flex-col font-sans text-black overflow-hidden select-none">
      {/* Top Navigation / Header */}
      <header className="h-16 border-b border-black flex items-center justify-center px-8 bg-white shrink-0">
        <h1 className="text-xl font-bold tracking-tighter">TRANSACTION SIMULATION</h1>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Accounts List */}
        <section className="w-[320px] border-r border-black flex flex-col shrink-0">
          <AccountsList accounts={accounts} loading={loading} />
        </section>

        {/* Center Column: Transfer Action */}
        <section className="flex-1 border-r border-black flex flex-col bg-gray-50 overflow-y-auto">
          <TransferForm accounts={accounts} onTransferComplete={fetchData} />
        </section>

        {/* Right Column: Transactions */}
        <section className="w-[320px] flex flex-col shrink-0">
          <TransactionsList transactions={transactions} accounts={accounts} loading={loading} />
        </section>
      </main>
    </div>
  );
}
