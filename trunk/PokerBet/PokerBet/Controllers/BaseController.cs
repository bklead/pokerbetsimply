using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Backend;

namespace PokerBet.Controllers
{
    public class BaseController : Controller
    {
        protected UnitOfWork Unit { get; private set; }

        public BaseController()
        {
            Unit = new UnitOfWork();
        }
    }
}
