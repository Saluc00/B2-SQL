const name = "lucas-usereau"
const promo = "B2A"

const q1 = `
  SELECT *
  FROM Customer
`
const q1 = `select * from Track where Milliseconds < (select Milliseconds from Track where TrackId =3457)`
const q2 = `select * from Track where MediaTypeId < (select MediaTypeId from Track where Name='Rehab')`
const q3 = `SELECT p.PlaylistId, p.Name, COUNT(pl.TrackId) as 'Nb musique', sum(t.Milliseconds) as 'Durée totale', avg(t.Milliseconds) as 'Moyenne' FROM Playlist p 
            JOIN PlaylistTrack pl ON p.PlaylistId = pl.PlaylistId 
            JOIN Track t ON t.TrackId = pl.TrackId
            Group By p.PlaylistId, p.Name`
const q4 = ``
const q5 = `SELECT COUNT(pl.TrackId) as 'Nb musique'
            FROM Playlist p
            JOIN PlaylistTrack pl ON p.PlaylistId = pl.PlaylistId 
            Group By p.PlaylistId
            HAVING COUNT(pl.TrackId) in(SELECT COUNT(pl.TrackId)
                          FROM Playlist p
                          JOIN PlaylistTrack pl ON p.PlaylistId = pl.PlaylistId 
                          WHERE p.PlaylistId = 1 or p.PlaylistId = 13
                          Group By p.PlaylistId )
            ORDER BY p.PlaylistId ASC`
const q6 = `select c.* from Invoice i
            JOIN Customer c ON c.CustomerId = i.CustomerId
            where i.Total > all(select i.Total from Invoice i
                    JOIN Customer c ON c.CustomerId = i.CustomerId
                    where c.Country = 'France')
              and c.Country != 'France'`
const q7 = `select DISTINCT i.BillingCountry Pays, max(i.Total) as 'Commande max', min(i.Total) as 'Commande min', avg(i.Total) 'Commande moyen',count(i.Total) 'Toutes les commandes', CEILING(sum(i.total)/(select sum(Total) from Invoice)*100) Pourcentage from Invoice i
            JOIN Customer c ON c.CustomerId = i.CustomerId
            GROUP BY i.BillingCountry`
const q8 = `SELECT t.*, m.Name 'Nom média', (SELECT avg(UnitPrice) from Track) 'Prix moyen', (select avg(tr.UnitPrice) from Track tr join MediaType me on me.MediaTypeId = tr.MediaTypeId group by me.Name having me.Name = m.Name) from Track t
            JOIN MediaType m ON t.MediaTypeId = m.MediaTypeId
            GROUP BY t.TrackId, t.Name, t.AlbumId, t.MediaTypeId, t.GenreId, t.Composer, t.Milliseconds, t.Bytes, t.UnitPrice, m.Name`
const q9 = `select t.* , ge.Name as Genre, (SELECT max(t.UnitPrice) FROM Track t JOIN Genre g on t.GenreId =g.GenreId where g.Name = ge.Name) / (select min(t.UnitPrice) from Track t join Genre g on g.GenreId = t.GenreId where g.Name = ge.Name) as 'Median genre' from Track t
            Join Genre ge on t.GenreId = ge.GenreId
            JOIN MediaType m on t.MediaTypeId = m.MediaTypeId
            where t.UnitPrice < (SELECT max(t.UnitPrice) FROM Track t JOIN Genre g on t.GenreId =g.GenreId where g.Name = ge.Name) / (select min(t.UnitPrice) from Track t join Genre g on g.GenreId = t.GenreId where g.Name = ge.Name) `
const q10 = `select pt.PlaylistId, 
p.Name,
count(ar.ArtistId) 'Artiste différent', 
(select count(tra.TrackId) from Artist art 
join Album alb on alb.ArtistId = art.ArtistId 
join  Track tra on tra.AlbumId = alb.AlbumId 
where art.ArtistId = ar.ArtistId ) 'Sons par artistes',

(select avg(tra.UnitPrice) from Artist art 
join Album alb on alb.ArtistId = art.ArtistId 
join  Track tra on tra.AlbumId = alb.AlbumId 
where art.ArtistId = ar.ArtistId
group by art.ArtistId) 'Prix moyen par artistes',

(select count(t.TrackId) from Playlist play
join PlaylistTrack pte on pte.PlaylistId = play.PlaylistId
join Track t on t.TrackId = pte.PlaylistId
where play.PlaylistId = pt.PlaylistId
group by play.PlaylistId) 'Musiques par playlist'

from Playlist p
join PlaylistTrack pt on pt.PlaylistId = p.PlaylistId
join Track t on pt.TrackId = t.TrackId
join Album a on a.AlbumId = t.AlbumId
join Artist ar on ar.ArtistId = a.ArtistId
group by ar.ArtistId,  pt.PlaylistId, p.Name`
// Pas fini la 10..
const q11 = `select oui.BillingCountry, 
(select COUNT(BillingCountry) + 
  (select count(country) from Customer where Country = oui.BillingCountry) + 
  (select COUNT(Country) from Employee where Country = oui.BillingCountry) 
from Invoice i where BillingCountry = oui.BillingCountry)	
from	(select BillingCountry  from Invoice 
    union 
    select country from Customer
    union
    select Country from Employee) as oui`
const q12 = `select oui.BillingCountry 'Pays', 
(select COUNT(BillingCountry) + 
  (select count(country) from Customer where Country = oui.BillingCountry) + 
  (select COUNT(Country) from Employee where Country = oui.BillingCountry) 
from Invoice i where BillingCountry = oui.BillingCountry)	'Total', 

(select COUNT(Country) from Employee where Country = oui.BillingCountry) 'Employee',
(select count(country) from Customer where Country = oui.BillingCountry) 'Customer',
(select count(BillingCountry) from Invoice where BillingCountry = oui.BillingCountry) 'Invoice'
from	(select BillingCountry  from Invoice 
    union 
    select country from Customer
    union
    select Country from Employee) as oui `
const q13 = `select i.* from Invoice i
join InvoiceLine il on il.InvoiceId = i.InvoiceId
where il.InvoiceLineId in(select TrackId from Track
						where Milliseconds in(select max(t.Milliseconds)from Track t
												join Genre g on g.GenreId= t.GenreId
												group by g.Name))`
const q14 = `select i.*,
Total / (select count(InvoiceId) from InvoiceLine where InvoiceId = il.InvoiceId ) 'coût moyen par chanson',
  (select sum(temps.t) from (select (select Milliseconds from Track where TrackId = il.TrackId) t from InvoiceLine ile
 join Invoice i on i.InvoiceId = ile.InvoiceId
 join Track t on t.TrackId = ile.TrackId
 where i.InvoiceId = il.InvoiceId) as temps) 'durée total des chansons',
 Total / (select sum(temps.t) from (select (select Milliseconds from Track where TrackId = il.TrackId) t from InvoiceLine ile
 join Invoice i on i.InvoiceId = ile.InvoiceId
 join Track t on t.TrackId = ile.TrackId
 where i.InvoiceId = il.InvoiceId) as temps) 'coût des chansons par seconde'
from InvoiceLine il
join Invoice i on i.InvoiceId = il.InvoiceId
join Track t on t.TrackId = il.TrackId`
const q15 = `select distinct e.FirstName,
e.LastName, (select count(CustomerId) from Customer) 'Total vente',

(select count(CustomerId) from Customer where SupportRepId = e.EmployeeId) 'Vente par vendeur', 

(select encore.lol from
 (select top 1 c.t as lol, max(c.s) as maa  from  
   (select iv.BillingCountry t,sum(iv.Total) s from Invoice iv 
   join InvoiceLine ii on ii.InvoiceId = iv.InvoiceId 
   join Customer cc on cc.CustomerId = iv.CustomerId  
   where cc.SupportRepId =  e.EmployeeId 
   group by iv.BillingCountry) as c
 group by c.t
 order by max(c.s) desc)  as encore ) 'Pays meilleurs vente',

(select genre.Name from
 (select top 1 g.Name as name ,sum(iv.InvoiceId) as somme from Genre g 
 join Track t on t.GenreId = g.GenreId
 join InvoiceLine iv on iv.TrackId = t.TrackId
 join Invoice i on i.InvoiceId = iv.InvoiceId
 join Customer c on c.CustomerId = i.CustomerId
 join Employee ee on ee.EmployeeId = c.SupportRepId 
 where ee.EmployeeId = e.EmployeeId
 group by g.Name
 order by sum(iv.InvoiceId) desc) as genre
) 'Genre le plus vendu',


(100*(select count(CustomerId) from Customer where SupportRepId = e.EmployeeId))/(select count(CustomerId) from Customer) 'Pourcentage'

from Employee e
join Customer c on c.SupportRepId = e.EmployeeId`
const q16 = `select distinct top 1 e.FirstName ,
e.LastName, (select count(CustomerId) from Customer) 'Total vente',

(select count(CustomerId) from Customer where SupportRepId = e.EmployeeId) as 'Vente par vendeur', 

(select encore.lol from
 (select top 1 c.t as lol, max(c.s) as maa  from  
   (select iv.BillingCountry t,sum(iv.Total) s from Invoice iv 
   join InvoiceLine ii on ii.InvoiceId = iv.InvoiceId 
   join Customer cc on cc.CustomerId = iv.CustomerId  
   where cc.SupportRepId =  e.EmployeeId 
   group by iv.BillingCountry) as c
 group by c.t
 order by max(c.s) desc)  as encore ) 'Pays meilleurs vente',

(select genre.Name from
 (select top 1 g.Name as name ,sum(iv.InvoiceId) as somme from Genre g 
 join Track t on t.GenreId = g.GenreId
 join InvoiceLine iv on iv.TrackId = t.TrackId
 join Invoice i on i.InvoiceId = iv.InvoiceId
 join Customer c on c.CustomerId = i.CustomerId
 join Employee ee on ee.EmployeeId = c.SupportRepId 
 where ee.EmployeeId = e.EmployeeId
 group by g.Name
 order by sum(iv.InvoiceId) desc) as genre
) 'Genre le plus vendu',


(100*(select count(CustomerId) from Customer where SupportRepId = e.EmployeeId))/(select count(CustomerId) from Customer) 'Pourcentage'

from Employee e
join Customer c on c.SupportRepId = e.EmployeeId
order by 'Vente par vendeur' asc`
const q17 = ``
const q18 = `
/*******************************************************************************
   Drop database if it exists
********************************************************************************/
IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'partie2')
BEGIN
	ALTER DATABASE [partie2] SET OFFLINE WITH ROLLBACK IMMEDIATE;
	ALTER DATABASE [partie2] SET ONLINE;
	DROP DATABASE [partie2];
END

GO

/*******************************************************************************
   Create database
********************************************************************************/
CREATE DATABASE [partie2];
GO

USE [partie2];
GO

/*******************************************************************************
   Create tables
********************************************************************************/

CREATE TABLE [dbo].[User]
(
    [UserId] INT NOT NULL IDENTITY,
    [username] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [superuser] INT NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([UserId])
);
GO

CREATE TABLE [dbo].[Group]
(
    [GroupId] INT NOT NULL IDENTITY,
    [name] NVARCHAR(255) NOT NULL,
    [display_name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(1024) NOT NULL,
    CONSTRAINT [PK_Group] PRIMARY KEY CLUSTERED ([GroupId])
);
GO

CREATE TABLE [dbo].[Role]
(
    [RoleId] INT NOT NULL IDENTITY,
    [name] NVARCHAR(255) NOT NULL,
    [display_name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(1024) NOT NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([RoleId])
);
GO

CREATE TABLE [dbo].[Permission]
(
    [PermissionId] INT NOT NULL IDENTITY,
    [name] NVARCHAR(255) NOT NULL,
    [display_name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(1024) NOT NULL,
    CONSTRAINT [PK_Permission] PRIMARY KEY CLUSTERED ([PermissionId])
);
GO

/*******************************************************************************
   Create Tables de liaisons
********************************************************************************/

CREATE TABLE [dbo].[User_Group]
(
    [user_id] INT NOT NULL,
    [group_id] INT NOT NULL
);
GO

CREATE TABLE [dbo].[Group_Role]
(
    [group_id] INT  NOT NULL,
    [role_id] INT NOT NULL 
);
GO

CREATE TABLE [dbo].[User_Role]
(
    [user_id] INT NOT NULL,
    [role_id] INT NOT NULL
);
GO

CREATE TABLE [dbo].[Role_Permission]
(
    [role_id] INT NOT NULL,
    [permission_id] INT NOT NULL
);
GO


/*******************************************************************************
   Create Foreign Keys
********************************************************************************/

ALTER TABLE [dbo].[User_Group] ADD CONSTRAINT [User_Group_FK_UserId]
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO
ALTER TABLE [dbo].[User_Group] ADD CONSTRAINT [User_Group_FK_GroupId]
    FOREIGN KEY ([group_id]) REFERENCES [dbo].[Group] ([GroupId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE [dbo].[User_Role] ADD CONSTRAINT [User_Role_FK_UserId]
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO
ALTER TABLE [dbo].[User_Role] ADD CONSTRAINT [User_Role_FK_RoleId]
    FOREIGN KEY ([role_id]) REFERENCES [dbo].[Role] ([RoleId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE [dbo].[Group_Role] ADD CONSTRAINT [Group_Role_FK_RoleId]
    FOREIGN KEY ([role_id]) REFERENCES [dbo].[Role] ([RoleId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO
ALTER TABLE [dbo].[Group_Role] ADD CONSTRAINT [Group_Role_FK_GroupId]
    FOREIGN KEY ([group_id]) REFERENCES [dbo].[Group] ([GroupId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE [dbo].[Role_Permission] ADD CONSTRAINT [Role_Permission_FK_RoleId]
    FOREIGN KEY ([role_id]) REFERENCES [dbo].[Role] ([RoleId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO
ALTER TABLE [dbo].[Role_Permission] ADD CONSTRAINT [Role_Permission_FK_PermissionId]
    FOREIGN KEY ([permission_id]) REFERENCES [dbo].[Permission] ([PermissionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;
GO
`
const q19 = `insert into Track (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice) values ('Test1', 1 , 1 , 1, 'Plein de mondes', 200000, 666000, 0.50), 
('Test2', 1 , 1 , 1, 'Plein de mondes', 200000, 666000, 0.50),
('Test3', 1 , 1 , 1, 'Plein de mondes', 200000, 666000, 0.50)`
const q20 = `insert into Employee (LastName, FirstName, Title, ReportsTo, BirthDate, HireDate, Address, City, State,Country, PostalCode, Phone, Fax, Email)
values ('moi', 'lautre', 'stagiaire', 6, '2001-01-10 00:00:00.000', '2019-02-04 00:00:00.000', '10 rue du lol', 'Bordeaux', 'FR', 'France', '33200', '+(33) 06.66.66.66.66', '', 'moi.lautre@chinookcorp.fr'), 
('moi2', 'lautre2', 'stagiaire', 6, '2001-01-10 00:00:00.000', '2019-02-04 00:00:00.000', '10 rue du lol', 'Bordeaux', 'FR', 'France', '33200', '+(33) 06.66.66.66.55', '', 'moi2.lautre2@chinookcorp.fr')
`
const q21 = `delete from Invoice where InvoiceDate = YEAR(2010)`
const q22 = `update Invoice
set CustomerId = (select top 1 CustomerId from Invoice where lower(BillingCountry) = 'france')
where lower(BillingCountry) = 'germany' and InvoiceDate between 2011 and 2014`
const q23 = `
update Invoice
set BillingCountry = (select res.payscl from (select c.Country as payscl, i.BillingCountry as paysf from Invoice i 
					join Customer c on c.CustomerId = i.CustomerId
					where c.Country != i.BillingCountry) as res)`
const q24 = `ALTER TABLE dbo.Employee ADD salary INT`
const q25 = `DECLARE @MyCounter int;
SET @MyCounter = 1;
while  (@MyCounter < (select count(EmployeeId) from Employee) )

begin
	update Employee
	set salary = 30000+32000*rand()
	where EmployeeId = @MyCounter

	set @MyCounter = @MyCounter + 1
end
go`
const q26 = `alter table dbo.Invoice DROP COLUMN BillingPostalCode
`


// NE PAS TOUCHER CETTE SECTION
const tp = {
  name: name,
  promo: promo,
  queries: [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26]
}
module.exports = tp