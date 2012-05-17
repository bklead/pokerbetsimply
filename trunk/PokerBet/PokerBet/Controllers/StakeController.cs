using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Domain;
using Newtonsoft.Json.Linq;

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
