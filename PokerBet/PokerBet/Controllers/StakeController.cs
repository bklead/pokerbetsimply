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


            var smallSum = Convert.ToInt32(sum) / players.Length;

            for (int i = 0; i < players.Length; i++)
            {
                var player = Convert.ToInt32(players[i]);
                switch (player)
                {
                    case 10: HomeController.stakes.Stake10 += smallSum; break;
                    case 11: HomeController.stakes.Stake11 += smallSum; break;
                    case 12: HomeController.stakes.Stake12 += smallSum; break;
                    case 13: HomeController.stakes.Stake13 += smallSum; break;
                    case 20: HomeController.stakes.Stake20 += smallSum; break;
                    case 21: HomeController.stakes.Stake21 += smallSum; break;
                    case 22: HomeController.stakes.Stake22 += smallSum; break;
                    case 23: HomeController.stakes.Stake23 += smallSum; break;
                    case 24: HomeController.stakes.Stake24 += smallSum; break;
                    case 25: HomeController.stakes.Stake25 += smallSum; break;
                    case 30: HomeController.stakes.Stake30 += smallSum; break;
                    case 31: HomeController.stakes.Stake31 += smallSum; break;
                    case 32: HomeController.stakes.Stake32 += smallSum; break;
                    case 33: HomeController.stakes.Stake33 += smallSum; break;
                    case 34: HomeController.stakes.Stake34 += smallSum; break;
                    case 35: HomeController.stakes.Stake35 += smallSum; break;
                    case 36: HomeController.stakes.Stake36 += smallSum; break;
                    case 37: HomeController.stakes.Stake37 += smallSum; break;
                }
            }

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

    }
}
