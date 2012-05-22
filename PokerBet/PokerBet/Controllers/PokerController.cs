using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Newtonsoft.Json.Linq;
using Domain;
using PokerBet.Helpers;

namespace PokerBet.Controllers
{
    public class HomeController : BaseController
    {
        private Dictionary<short, string> TableNumber;
        private static bool hasRiverFinderStarted = false;
        private static int[] riverNumber = {1,1,1};
        private static short currentState;
        public static Stakes stakes = new Stakes();
        private static Random random = new Random();

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
            InitializeStakes();
            return Json("{ '35': " + stakes.Stake35 + ", '33': " + stakes.Stake33 + ", '25': " + stakes.Stake25 + ", '20': " + stakes.Stake20 + ", '22': " + stakes.Stake22 + ", '32': " + stakes.Stake32 + ", '11': " + stakes.Stake11 + ", '21': " + stakes.Stake21 + ", '36': " + stakes.Stake36 + ", '12': " + stakes.Stake12 + ", '34': " + stakes.Stake34 + ", '37': " + stakes.Stake37 + ", '30': " + stakes.Stake30 + ", '24': " + stakes.Stake24 + ", '13': " + stakes.Stake13 + ", '10': " + stakes.Stake10 + ", '23': " + stakes.Stake23 + ", '31': " + stakes.Stake31 + " }", JsonRequestBehavior.AllowGet);
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
                currentState = state;
                if (state == 0 && !hasRiverFinderStarted)
                {
                    Unit.PokerBetSrvc.ClearRiverFinder();
                    Unit.PokerBetSrvc.AddGameUniqueNumber();
                    stakes = new Stakes();
                    hasRiverFinderStarted = true;

                }
                if (state == 3 && hasRiverFinderStarted)
                {
                    hasRiverFinderStarted = false;
                    riverNumber = Unit.PokerBetSrvc.GetBestPrizeNumber(table);
                }
                currentGameState = Unit.PokerBetSrvc.GetCurrentState();
            }


            JObject mainJson = 
            new JObject(
                CreateGameJSON(table[2], state,2,isStatic),
                new JProperty("timestamp", currentGameState==null ? 0 : currentGameState.StartTime.Second),
                CreateGameJSON(table[0], state, 0, isStatic),
                CreateGameJSON(table[1], state, 1, isStatic),
                new JProperty("ts", (DateTime.Now - currentGameState.StartTime).TotalSeconds)
            );

            return Content(mainJson.ToString(Newtonsoft.Json.Formatting.None));
        }

        private string GetFinalInfo(int gameNumber, string info,Game game,int[] riverNumber)
        {
            switch (info)
            {
                case "winner":
                    {
                        switch (riverNumber[gameNumber])
                        {
                            case 1: return game.Winner1; 
                            case 2: return game.Winner2;
                            case 3: return game.Winner3;
                            case 4: return game.Winner4; 
                        }
                        break;
                    }
                case "winning":
                    {
                        switch (riverNumber[gameNumber])
                        {
                            case 1: return game.Winning1_base.Name;
                            case 2: return game.Winning2_base.Name;
                            case 3: return game.Winning3_base.Name;
                            case 4: return game.Winning4_base.Name;
                        }
                        break;
                    }
                case "river":
                    {
                        switch (riverNumber[gameNumber])
                        {
                            case 1: return game.River1.ToString();
                            case 2: return game.River2.ToString();
                            case 3: return game.River3.ToString();
                            case 4: return game.River4.ToString();
                        }
                        break;
                    }
            }
            return "";
        }

        private JProperty CreateGameJSON(Game game, int state,int gameNumber,bool isStatic)
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
                        var winners = GetFinalInfo(gameNumber,"winner",game,isStatic ? new int[] {1,1,1} : riverNumber).Split(',');
                        for (int i = 0; i < game.NumberOfPlayers; i++)
                        {
                            coefficients[i] = winners.Contains((i + 1).ToString()) ? "0.97" : "0";
                            if (winners.Contains((i + 1).ToString()))
                            {
                                Unit.PokerBetSrvc.GenerateWinTickets(i,gameNumber);
                            }
                        }
                        break;
                    }

            }
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
                var winners = GetFinalInfo(gameNumber, "winner", game, isStatic ? new int[] { 1, 1, 1 } : riverNumber).Split(',');
                for (int i = 0; i < game.NumberOfPlayers; i++)
                {
                    players.Add(CreatePlayerJSON(table, i, (winners.Contains((i + 1).ToString())) ? "0.97" : "0", (short)game.GetType().GetProperty("Player" + (i + 1).ToString() + "Card1").GetValue(game, null),
                        (short)game.GetType().GetProperty("Player" + (i + 1).ToString() + "Card2").GetValue(game, null), (winners.Contains((i+1).ToString())) ? "1.000" : "0.000"));
                }
            }

            var gameJobject = new JObject(
                new JProperty("playersNo", game.NumberOfPlayers.ToString()),
                new JProperty("deskCards", GetDesk(game, state,gameNumber,isStatic)),                
                new JProperty("players", players)
            );

            if (state == 3)
                gameJobject.Add(new JProperty("BH", GetFinalInfo(gameNumber, "winning", game, isStatic ? new int[] { 1, 1, 1 } : riverNumber)));

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

        private string GetDesk(Game game, int state,int gameNumber,bool isStatic)
        {
            var desk = String.Empty;

            switch (state)
            {
                case 3:
                    {
                        desk = " " + GetCardById(Convert.ToInt16(GetFinalInfo(gameNumber, "river", game, isStatic ? new int[] { 1, 1, 1 } : riverNumber)));
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

        private void InitializeStakes()
        {
            if (GetPlayerCoefficient(10) > 1) stakes.Stake10 += GetRandomNumber();
            if (GetPlayerCoefficient(11) > 1) stakes.Stake11 += GetRandomNumber();
            if (GetPlayerCoefficient(12) > 1) stakes.Stake12 += GetRandomNumber();
            if (GetPlayerCoefficient(13) > 1) stakes.Stake13 += GetRandomNumber();
            if (GetPlayerCoefficient(20) > 1) stakes.Stake20 += GetRandomNumber();
            if (GetPlayerCoefficient(21) > 1) stakes.Stake21 += GetRandomNumber();
            if (GetPlayerCoefficient(22) > 1) stakes.Stake22 += GetRandomNumber();
            if (GetPlayerCoefficient(23) > 1) stakes.Stake23 += GetRandomNumber();
            if (GetPlayerCoefficient(24) > 1) stakes.Stake24 += GetRandomNumber();
            if (GetPlayerCoefficient(25) > 1) stakes.Stake25 += GetRandomNumber();
            if (GetPlayerCoefficient(30) > 1) stakes.Stake30 += GetRandomNumber();
            if (GetPlayerCoefficient(31) > 1) stakes.Stake31 += GetRandomNumber();
            if (GetPlayerCoefficient(32) > 1) stakes.Stake32 += GetRandomNumber();
            if (GetPlayerCoefficient(33) > 1) stakes.Stake33 += GetRandomNumber();
            if (GetPlayerCoefficient(34) > 1) stakes.Stake34 += GetRandomNumber();
            if (GetPlayerCoefficient(35) > 1) stakes.Stake35 += GetRandomNumber();
            if (GetPlayerCoefficient(36) > 1) stakes.Stake36 += GetRandomNumber();
            if (GetPlayerCoefficient(37) > 1) stakes.Stake37 += GetRandomNumber();
        }

        private double GetPlayerCoefficient(short playerNumber)
        {
            return Unit.PokerBetSrvc.GetPlayerCoefficient(playerNumber,currentState);
        }

        private int GetRandomNumber()
        {
            var x = random.Next(0, 30);
            if (x <= 25)
                return 0;
            else if (x <= 28)
                return random.Next(0, 50);
            else
                return random.Next(0, 100);
        }

        public ActionResult Round()
        {
            return Json("168072", JsonRequestBehavior.AllowGet);
        }
    }
}