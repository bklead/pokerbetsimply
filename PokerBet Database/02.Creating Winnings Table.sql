CREATE TABLE Winnings
(
Id smallint identity(1,1) primary key,
Name nvarchar(20) NOT NULL
);
Go

INSERT INTO Winnings(Name)
Values ('NoPair'), ('OnePair'), ('TwoPair'), ('Straight'), ('Trips'), ('FlHouse'), ('Flush')
Go