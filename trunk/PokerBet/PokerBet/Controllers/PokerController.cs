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
                {4, "One"},
                {6, "Two"},
                {8, "Three"}
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

  

        public ActionResult Main()
        {
            var game = Unit.AdminSrvc.GetGame();

            JObject obj = new JObject(
                new JProperty("three", new JObject(
                        new JProperty("playersNo", 8),
                        new JProperty("deskCards", "Qc Ts Th Kh 4s"),
                        new JProperty("BH", "Trips"),

                        new JProperty("player", CreatePlayerJSON("three", 1, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 2, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 3, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 4, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 5, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 6, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 7, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 8, 0, "Qd 7c", "0.000"))  
                    )),
                new JProperty("timestamp", 1336467723),

                new JProperty("two", new JObject(
                        new JProperty("playersNo", 4),
                        new JProperty("deskCards", "Qc Ts Th Kh 4s"),
                        new JProperty("BH", "Trips"),

                        new JProperty("player", CreatePlayerJSON("three", 1, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 2, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 3, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 4, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 5, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 6, 0, "Qd 7c", "0.000"))
                    ))
            );

            var sad = obj.ToString(Newtonsoft.Json.Formatting.Indented);

            return null;

            //return Json("{ 'three': { 'playersNo': '8', 'deskCards': 'Qc Ts Th Kh 4s', 'BH': 'Trips', 'players': { '6': { 'K': '0', 'cards': 'Qd 7c', 'id': '#three6', 'V': '0.0000' }, '4': { 'K': '0', 'cards': 'Jc 6s', 'id': '#three4', 'V': '0.0000' }, '1': { 'K': '0', 'cards': '5c 7h', 'id': '#three1', 'V': '0.0000' }, '3': { 'K': '0', 'cards': '2s 3d', 'id': '#three3', 'V': '0.0000' }, '0': { 'K': '0', 'cards': '9s Qh', 'id': '#three0', 'V': '0.0000' }, '7': { 'K': '0.97', 'cards': '6d Tc', 'id': '#three7', 'V': '1.0000' }, '2': { 'K': '0', 'cards': 'Kc 4c', 'id': '#three2', 'V': '0.0000' }, '5': { 'K': '0', 'cards': '3h 7s', 'id': '#three5', 'V': '0.0000'}} },
            //'timestamp': 1336467723, 
            //'one': { 'playersNo': '4', 'deskCards': '4s 7d Qd 8s Ts', 'BH': 'Straight', 'players': { '1': { 'K': '0', 'cards': 'Qs 2d', 'id': '#one1', 'V': '0.0000' }, '3': { 'K': '0', 'cards': '6s 8d', 'id': '#one3', 'V': '0.0000' }, '0': { 'K': '0.97', 'cards': '5h 6c', 'id': '#one0', 'V': '1.0000' }, '2': { 'K': '0', 'cards': 'Th 2s', 'id': '#one2', 'V': '0.0000'}} }, 
            //'two': { 'playersNo': '6', 'deskCards': 'Kh 6s 9d 8s 4c', 'BH': 'TwoPair', 'players': { '4': { 'K': '0', 'cards': '2d Qs', 'id': '#two4', 'V': '0.0000' }, '1': { 'K': '0', 'cards': 'Kc 3s', 'id': '#two1', 'V': '0.0000' }, '3': { 'K': '0', 'cards': 'Qd 2h', 'id': '#two3', 'V': '0.0000' }, '0': { 'K': '0.97', 'cards': '4h 6h', 'id': '#two0', 'V': '1.0000' }, '2': { 'K': '0', 'cards': '7d 8c', 'id': '#two2', 'V': '0.0000' }, '5': { 'K': '0', 'cards': '2c 8h', 'id': '#two5', 'V': '0.0000'}} }, 
            //'ts': '1336467723' }", JsonRequestBehavior.AllowGet);
        }

        private JProperty CreateGameJSON(Game game)
        {
            var aa = new JProperty(TableNumber[game.NumberOfPlayers], new JObject(
                        new JProperty("playersNo", game.NumberOfPlayers),
                        new JProperty("deskCards", "Qc Ts Th Kh 4s"),
                        new JProperty("BH", "Trips"),

                        new JProperty("player", CreatePlayerJSON("three", 1, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 2, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 3, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 4, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 5, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 6, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 7, 0, "Qd 7c", "0.000")),
                        new JProperty("player", CreatePlayerJSON("three", 8, 0, "Qd 7c", "0.000"))
                    ));

            return aa;
        }

        private string GetDesk(Game game, int state)
        {
            var desk = 0;//String.Empty;

            switch (state)
            {
                case 3:
                    {
                        desk = game.River1 ?? 0;
                        goto case 2;
                    }
                case 2:
                    {
                        desk = game.Turn + desk;
                        goto case 1;
                    }
                case 1:
                    {
                        desk = game.Flop1 + game.Flop1 + game.Flop1 + desk;
                        break;
                    }
                default:
                    break;
            }
            return "ad";
        }

        private string GetCardById(short id)
        { 
            // TODO impliment get card string by ID
            return "";
        }

        private JObject CreatePlayerJSON(string table, short number, float K, string card, string val)
        { 
            var aa = new JObject(
                new JProperty("6", new JObject(
                        new JProperty("K", 0),
                        new JProperty("cards", card),
                        new JProperty("id", "#" + table + number),
                        new JProperty("V", val)
                    ))
            );

            return aa;
        }

        public ActionResult Round()
        {
            return Json("168072", JsonRequestBehavior.AllowGet);
        }
    }
}