﻿using System;
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

        public int? ChangeGameState(int? round)
        {
            var current = ctx.GameStates.FirstOrDefault();
            Game[] games = null;
            int state = 0;

            if (current == null)
            {
                games = GetNextGames();
                //games = GetNextGames(); //for random
                SetState(new GameState()
                {
                    Table4PlayerId = games[0].Id,
                    Table6PlayerId = games[1].Id,
                    Table8PlayerId = games[2].Id,
                    State = 0,
                    StartTime = DateTime.Now,
                    Round = round.Value
                });
            }
            else
            {          
                if (current.State != 3 && !round.HasValue)
                {
                    current.StartTime = DateTime.Now;
                    current.State++;
                    games = new Game[] { current.Table4Player, current.Table6Player, current.Table8Player };
                    state = current.State;
                }
                else
                {
                    //games = ctx.Games.Where(m => m.Id > current.Table8PlayerId).Take(3).ToArray().OrderBy(m => m.NumberOfPlayers).ToArray();
                    games = GetNextGames();
                    SetState(new GameState()
                    {
                        Table4PlayerId = games[0].Id,
                        Table6PlayerId = games[1].Id,
                        Table8PlayerId = games[2].Id,
                        State = 0,
                        StartTime = DateTime.Now,
                        Round = round ?? current.Round+1
                    });
                    ctx.Entry(current).State = EntityState.Deleted;
                }
            }

            try
            {
                ctx.SaveChanges();
                return state;
            }
            catch (Exception)
            {
                return null;
            }
        }

        private Game[] GetNextGames()
        {
            var minPlayCount = ctx.Games.Min(p => p.PlayedCount);
            var skip = new Random().Next(ctx.Games.Count(m => m.NumberOfPlayers == 4 && m.PlayedCount == minPlayCount));

            var randomGame = ctx.Games.Where(m => m.NumberOfPlayers == 4 && m.PlayedCount == minPlayCount).OrderBy(m => m.Id).Skip(skip).Take(1).First();
            var games = ctx.Games.Where(m => m.Id >= randomGame.Id).Take(3).ToArray().OrderBy(m => m.NumberOfPlayers).ToArray();

            var gamesWithMinCount = ctx.Games.Count(p => p.PlayedCount == minPlayCount);

            foreach (var game in games)
            {
                if (gamesWithMinCount < 50)
                {
                    game.PlayedCount += 2;
                }
                else
                {
                    ++game.PlayedCount;
                }
            }

            ctx.SaveChanges();

            return games;


            /*var current = ctx.GameStates.First();
            var games = ctx.Games.Where(m => m.Id > current.Table8PlayerId).Take(3).ToArray().OrderBy(m => m.NumberOfPlayers).ToArray();
           
            return games;*/
        }

        public bool IsGameStateDefined()
        {
            return ctx.GameStates.FirstOrDefault() != null;
        }

        public double GetPlayerCoefficient(short playerNumber, short currentState)
        {
            if (ctx.GameStates.FirstOrDefault() != null)
            {
                int gameId;
                short gameNumber = Convert.ToInt16(playerNumber.ToString().Substring(0, 1));
                switch (gameNumber)
                {
                    case 1: gameId = ctx.GameStates.FirstOrDefault().Table4PlayerId; break;
                    case 2: gameId = ctx.GameStates.FirstOrDefault().Table6PlayerId; break;
                    default: gameId = ctx.GameStates.FirstOrDefault().Table8PlayerId; break;
                }

                string coeffs;
                switch (currentState)
                {
                    case 0: coeffs = ctx.Games.FirstOrDefault(p => p.Id == gameId).CoefficientsStep1; break;
                    case 1: coeffs = ctx.Games.FirstOrDefault(p => p.Id == gameId).CoefficientsStep2; break;
                    default: coeffs = ctx.Games.FirstOrDefault(p => p.Id == gameId).CoefficientsStep3; break;
                }
                return Convert.ToDouble(coeffs.Split(',')[Convert.ToInt16(playerNumber.ToString().Substring(1, 1))]);
            }

            return 0;
        }

        public GameBet[] GetGameBet(int id)
        {
            var bet = ctx.GameBets.Find(id);
            return ctx.GameBets.Where(m => m.ContractNumber == bet.ContractNumber).ToArray();
        }

        public int GetRound()
        {
            var state = ctx.GameStates.FirstOrDefault();
            if (state != null)
            {
                return state.Round;
            }
            return 0;
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
                        int gameId;
                        switch (Convert.ToInt32(playerList[i].Substring(0, 1)))
                        {
                            case 1: gameId = ctx.GameStates.FirstOrDefault().Table4PlayerId; break;
                            case 2: gameId = ctx.GameStates.FirstOrDefault().Table6PlayerId; break;
                            default: gameId = ctx.GameStates.FirstOrDefault().Table8PlayerId; break;
                        }
                        bet = new GameBet
                        {
                            Winner = Convert.ToInt32(playerList[i]),
                            Index = Convert.ToDouble(oddList[i]),
                            Sum = Convert.ToInt32(sum),
                            StartDate = DateTime.Now,
                            TableNumber = Convert.ToInt32(playerList[i].Substring(0, 1)),
                            TableCode = GetRound(), //need to set to current game number
                            Event = ctx.Constants.FirstOrDefault(p => p.Name == "Event").Value + Convert.ToInt64(playerList[i].Substring(0, 1)),
                            ContractNumber = ctx.Constants.FirstOrDefault(p => p.Name == "ContractNumber").Value + 1,
                            GameUniqueNumber = ctx.Constants.FirstOrDefault(p=>p.Name == "GameUniqueNumber").Value,
                            GameId = gameId
                        };
                        ctx.GameBets.Add(bet);

                        var numberOfPlayers = GetNumberOfPlayers(Convert.ToInt16(playerList[i].Substring(0, 1)));
                        var riverFinder = ctx.RiverFinder.SingleOrDefault(p => p.NumberOfPlayers == numberOfPlayers);
                        var prize = (Convert.ToInt32(sum)/oddList.Length)*Convert.ToDouble(oddList[i]);

                        switch (Convert.ToInt32(playerList[i].Substring(1, 1))+1)
                        {
                            case 1: riverFinder.Prize1 += prize; break;
                            case 2: riverFinder.Prize2 += prize; break;
                            case 3: riverFinder.Prize3 += prize; break;
                            case 4: riverFinder.Prize4 += prize; break;
                            case 5: riverFinder.Prize5 += prize; break;
                            case 6: riverFinder.Prize6 += prize; break;
                            case 7: riverFinder.Prize7 += prize; break;
                            case 8: riverFinder.Prize8 += prize; break;
                        }
                    }
                }
                ctx.Constants.FirstOrDefault(p => p.Name == "Event").Value += 3;
                ctx.Constants.FirstOrDefault(p => p.Name == "ContractNumber").Value += 1;

                if (ctx.GameStates.FirstOrDefault().State != 3)
                {
                    ctx.SaveChanges();
                    return bet.Id;
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        
        public List<History> GetHistory()
        {
            return ctx.History.ToList().OrderByDescending(m => m.Id).ToArray().Take(8).ToArray().OrderBy(m => m.Round).ToList();
        }

        public void ClearRiverFinder()
        {
            using (var context = new PokerBetContext())
            {
                foreach (var row in context.RiverFinder)
                {
                    row.Prize1 = 0;
                    row.Prize2 = 0;
                    row.Prize3 = 0;
                    row.Prize4 = 0;
                    row.Prize5 = 0;
                    row.Prize6 = 0;
                    row.Prize7 = 0;
                    row.Prize8 = 0;
                }
                context.SaveChanges();
            }

        }

        private void SetPossiblePrizesList(int i,string[] winners,ref double[] prizes)
        {
            using (var context = new PokerBetContext())
            {
                foreach (string winner in winners)
                {
                    short numberOfPlayers = GetNumberOfPlayers(Convert.ToInt16(i + 1));
                    switch (winner)
                    {
                        case "1": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize1; break;
                        case "2": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize2; break;
                        case "3": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize3; break;
                        case "4": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize4; break;
                        case "5": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize5; break;
                        case "6": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize6; break;
                        case "7": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize7; break;
                        case "8": prizes[i] += context.RiverFinder.FirstOrDefault(p => p.NumberOfPlayers == numberOfPlayers).Prize8; break;
                    }
                }
            }
        }

        public void GenerateWinTickets(int winnerNumber, int gameNumber)
        {
            int winnerFullNumber = Convert.ToInt32((gameNumber+1).ToString() + winnerNumber.ToString());
            ctx.GameBets.Where(p => p.GameUniqueNumber == ctx.Constants.FirstOrDefault(m => m.Name == "GameUniqueNumber").Value && p.Winner == winnerFullNumber).ForEach(p => p.IsWinningTicket = true);
            ctx.SaveChanges();
        }


        public void AddGameUniqueNumber()
        {
            ctx.Constants.FirstOrDefault(m => m.Name == "GameUniqueNumber").Value++;
            ctx.SaveChanges();
        }

        public int[] GetBestPrizeNumber(Game[] games)
        {
            int[] result = {1,1,1};

            if (games.Count(p => p.Id % 9 == 0) == 0)
            {
                for (int i = 0; i < 3; i++)
                {
                    double[] prizes = { 0, 0, 0 };
                    string[] winners = games[i].Winner1.Split(',');
                    SetPossiblePrizesList(i, winners, ref prizes);

                    for (int j = 2; j <= 4; j++)
                    {
                        double[] testPrizes = { 0, 0, 0 };
                        switch (j)
                        {
                            case 2: winners = games[i].Winner2 != null ? games[i].Winner2.Split(',') : null; break;
                            case 3: winners = games[i].Winner3 != null ? games[i].Winner3.Split(',') : null; break;
                            case 4: winners = games[i].Winner4 != null ? games[i].Winner4.Split(',') : null; break;
                        }
                        if (winners != null)
                        {
                            SetPossiblePrizesList(i, winners, ref testPrizes);
                            if (testPrizes[i] < prizes[i])
                            {
                                prizes[i] = testPrizes[i];
                                result[i] = j;
                            }
                        }
                    }
                }
            }

            return result;
        }



        private short GetNumberOfPlayers(short tableNumber)
        {
            switch (tableNumber)
            {
                case 1: return 4;
                case 2: return 6;
                default: return 8;
            }
        }


        public GameBet[] GetCheckByNumber(long number)
        {
            return ctx.GameBets.Where(m => m.ContractNumber == number).ToArray();
        }

        public bool PayCheckByNumber(long numb)
        {
            ctx.GameBets.Where(m => m.ContractNumber == numb).ForEach(m => { m.IsPayed = true; m.PaymentDate = DateTime.Now; });

            try
            {
                ctx.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }


        public bool AddHistory(string winners)
        {
            int currentRound = GetRound()-1;
            if (ctx.History.FirstOrDefault(m => m.Round == currentRound) != null) return false;
            var wins = winners.Split(',').OrderBy(m => m);
            winners = "";
            foreach (var item in wins)
            {
                winners += item + ",";
            }

            winners = winners.TrimEnd(',');

            ctx.History.Add(new History() {
                Round = currentRound,
                Winners = winners
            });

            try
            {
                ctx.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}

