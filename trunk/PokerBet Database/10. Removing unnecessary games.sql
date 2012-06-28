DELETE FROM [PokerBet].[dbo].[Games]
  where Id in (SELECT Id FROM [PokerBet].[dbo].[Games]
  where River3 is NULL AND (NumberOfPlayers = 8)) Or
  Id+1 in (SELECT Id FROM [PokerBet].[dbo].[Games]
  where River3 is NULL AND (NumberOfPlayers = 8)) Or
  Id+2 in (SELECT Id FROM [PokerBet].[dbo].[Games]
  where River3 is NULL AND (NumberOfPlayers = 8))
  

DELETE FROM [PokerBet].[dbo].[Games]
  where Id in (SELECT Id FROM [PokerBet].[dbo].[Games]
  where River3 is NULL AND (NumberOfPlayers = 6)) Or
  Id+1 in (SELECT Id FROM [PokerBet].[dbo].[Games]
  where River3 is NULL AND (NumberOfPlayers = 6)) Or
  Id-1 in (SELECT Id FROM [PokerBet].[dbo].[Games]
  where River3 is NULL AND (NumberOfPlayers = 6))
  