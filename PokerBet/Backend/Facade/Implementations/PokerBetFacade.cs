using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Backend.DataContext;
using Backend.Facade.Interfaces;
using Domain;
using System.Data;

namespace Backend.Facade.Implementations
{
    public class PokerBetFacade : IPokerBetFacade
    {
        private PokerBetContext ctx;

        public PokerBetFacade(PokerBetContext context)
        {
            this.ctx = context;
        }

        public Game GetGame()
        {
            return ctx.Games.FirstOrDefault();
        }

        public Game[] GetTable(out short state)
        {
            state = 0;
            var current = ctx.GameStates.FirstOrDefault();
            Game[] games = null;

            if (current == null)
            {
                games = ctx.Games.Take(3).ToArray().OrderBy(m => m.NumberOfPlayers).ToArray();
                SetState(new GameState()
                {
                    Table4PlayerId = games[0].Id,
                    Table6PlayerId = games[1].Id,
                    Table8PlayerId = games[2].Id,
                    State = 0,
                    StartTime = DateTime.Now
                });
            }
            else
            {
                if ((DateTime.Now - current.StartTime).TotalSeconds < 59)
                {
                    games = new Game[] { current.Table4Player, current.Table6Player, current.Table8Player };
                    state = current.State;
                }
                else
                {
                    if (current.State != 3)
                    {
                        state = ++current.State;
                        current.StartTime = DateTime.Now;
                        games = new Game[] { current.Table4Player, current.Table6Player, current.Table8Player };
                    }
                    else
                    {
                        games = ctx.Games.Where(m => m.Id > current.Table8PlayerId).Take(3).ToArray().OrderBy(m => m.NumberOfPlayers).ToArray();
                        SetState(new GameState()
                        {
                            Table4PlayerId = games[0].Id,
                            Table6PlayerId = games[1].Id,
                            Table8PlayerId = games[2].Id,
                            State = 0,
                            StartTime = DateTime.Now
                        });
                        ctx.Entry(current).State = EntityState.Deleted;
                    }
                }
            }

            try
            {
                ctx.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }

            return games;
        }

        public Game[] GetTableById(int id)
        {
            return ctx.Games.OrderBy(p=>p.Id).Skip(id*3).Take(3).OrderBy(m => m.NumberOfPlayers).ToArray();   
        }

        private GameState SetState(GameState state)
        {
            ctx.GameStates.Add(state);
            try
            {
                ctx.SaveChanges();
                return state;
            }
            catch { }

            return null;
        }

        public Card GetCardByID(short id)
        {
            return ctx.Cards.Find(id);
        }

        public String GetCardNameByID(short id)
        {
            var card = GetCardByID(id).Name.Split(' ');
            var name = card[1].First() + card[0].First().ToString().ToLower();
            return name;
        }


        public GameState GetCurrentState()
        {
            return ctx.GameStates.First();
        }
    }
}
