CREATE TABLE Cards
(
Id smallint identity(1,1) primary key,
Name nvarchar(10) NOT NULL
);
Go

INSERT INTO Cards(Name)
Values ('Ace'), ('2'), ('3'), ('4'), ('5'), ('6'), ('7'), ('8'), ('9'), ('10'), ('Jack'), ('Queen'), ('King')
Go