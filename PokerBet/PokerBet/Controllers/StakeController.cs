using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Domain;
using Newtonsoft.Json.Linq;
using PokerBet.Models;

namespace PokerBet.Controllers
{
    public class StakeController : BaseController
    {
        //
        // GET: /Stake/

        private Dictionary<short, string> TableNumber;
        public StakeController()
        {
            TableNumber = new Dictionary<short, string>()
            {
                {4, "1"},
                {6, "2"},
                {8, "3"}
            };
        }

        [Authorize(Roles = "Cashier, Admin")]
        public ActionResult Index()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("MM/dd/yyyy");
            return View();
        }
        
        public ActionResult CurrentRids()
        {
            short state;
            Game[] table;
            GameState currentGameState = new GameState();

             table = Unit.PokerBetSrvc.GetTable(out state);
             currentGameState = Unit.PokerBetSrvc.GetCurrentState();
             var ridJson = CreateRidJson(table, state);

             string json = "[";

             foreach (var rid in ridJson)
             {
                 json += rid.ToString()+",";
             }

             json += "]";

             return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetHistory(DateTime? fromDate = null, DateTime? toDate = null)
        {
            if (fromDate == null) fromDate = DateTime.Now.Date;
            if (toDate == null) toDate = DateTime.Now.Date;

            toDate = toDate.Value.AddDays(1);

            StakeHistoryModel model = new StakeHistoryModel
                {
                    StakeCount = Unit.HistorySrvc.GetStakesCount(fromDate.Value, toDate.Value),
                    Sum = Unit.HistorySrvc.GetSum(fromDate.Value, toDate.Value),
                    PaymentSum = Unit.HistorySrvc.GetPaymentSum(fromDate.Value, toDate.Value),
                    WaitingPaymentSum = Unit.HistorySrvc.GetWaitingPaymentSum(fromDate.Value, toDate.Value),
                    Stakes = Unit.HistorySrvc.GetStakes(fromDate.Value,toDate.Value)
                };

            return PartialView("_History", model);
        }

        public int Create(string playerList, string oddList, string sum)
        {
            string[] odds = oddList.TrimEnd(',').Split(',');
            string[] players = playerList.TrimEnd(',').Split(',');

            int? id = Unit.PokerBetSrvc.CreateStake(players, odds, sum);

            if (id != null)
            {
                //return RedirectToAction("Index", "Check", new { id= id.Value });
                // return Redirect("/Check/Index/" + id.Value.ToString());
                return id.Value;
            }

            return -1;
        }

        private List<JObject> CreateRidJson(Game[] games, int state)
        {

            List<JObject> rids = new List<JObject>();

            foreach(Game game in games)
            {
                string[] coefficients = new string[game.NumberOfPlayers];
                switch (state)
                {
                    case 0:
                        {
                            coefficients = game.CoefficientsStep1.Split(','); break;
                        }
                    case 1:
                        {
                            coefficients = game.CoefficientsStep2.Split(','); break;
                        }
                    case 2:
                        {
                            coefficients = game.CoefficientsStep3.Split(','); break;
                        }
                    case 3:
                        {
                            var winners = game.Winner1.Split(',');
                            for (int i = 0; i < game.NumberOfPlayers; i++)
                            {
                                coefficients[i] = winners.Contains((i + 1).ToString()) ? "0.97" : "0";
                            }
                            break;
                        }

                }
            
            var table = TableNumber[game.NumberOfPlayers];

            for (int i = 0; i < game.NumberOfPlayers; i++)
                {
                    rids.Add(new JObject(
                        new JProperty("id","18291417"),
                        new JProperty("RID","117464212"),
                        new JProperty("ridName","Игрок " + table + i.ToString()),
                        new JProperty("odd0",coefficients[i]),
                        new JProperty("active","1")
                        ));
                }
            }

            return rids;
        }

        public ActionResult FindCheck(string number)
        {
            long numb;
            if (long.TryParse(number.Substring(3, 9), out numb))
            {
                var bets = Unit.PokerBetSrvc.GetCheckByNumber(numb);

                if (bets.Count(m => m.IsPayed) != 0)
                {
                    return Json(new { isWinning = false, message = "уже заплачено" }, JsonRequestBehavior.AllowGet); 
                }

                var sum = bets.Where(m => m.IsWinningTicket).Sum(m => m.Sum / bets.Count() * m.Index);

                if (sum == 0)
                {
                    return Json(new { isWinning = false, message = "выигрыша нет" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { isWinning = true, message = "чек выиграл <strong>" + sum + "</strong> рублей" }, JsonRequestBehavior.AllowGet);
                }
            }

            return Json("error", JsonRequestBehavior.AllowGet);
        }
        
        public ActionResult PayCheck(string number)
        {
            long numb;
            bool status = false;
            if (long.TryParse(number.Substring(3, 9),out numb))
            {
                status = Unit.PokerBetSrvc.PayCheckByNumber(numb);
            }

            return Json(new { status = status }, JsonRequestBehavior.AllowGet);
        }

    }
}
