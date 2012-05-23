using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Domain.Models;

namespace Backend.Facade.Interfaces
{
    public interface IHistoryFacade
    {
        int GetStakesCount(DateTime from, DateTime to);
        int GetSum(DateTime from, DateTime to);
        double GetPaymentSum(DateTime from, DateTime to);
        double GetWaitingPaymentSum(DateTime from, DateTime to);
        List<SingleStakeModel> GetStakes(DateTime from, DateTime to);
    }
}
