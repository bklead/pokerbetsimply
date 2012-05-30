using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Domain.Models
{
    public class SingleStakeModel
    {
        public int Id { get; set; }
        public DateTime StakeDate { get; set; }
        public double Amount { get; set; }
        public double PossibleWin { get; set; }
        public double RealWin { get; set; }
        public DateTime? PaymentDate { get; set; }
        public double PaymentAmount { get; set; }
    }
}
