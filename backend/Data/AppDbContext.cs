using Microsoft.EntityFrameworkCore;
using MoneyTransferApi.Models;

namespace MoneyTransferApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
}
