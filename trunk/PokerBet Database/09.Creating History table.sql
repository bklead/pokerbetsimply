CREATE TABLE History
(
	Id int identity(1,1) primary key,
	[Round] int NOT NULL,
	Winners varchar(51) NOT NULL,
);
Go