CREATE TABLE GameBet
(
	Id int identity(1,1) primary key,
	ContractNumber bigint NOT NULL,
	StartDate dateTime NOT NULL,
	[Event] bigint NOT NULL,
	TableNumber int NOT NULL,
	TableCode int NOT NULL,
	Winner int NOT NULL,
	[Index] float NOT NULL,
	[Sum] int NOT NULL,	
	GameUniqueNumber bigint NOT NULL,
	IsWinningTicket bit NOT NULL default(0),
	IsPayed bit NOT NULL default(0),
	PaymentDate datetime
);
Go