using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Domain;

namespace Backend.Facade.Interfaces
{
    public interface IPokerBetFacade
    {
        Game GetGame();
        Game[] GetTable(out short state);
        Game[] GetTable();
        Game[] GetTableById(int id);
        Card GetCardByID(short id);
        String GetCardNameByID(short id);

        Boolean ChangeGameState();

        GameState GetCurrentState();
    }
}
