import { useState } from "react";
import { Account } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TransferFormProps {
  accounts: Account[];
  onTransferComplete: () => void;
}

export default function TransferForm({ accounts, onTransferComplete }: TransferFormProps) {
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setShowSuccess(false);

    const showErrorToast = (msg: string) => {
      setErrorMsg(msg);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    };

    if (!senderId || !receiverId || !amount) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    if (senderId === receiverId) {
      showErrorToast("Cannot transfer to the same account.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showErrorToast("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderAccountId: senderId,
          receiverAccountId: receiverId,
          amount: numAmount
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transfer failed.");
      
      setShowSuccess(true);
      setAmount("");
      setSenderId("");
      setReceiverId("");
      onTransferComplete();
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-sm bg-white border border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-6 text-center underline decoration-2 underline-offset-4">INITIATE TRANSFER</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase mb-2">Sender Account</label>
            <div className="w-full border border-black relative">
              <select 
                value={senderId} 
                onChange={(e) => setSenderId(e.target.value)}
                className="w-full p-3 bg-transparent text-black outline-none appearance-none font-bold text-sm z-10 relative cursor-pointer uppercase"
                disabled={loading}
              >
                <option value="">Select Sender...</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.ownerName}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex justify-center my-4 relative z-10">
            <div className="bg-white flex items-center justify-center px-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase mb-2">Recipient Account</label>
            <div className="w-full border border-black relative">
              <select 
                value={receiverId} 
                onChange={(e) => setReceiverId(e.target.value)}
                className="w-full p-3 bg-transparent text-black outline-none appearance-none font-bold text-sm z-10 relative cursor-pointer uppercase"
                disabled={loading}
              >
                <option value="">Select Recipient...</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.ownerName}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase mb-2">Amount (USD)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 border border-black font-mono text-xl focus:outline-none focus:ring-1 focus:ring-black"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 font-bold text-sm tracking-widest hover:bg-gray-900 cursor-pointer transition-colors uppercase disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "PROCESSING..." : "Execute Transaction"}
          </button>
        </form>
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
        <AnimatePresence>
          {showError && errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-4 bg-red-50 border border-red-600 shadow-[4px_4px_0px_rgba(220,38,38,1)] text-red-600 text-xs uppercase font-bold min-w-[300px] pointer-events-auto flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              ERROR: {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-4 bg-green-50 border border-green-600 shadow-[4px_4px_0px_rgba(22,163,74,1)] text-green-600 text-xs uppercase font-bold min-w-[300px] pointer-events-auto flex items-center gap-3"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              TRANSACTION COMMITTED SUCCESSFULLY
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
