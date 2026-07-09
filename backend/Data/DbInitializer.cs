using System;
using System.Linq;
using MoneyTransferApi.Models;

namespace MoneyTransferApi.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Check if there are any accounts in the database
        if (context.Accounts.Any())
        {
            return;   // DB has been seeded
        }

        var accounts = new Account[]
        {
            new Account { 
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), 
                AccountNumber = "CHK-001", 
                OwnerName = "Alice Smith", 
                Balance = 5000.00m 
            },
            new Account { 
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), 
                AccountNumber = "SAV-002", 
                OwnerName = "Bob Johnson", 
                Balance = 1500.00m 
            },
            new Account { 
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), 
                AccountNumber = "CHK-003", 
                OwnerName = "Charlie Davis", 
                Balance = 300.00m 
            }
        };

        context.Accounts.AddRange(accounts);
        context.SaveChanges();
    }
}
