using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Backend.Facade.Interfaces;
using Backend.DataContext;
using Domain.Models;

namespace Backend.Facade.Implementations
{
    public class HistoryFacade : IHistoryFacade
    {
        private PokerBetContext context;

        public HistoryFacade(PokerBetContext context)
        {
            this.context = context;
        }

        public int GetStakesCount(DateTime from, DateTime to)
        {
            return context.GameBets.Where(p => p.StartDate >= from && p.StartDate <= to).GroupBy(p=>p.ContractNumber).Count();
        }

        public int GetSum(DateTime from, DateTime to)
        {
           return  context.GameBets.Where(p => p.StartDate >= from && p.StartDate <= to).Select(p=> new {ContractNumber = p.ContractNumber,Sum=p.Sum}).Distinct().ToList().Sum(p => p.Sum);
        }

        public double GetPaymentSum(DateTime from, DateTime to)
        {
            return context.GameBets.Where(p => p.StartDate >= from && p.StartDate <= to && p.IsWinningTicket == true && p.IsPayed == true).ToList().Sum(p => (p.Sum * p.Index) / context.GameBets.Count(m => m.ContractNumber == p.ContractNumber));
        }

        public double GetWaitingPaymentSum(DateTime from, DateTime to)
        {
            return context.GameBets.Where(p => p.StartDate >= from && p.StartDate <= to && p.IsWinningTicket == true && p.IsPayed == false).ToList().Sum(p => (Convert.ToDouble(p.Sum) / context.GameBets.Count(m => m.ContractNumber == p.ContractNumber)) * p.Index);
        }

        public List<SingleStakeModel> GetStakes(DateTime from, DateTime to)
        {
            var query = context.GameBets.Where(p => p.StartDate >= from && p.StartDate <= to).GroupBy(p => p.ContractNumber);
            List<SingleStakeModel> model = new List<SingleStakeModel>();
            foreach (var value in query)
            {
                double possibleSum = 0;
                double realSum = 0;
                var firstMember = value.First();

                var eachSum = firstMember.Sum / value.Count();
                foreach (var item in value)
                {
                    possibleSum += eachSum * item.Index;
                    if (item.IsWinningTicket == true) realSum += eachSum * item.Index;
                }


                SingleStakeModel singleModel = new SingleStakeModel
                {
                    StakeDate = firstMember.StartDate,
                    Amount = firstMember.Sum,
                    PossibleWin = possibleSum,
                    RealWin = realSum,
                    PaymentDate = firstMember.PaymentDate,
                    PaymentAmount = realSum
                };


                model.Add(singleModel);
            }

            return model;
        }
    }
}
