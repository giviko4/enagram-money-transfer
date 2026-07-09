namespace MoneyTransferApi.Models;

public class Account {
    public Guid Id { get; set; } = Guid.NewGuid();
    public string AccountNumber { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}

public class Transaction {
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SenderAccountId { get; set; }
    public Guid ReceiverAccountId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Timestamp { get; set; }
}

public class TransferRequest {
    public Guid SenderAccountId { get; set; }
    public Guid ReceiverAccountId { get; set; }
    public decimal Amount { get; set; }
}
