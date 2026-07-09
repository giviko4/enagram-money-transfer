import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// In-Memory Data Store (Mocking the SQL Server for the Live Preview)
const ACCOUNTS = [
  { id: "11111111-1111-1111-1111-111111111111", accountNumber: "CHK-001", ownerName: "Alice Smith", balance: 5000.00 },
  { id: "22222222-2222-2222-2222-222222222222", accountNumber: "SAV-002", ownerName: "Bob Johnson", balance: 1500.00 },
  { id: "33333333-3333-3333-3333-333333333333", accountNumber: "CHK-003", ownerName: "Charlie Davis", balance: 300.00 }
];
let TRANSACTIONS: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes (Mocking the .NET Backend for the Live Preview)
  app.get("/api/accounts", (req, res) => {
    res.json(ACCOUNTS);
  });

  app.get("/api/transactions", (req, res) => {
    // Return latest 50
    const sorted = [...TRANSACTIONS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(sorted.slice(0, 50));
  });

  app.post("/api/transfers", (req, res) => {
    const { senderAccountId, receiverAccountId, amount } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ error: "Amount must be greater than zero." });
    if (senderAccountId === receiverAccountId) return res.status(400).json({ error: "Cannot transfer to the same account." });

    const sender = ACCOUNTS.find(a => a.id === senderAccountId);
    const receiver = ACCOUNTS.find(a => a.id === receiverAccountId);

    if (!sender || !receiver) return res.status(400).json({ error: "Invalid sender or receiver account." });
    if (sender.balance < amount) return res.status(400).json({ error: "Insufficient funds." });

    // Transaction logic
    sender.balance -= amount;
    receiver.balance += amount;

    const tx = {
      id: crypto.randomUUID(),
      senderAccountId,
      receiverAccountId,
      amount,
      timestamp: new Date().toISOString()
    };
    
    TRANSACTIONS.push(tx);

    res.json({ message: "Transfer successful." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
