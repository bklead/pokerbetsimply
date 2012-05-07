using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Backend.DataContext;
using Backend.Facade.Interfaces;

namespace Backend.Facade.Implementations
{
    public class PokerBetFacade : IPokerBetFacade
    {
        private PokerBetContext context;

        public PokerBetFacade(PokerBetContext context)
        {
            this.context = context;
        }
    }
}
