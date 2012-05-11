using System.Web.Mvc;
using Backend;
using Newtonsoft.Json.Linq;

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
