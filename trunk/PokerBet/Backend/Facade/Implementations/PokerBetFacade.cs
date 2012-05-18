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

        //public Game[] GetTable(out short state)
        //{
        //    state = 0;
        //    var current = ctx.GameStates.FirstOrDefault();
        //    Game[] games = null;

        //    if (current == null)
        //    {
        //        games = ctx.Games.Take(3).ToArray().OrderBy(m => m.NumberOfPlayers).ToArray();
        //        SetState(new GameState()
        //        {
        //            Table4PlayerId = games[0].Id,
        //            Table6PlayerId = games[1].Id,
        //            Table8PlayerId = games[2].Id,
        //            State = 0,
        //            StartTime = DateTime.Now
        //        });
        //    }
        //    else
        //    {
        //        if (true)
        //        {
        //            games = new Game[] { current.Table4Player, current.Table6Player, current.Table8Player };
        //            state = current.State;
        //        }
        //        else
        //        {
        //            if (current.State != 3)
        //            {
        //                state = ++current.State;
        //                current.StartTime = DateTime.Now;
        //                games = new Game[] { current.Table4Player, current.Table6Player, current.Table8Player };
        //            }
        //            else
        //            {
        //                games = ctx.Games.Where(m => m.Id > current.Table8PlayerId).Take(3).ToArray().OrderBy(m => m.NumberOfPlayers).ToArray();
        //                SetState(new GameState()
        //                {
        //                    Table4PlayerId = games[0].Id,
        //                    Table6PlayerId = games[1].Id,
        //                    Table8PlayerId = games[2].Id,
        //                    State = 0,
        //                    StartTime = DateTime.Now
        //                });
        //                ctx.Entry(current).State = EntityState.Deleted;
        //            }
        //        }
        //    }

        //    try
        //    {
        //        ctx.SaveChanges();
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }

        //    return games;
        //}

        public Game[] GetTable(out short state)
        {
            state = 0;
            var current = ctx.GameStates.FirstOrDefault();
            Game[] games = new Game[] { current.Table4Player, current.Table6Player, current.Table8Player };
            state = current!=null ? current.State : Convert.ToInt16(0);

            return games;
        }

        public Game[] GetTable()
        {
            var current = ctx.GameStates.FirstOrDefault();
            Game[] games = new Game[] { current.Table4Player, current.Table6Player, current.Table8Player };

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


        public bool ChangeGameState()
        {
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
                if (current.State != 3)
                {
                    current.StartTime = DateTime.Now;
                    current.State++;
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

            try
            {
                ctx.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        public GameBet[] GetGameBet(int id)
        {
            var bet = ctx.GameBets.Find(id);
            return ctx.GameBets.Where(m => m.ContractNumber == bet.ContractNumber).ToArray();
        }

        public int? CreateStake(string[] playerList, string[] oddList, string sum)
        {
            try
            {
                Random random = new Random();
                GameBet bet = new GameBet();
                for (int i = 0; i < oddList.Length; i++)
                {
                    if (Convert.ToDouble(oddList[i]) > 1)
                    {
                        bet = new GameBet
                        {
                            Winner = Convert.ToInt32(playerList[i]),
                            Index = Convert.ToDouble(oddList[i]),
                            Sum = Convert.ToInt32(sum),
                            StartDate = DateTime.Now,
                            TableNumber = Convert.ToInt32(playerList[i].Substring(0, 1)),
                            TableCode = 171588, //need to set to current game number
                            Event = ctx.Constants.FirstOrDefault(p => p.Name == "Event").Value + Convert.ToInt64(playerList[i].Substring(0, 1)),
                            ContractNumber = ctx.Constants.FirstOrDefault(p => p.Name == "ContractNumber").Value + 1
                        };
                        ctx.GameBets.Add(bet);
                    }
                }
                ctx.Constants.FirstOrDefault(p => p.Name == "Event").Value += 3;
                ctx.Constants.FirstOrDefault(p => p.Name == "ContractNumber").Value += 1;
                ctx.SaveChanges();
                return bet.Id;
            }
            catch
            {
                return null;
            }
        }
    }
}
