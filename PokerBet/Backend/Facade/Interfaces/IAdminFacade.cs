using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Domain;

namespace Backend.Facade.Interfaces
{
    public interface IAdminFacade
    {
        List<Game> GetGames(int? skip);
        List<Card> GetAllCards();
        List<Winning> GetAllWinnings();
        void SaveValues(int currentGame, int skip, short? river2, string winner2, short? winning2, short? river3, string winner3, short? winning3, short? river4, string winner4, short? winning4);
        int GetGamesCount();

        int InitGameHistory(IEnumerable<History> history);
    }
}
