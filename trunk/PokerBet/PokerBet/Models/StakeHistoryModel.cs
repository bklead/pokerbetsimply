using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Domain.Models;

namespace PokerBet.Models
{
    public class StakeHistoryModel
    {
        public int StakeCount { get; set; }
        public int Sum { get; set; }
        public double PaymentSum { get; set; }
        public double WaitingPaymentSum { get; set; }
        public List<SingleStakeModel> Stakes {get; set;}
    }
}