CREATE TABLE [GameStates]
(
	Id int identity(1,1) primary key,
	Table4PlayerId int NOT NULL,
	Table6PlayerId int NOT NULL,
	Table8PlayerId int NOT NULL,
	[State] smallint NOT NULL,
	[Round] int NOT NULL,
	StartTime datetime NOT NULL,
	foreign key ( Table4PlayerId ) references Games (Id),
	foreign key ( Table6PlayerId ) references Games (Id),
	foreign key ( Table8PlayerId ) references Games (Id),
);
Go