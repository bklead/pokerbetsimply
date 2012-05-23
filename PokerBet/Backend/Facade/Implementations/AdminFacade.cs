using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Backend.Facade.Interfaces;
using Backend.DataContext;
using Domain;

namespace Backend.Facade.Implementations
{
    public class AdminFacade : IAdminFacade
    {
        private PokerBetContext context;

        public AdminFacade(PokerBetContext context)
        {
            this.context = context;
        }

        public List<Game> GetGames(int? skip)
        {
            return skip == null ? context.Games.OrderBy(p => p.Id).Take(3).ToList() : context.Games.OrderBy(p => p.Id).Skip(3*skip.Value).Take(3).ToList();
        }

        public List<Card> GetAllCards()
        {
            return context.Cards.ToList();
        }

        public List<Winning> GetAllWinnings()
        {
            return context.Winnings.ToList();
        }

        public int GetGamesCount()
        {
            return context.Games.Count() / 3;
        }

        public void SaveValues(int currentGame, int skip, short? river2, string winner2, short? winning2, short? river3, string winner3, short? winning3, short? river4, string winner4, short? winning4)
        {
            var game = context.Games.OrderBy(p=>p.Id).Skip(currentGame * 3 + skip).First();
            game.River2 = river2;
            game.Winner2 = winner2;
            game.Winning2 = winning2;
            game.River3 = river3;
            game.Winner3 = winner3;
            game.Winning3 = winning3;
            game.River4 = river4;
            game.Winner4 = winner4;
            game.Winning4 = winning4;
            context.SaveChanges();
        }

        public int InitGameHistory(IEnumerable<History> history)
        {
            foreach (var item in history)
            {
                context.History.Add(item);
            }

            try
            {
                context.SaveChanges();
            }
            catch
            {
                return -1;
            }

            return history.Max(m => m.Round)+1;
        }
    }
}
