using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Newtonsoft.Json.Linq;
using Domain;

namespace PokerBet.Controllers
{
    public class HomeController : BaseController
    {
        private Dictionary<short, string> TableNumber;
        public HomeController()
        {
            TableNumber = new Dictionary<short, string>()
            {
                {4, "one"},
                {6, "two"},
                {8, "three"}
            };
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Stakes()
        {
            return Json("{ '35': 850, '25': 20, '32': 1500, '11': 1672, '21': 900, '36': 100, '12': 300, '34': 110, '37': 100, '30': 1840, '24': 1060, '13': 2466, '10': 942, '23': 190, '31': 350 }", JsonRequestBehavior.AllowGet);
        }

        public ActionResult Phistory()
        {
            return Json("[['168371','&nbsp;11,22,34,36'],['168372','&nbsp;13,23,34'],['168373','&nbsp;13,22,25,36'],['168374','&nbsp;10,22,37'],['168375','&nbsp;12,21,22,34'],['168376','&nbsp;11,12,24,33'],['168377','&nbsp;10,21,34'],['168378','&nbsp;12,22,31']]", JsonRequestBehavior.AllowGet);
        }
         

        public ActionResult Main(bool isStatic,int? id)
        {
            short state;
            Game[] table;
            GameState currentGameState = new GameState();
            if (isStatic)
            {
                if (id == null) id = 0;
                table = Unit.PokerBetSrvc.GetTableById(id.Value);
                state = 3;
               // currentGameState = Unit.PokerBetSrvc.GetCurrentState();
            }
            else
            {
                table = Unit.PokerBetSrvc.GetTable(out state);
                currentGameState = Unit.PokerBetSrvc.GetCurrentState();
            }


            JObject mainJson = 
            new JObject(
                CreateGameJSON(table[2], state),
                new JProperty("timestamp", currentGameState==null ? 0 : currentGameState.StartTime.Second),
                CreateGameJSON(table[0], state),
                CreateGameJSON(table[1], state),
                new JProperty("ts", DateTime.Now.Second)
            );

            return Content(mainJson.ToString(Newtonsoft.Json.Formatting.None));
        }

        private JProperty CreateGameJSON(Game game, int state)
        {
            var coefficients = game.CoefficientsStep1.Split(',');
            var table = TableNumber[game.NumberOfPlayers];

            var players = new JObject();

            if (state != 3)
            {
                for (int i = 0; i < game.NumberOfPlayers; i++)
                {
                    players.Add(CreatePlayerJSON(table, i, coefficients[i], (short)game.GetType().GetProperty("Player" + (i + 1).ToString() + "Card1").GetValue(game, null),
                        (short)game.GetType().GetProperty("Player" + (i + 1).ToString() + "Card2").GetValue(game, null), "0.000"));
                }
            }
            else
            {
                var winners = game.Winner1.Split(',');
                for (int i = 0; i < game.NumberOfPlayers; i++)
                {
                    players.Add(CreatePlayerJSON(table, i, (winners.Contains((i + 1).ToString())) ? "0.97" : "0", (short)game.GetType().GetProperty("Player" + (i + 1).ToString() + "Card1").GetValue(game, null),
                        (short)game.GetType().GetProperty("Player" + (i + 1).ToString() + "Card2").GetValue(game, null), (winners.Contains((i+1).ToString())) ? "1.000" : "0.000"));
                }
            }

            var gameJobject = new JObject(
                new JProperty("playersNo", game.NumberOfPlayers.ToString()),
                new JProperty("deskCards", GetDesk(game, state)),                
                new JProperty("players", players)
            );

            if (state == 3)
            gameJobject.Add(new JProperty("BH", game.Winning1_base.Name));

            var gamejson =
            new JProperty(table, gameJobject);


            return gamejson;
        }

        private JProperty CreatePlayerJSON(string table, int number, string K, short card1, short card2, string val)
        {
            var playerJson = 
            new JProperty(number.ToString(), new JObject(
                new JProperty("K", K),
                new JProperty("cards", GetCardById(card1) + " " + GetCardById(card2)),
                new JProperty("id", "#" + table + number),
                new JProperty("V", val)
            ));
                
            return playerJson;
        }

        private string GetDesk(Game game, int state)
        {
            var desk = String.Empty;

            switch (state)
            {
                case 3:
                    {
                        desk = " " + GetCardById(game.River1);
                        goto case 2;
                    }
                case 2:
                    {
                        desk = " " + GetCardById(game.Turn) + desk;
                        goto case 1;
                    }
                case 1:
                    {
                        desk = GetCardById(game.Flop1) + " " + GetCardById(game.Flop2) + " " + GetCardById(game.Flop3) + desk;
                        break;
                    }
                default:
                    break;
            }

            return desk;
        }

        private string GetCardById(short id)
        {
            return Unit.PokerBetSrvc.GetCardNameByID(id);
        }

        public ActionResult Round()
        {
            return Json("168072", JsonRequestBehavior.AllowGet);
        }
    }
}