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

        public void SaveValues(int currentGame, int skip, short river2, string winner2, short winning2)
        {
            var game = context.Games.OrderBy(p=>p.Id).Skip(currentGame * 3 + skip).First();
            game.River2 = river2;
            game.Winner2 = winner2;
            game.Winning2 = winning2;
            context.SaveChanges();
        }
    }
}
