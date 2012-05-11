using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Backend;
using Domain;
using PokerBet.Areas.AdminPanel.Models;

namespace PokerBet.Areas.AdminPanel.Controllers
{
    public class DashboardController : Controller
    {
        protected UnitOfWork Unit { get; private set; }

        public DashboardController()
        {
            Unit = new UnitOfWork();
        }

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
                    listCards.Add(new SelectListItem { Text = card.Name, Value = card.Id.ToString(), Selected = card.Id==game.River2 ? true :false });
                }
                List<SelectListItem> listWinnings = new List<SelectListItem>();
                listWinnings.Add(new SelectListItem { Text = "", Value = null });
                foreach (Winning winning in winnings)
                {
                    listWinnings.Add(new SelectListItem { Text = winning.Name, Value = winning.Id.ToString(), Selected = winning.Id == game.Winning2 ? true : false });
                }

                List<string> winners = GetAllPossibleCombinations(game.NumberOfPlayers);
                List<SelectListItem> listWinners = new List<SelectListItem>();
                listWinners.Add(new SelectListItem { Text = "", Value = null });
                foreach (string winner in winners)
                {
                    listWinners.Add(new SelectListItem { Text = winner, Value = winner, Selected = winner == game.Winner2 ? true : false });
                }

                model.Add(new GameEditModel
                {
                    Cards = listCards,
                    Winnings = listWinnings,
                    Winners = listWinners,
                    GameId=game.Id,
                    River2=game.River2,
                    Winner2 = game.Winner2,
                    Winning2 = game.Winning2
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

        public ActionResult Save(GamesModel model)
        {
            for (int i = 0; i < model.GameEditModel.Count; i++)
            {
                Unit.AdminSrvc.SaveValues(model.CurrentGame, i, model.GameEditModel[i].River2.Value, model.GameEditModel[i].Winner2, model.GameEditModel[i].Winning2.Value);
            }

            return RedirectToAction("Index", new { id=model.CurrentGame });
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
