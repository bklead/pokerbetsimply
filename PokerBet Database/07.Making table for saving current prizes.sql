CREATE TABLE RiverFinder
(
	Id int identity(1,1) primary key,
	NumberOfPlayers smallint NOT NULL,
	Prize1 float NOT NULL default(0),
	Prize2 float NOT NULL default(0),
	Prize3 float NOT NULL default(0),
	Prize4 float NOT NULL default(0),
	Prize5 float NOT NULL default(0),
	Prize6 float NOT NULL default(0),
	Prize7 float NOT NULL default(0),
	Prize8 float NOT NULL default(0)
);
Go

Insert into RiverFinder(NumberOfPlayers)
Values (4),(6),(8)
Go