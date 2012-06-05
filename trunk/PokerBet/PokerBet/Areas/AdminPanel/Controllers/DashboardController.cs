using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Backend;
using Domain;
using PokerBet.Areas.AdminPanel.Models;
using PokerBet.Controllers;
using System.Web.Security;
using PokerBet.Helpers;

namespace PokerBet.Areas.AdminPanel.Controllers
{
    public class DashboardController : BaseController
    {
        MembershipProvider provider;
        public DashboardController()
        {
            provider = Membership.Provider;
            Unit = new UnitOfWork();
        }

        protected UnitOfWork Unit { get; private set; }

        //[Authorize(Roles = "Admin")]
        public ActionResult Index(int? id)
        {
            List<Game> games = Unit.AdminSrvc.GetGames(id);

            List<Card> cards = Unit.AdminSrvc.GetAllCards();
            List<Winning> winnings = Unit.AdminSrvc.GetAllWinnings();
            List<GameEditModel> model = new List<GameEditModel>();

            foreach (Game game in games)
            {
                List<SelectListItem> listCards = new List<SelectListItem>();
                listCards.Add(new SelectListItem { Text = "", Value = null });
                foreach (Card card in cards)
                {
                    listCards.Add(new SelectListItem { Text = card.Name, Value = card.Id.ToString()});
                }
                List<SelectListItem> listWinnings = new List<SelectListItem>();
                listWinnings.Add(new SelectListItem { Text = "", Value = null });
                foreach (Winning winning in winnings)
                {
                    listWinnings.Add(new SelectListItem { Text = winning.Name, Value = winning.Id.ToString()});
                }

                List<string> winners = GetAllPossibleCombinations(game.NumberOfPlayers);
                List<SelectListItem> listWinners = new List<SelectListItem>();
                listWinners.Add(new SelectListItem { Text = "", Value = null });
                foreach (string winner in winners)
                {
                    listWinners.Add(new SelectListItem { Text = winner, Value = winner });
                }

                model.Add(new GameEditModel
                {
                    Cards = listCards,
                    Winnings = listWinnings,
                    Winners = listWinners,
                    GameId=game.Id,
                    River2=game.River2,
                    Winner2 = game.Winner2,
                    Winning2 = game.Winning2,
                    River3 = game.River3,
                    Winner3 = game.Winner3,
                    Winning3 = game.Winning3,
                    River4 = game.River4,
                    Winner4 = game.Winner4,
                    Winning4 = game.Winning4
                });
            }

            int totalCount = Unit.AdminSrvc.GetGamesCount();
            List<SelectListItem> listGames = new List<SelectListItem>();
            for (int i = 0; i < totalCount;i++ )
            {
                listGames.Add(new SelectListItem { Text = (i + 1).ToString(), Value = i.ToString()});
            }

            GamesModel resultModel = new GamesModel
            {
                GameEditModel=model,
                CurrentGame = id == null ? 0 : id.Value,
                TotalGamesCount = totalCount,
                Games = listGames
                
            };

            return View(resultModel);
        }

        //[Authorize(Roles = "Admin")]
        public ActionResult Save(GamesModel model)
        {
            for (int i = 0; i < model.GameEditModel.Count; i++)
            {
                Unit.AdminSrvc.SaveValues(model.CurrentGame, i, model.GameEditModel[i].River2, model.GameEditModel[i].Winner2, model.GameEditModel[i].Winning2,
                    model.GameEditModel[i].River3, model.GameEditModel[i].Winner3, model.GameEditModel[i].Winning3,
                    model.GameEditModel[i].River4, model.GameEditModel[i].Winner4, model.GameEditModel[i].Winning4);
            }

            return RedirectToAction("Index", new { id=model.CurrentGame });
        }               

        [HttpPost]
        public ActionResult LogOn(LogOnModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                if (provider.ValidateUser(model.UserName, model.Password))
                {
                    FormsAuthentication.SetAuthCookie(model.UserName, true);

                    if (!String.IsNullOrEmpty(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Start");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "The user name or password provided is incorrect.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }        

        [HttpGet]
        public ActionResult LogOn()
        {
            return View();
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            Session.Abandon();
            return RedirectToAction("LogOn");
        }

        //[Authorize(Roles = "Admin")]
        public ActionResult Stop()
        {
            MvcApplication.timer.Stop();
            Unit.AdminSrvc.Stop();
            PokerBet.Controllers.HomeController.stakes = new Stakes();
            return new EmptyResult();
        }

        public ActionResult CreateUsers()
        {
            MembershipCreateStatus status;

            if (Membership.Provider.GetUser("Cashier", false) == null)
            {
                provider.CreateUser("Cashier", "123456", "artur.keyan@gmail.com", null, null, true, null, out status);
                provider.CreateUser("Admin", "123456", "artur.keyan@gmail.com", null, null, true, null, out status);
            }

            if (!Roles.RoleExists("Cashier"))
            {
                Roles.CreateRole("Cashier");
            }

            if (!Roles.RoleExists("Admin"))
            {
                Roles.CreateRole("Admin");
            }

            if (!Roles.IsUserInRole("Cashier", "Cashier"))
            {
                Roles.AddUserToRole("Cashier", "Cashier");
            }

            if (!Roles.IsUserInRole("Admin", "Admin"))
            {
                Roles.AddUserToRole("Admin", "Admin");
            }

            return RedirectToAction("Start");
        }

        [HttpGet]
        //[Authorize(Roles="Admin")]
        public ActionResult Start()
        {
            var rand = new Random();
            var model = new List<RoundAndWinner>(8);
            for (int i = 0; i < 8; i++)
            {
                model.Add(new RoundAndWinner()
                {
                    Winners = rand.Next(10, 14) + "," +
                              rand.Next(20, 26) + "," +
                              rand.Next(30, 38)
                });
            }
            
            return View(model);
        }

        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public ActionResult Start(List<RoundAndWinner> model)
        {
            if (ModelState.IsValid)
            {
                var history = new List<History>(model.Count);
                foreach (var item in model)
                {
                    history.Add(new History()
                    {
                        Round = item.Round,
                        Winners = item.Winners
                    });
                }

                var result = Unit.AdminSrvc.InitGameHistory(history);
                if (result != -1)
                {
                    Unit.PokerBetSrvc.ChangeGameState(result);
                    MvcApplication.timer.Start();
                    return Redirect("/");
                }
            }
            return View(model);
        }

        List<string> GetAllPossibleCombinations(short x)
        {
            List<string> result=new List<String>();

            int number = Convert.ToInt32(Math.Pow(2, x));
            for (int i = 1; i < number; i++)
            {
                string str = "";
                for (int j = 0; j < x; j++)
                {
                    bool bit = (i & (1 << j)) != 0;
                    if (bit) str += (j + 1).ToString() + ",";
                }
                result.Add(str.TrimEnd(','));
            }

            return result.OrderBy(p=>p.Length).ToList();
        }
    }
}
