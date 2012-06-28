using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Timers;
using Backend;
using PokerBet.Helpers;
using Domain;

namespace PokerBet
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static Timer timer;
        private static int[] riverNumber = { 1, 1, 1 };
        protected UnitOfWork Unit { get; private set; }
        public static string finalGameWinners;

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            Unit = new UnitOfWork();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
            
            timer = new Timer(60000);
            timer.Elapsed += new ElapsedEventHandler(timer_Elapsed);
            timer.Enabled = true;
        }

        void timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            int? state =  new UnitOfWork().PokerBetSrvc.ChangeGameState();
            if (state != null)
            {
                var finalWinners = "";
                if (state == 0)
                {
                    Unit.PokerBetSrvc.AddHistory(finalGameWinners);
                    Unit.PokerBetSrvc.ClearRiverFinder();
                    Unit.PokerBetSrvc.AddGameUniqueNumber();
                }
                if (state == 3)
                {
                    Game[] table = Unit.PokerBetSrvc.GetTable();
                    riverNumber = Unit.PokerBetSrvc.GetBestPrizeNumber(table);

                    for (int j = 0; j <= 2; j++)
                    {
                        var winners = GetFinalInfo(j, "winner", table[j], riverNumber).Split(',');
                        for (int i = 0; i < table[j].NumberOfPlayers; i++)
                        {
                            if (winners.Contains((i + 1).ToString()))
                            {
                                Unit.PokerBetSrvc.GenerateWinTickets(i, j);
                                finalWinners += (j + 1).ToString() + i.ToString() + ",";

                            }
                        }
                    }

                    finalGameWinners = finalWinners.TrimEnd(',');
                }
            }
        }

        private string GetFinalInfo(int gameNumber, string info, Game game, int[] riverNumber)
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
    }
}