using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyTransferApi.Data;
using MoneyTransferApi.Models;

namespace MoneyTransferApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase {
    private readonly AppDbContext _context;
    public AccountsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAccounts() => Ok(await _context.Accounts.ToListAsync());
}

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase {
    private readonly AppDbContext _context;
    public TransactionsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetTransactions() => 
        Ok(await _context.Transactions.OrderByDescending(t => t.Timestamp).Take(50).ToListAsync());
}

[ApiController]
[Route("api/[controller]")]
public class TransfersController : ControllerBase {
    private readonly AppDbContext _context;
    public TransfersController(AppDbContext context) => _context = context;

    [HttpPost]
    public async Task<IActionResult> Transfer([FromBody] TransferRequest request) {
        if (request.Amount <= 0) 
            return BadRequest(new { error = "Amount must be greater than zero." });
        if (request.SenderAccountId == request.ReceiverAccountId) 
            return BadRequest(new { error = "Cannot transfer to the same account." });

        using var transaction = await _context.Database.BeginTransactionAsync();
        try {
            var sender = await _context.Accounts.FindAsync(request.SenderAccountId);
            var receiver = await _context.Accounts.FindAsync(request.ReceiverAccountId);

            if (sender == null || receiver == null) 
                return BadRequest(new { error = "Invalid sender or receiver account." });
            
            if (sender.Balance < request.Amount) 
                throw new InvalidOperationException("Insufficient funds.");

            sender.Balance -= request.Amount;
            receiver.Balance += request.Amount;

            var tx = new Transaction {
                SenderAccountId = sender.Id,
                ReceiverAccountId = receiver.Id,
                Amount = request.Amount,
                Timestamp = DateTime.UtcNow
            };

            _context.Transactions.Add(tx);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { message = "Transfer successful." });
        } catch (Exception ex) {
            await transaction.RollbackAsync();
            return BadRequest(new { error = ex.Message });
        }
    }
}
