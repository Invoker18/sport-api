USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetOpenGamesByGameIds]    Script Date: 11/7/2024 10:26:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: DEC 06 2024
-- Description:	[VZ_GetOpenGamesByGameIds]
-- =============================================

CREATE PROCEDURE [dbo].[VZ_GetOpenGamesByIdGames]
	@prmIdGames NVARCHAR(MAX),
	@prmIdAgent int,
	@prmIdLineType int,
	@prmIdLanguage tinyint
AS
DECLARE @bitZero bit,
	    @Main_IdGame int, 
	    @Main_IdSport char(5),
	    @Main_ParentOrder smallint,
	    @Order	smallint

SET NOCOUNT ON

SET @bitZero = 0
SET @Order = 1


CREATE TABLE #tblMainGames
(
	FromAgent			  bit, 
	IdGame				  int, 
	VisitorTeam			  varchar(50), 
	HomeTeam			  varchar(50), 
	IdSport				  varchar(5), 
	IdLeague			  smallint, 
	IdGameType			  int,
	GameDate			  datetime,
	GameDateTime		  datetime, 
	VisitorNumber		  int, 
	HomeNumber			  int, 
	GameStat			  char(1), 
	Graded				  bit,
	Hookups				  bit, 
	Period				  tinyint, 
	VisitorPitcher		  varchar(50), 
	HomePitcher			  varchar(50), 
	PitcherChanged		  tinyint,
	NormalGame			  tinyint, 
	ParentGame			  int, 
	FamilyGame			  int,
	IdLineType			  smallint, 
	VisitorOdds			  int, 
	HomeOdds			  int, 
	TotalOver			  real, 
	OverOdds			  int,
	TotalUnder			  real, 
	UnderOdds			  int, 
	VisitorSpread		  real, 
	VisitorSpreadOdds	  int,
	HomeSpread			  real, 
	HomeSpreadOdds		  int, 
	VisitorSpecial		  real, 
	VisitorSpecialOdds	  int,
	HomeSpecial			  real, 
	HomeSpecialOdds		  int, 	
	BoldSpread			  bit, 
	BoldTotal			  bit, 
	BoldML				  bit, 
	HasChildren			  bit, 
	IdEvent				  smallint NULL,
	TeamLangVisitorTeam   nvarchar(120) NULL, 
	TeamLangHomeTeam	  nvarchar(120) NULL,
	GameLangVisitorTeam   nvarchar(200) NULL, 
	GameLangHomeTeam	  nvarchar(200) NULL,
	HideGame			  bit, 
	HideSpread			  bit, 
	HideTotal			  bit, 
	HideMoneyLine		  bit, 
	PeriodDescription	  varchar(50), 
	GameDescription		  varchar(255), 
	GameLangDescription   nvarchar(510),
	ParentOrder			  smallint,
	ChildOrder			  smallint
);

INSERT INTO #tblMainGames
	SELECT 0, G.IdGame, G.VisitorTeam, G.HomeTeam, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,
	CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)),
	G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,
	G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
	G.NormalGame, G.ParentGame, G.FamilyGame,
	L.IdLineType, L.VisitorOdds, L.HomeOdds, L.TotalOver, L.OverOdds,
	L.TotalUnder, L.UnderOdds, L.VisitorSpread, L.VisitorSpreadOdds,
	L.HomeSpread, L.HomeSpreadOdds, L.VisitorSpecial, L.VisitorSpecialOdds,
	L.HomeSpecial, L.HomeSpecialOdds, 	
	L.BoldSpread, L.BoldTotal, L.BoldML, G.HasChildren, G.IdEvent,
	TLV.Name AS TeamLangVisitorTeam, TLH.Name AS TeamLangHomeTeam,
	GL.VisitorTeam AS GameLangVisitorTeam, GL.HomeTeam AS GameLangHomeTeam,
	@bitZero HideGame, @bitZero HideSpread, @bitZero HideTotal, @bitZero HideMoneyLine, P.PeriodDescription, 
	G.Description as GameDescription, GL.Description as GameLangDescription, 
	row_number() OVER (ORDER BY G.VisitorNumber),0
	FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
	JOIN GameValues L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdLineType = @prmIdLineType
	LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLV WITH (NOLOCK) ON G.IdTeamVisitor = TLV.IdTeam AND TLV.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLH WITH (NOLOCK) ON G.IdTeamHome = TLH.IdTeam AND TLH.IdLanguage = @prmIdLanguage
	WHERE G.GameStat = 'O'
	  AND G.Graded = 0
	  AND G.Online = 1
	  AND G.IdGame IN (SELECT * FROM dbo.fnSplitString(@prmIdGames))
	  AND G.GameDateTime > GETDATE()
	  AND L.HideGame = 0

	UNION

	SELECT 1, G.IdGame, G.VisitorTeam, G.HomeTeam, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,
		CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)),
		G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,
		G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
		G.NormalGame, G.ParentGame, G.FamilyGame,
		@prmIdLineType IdLineType, L.VisitorOdds, L.HomeOdds, L.TotalOver, L.OverOdds,
		L.TotalUnder, L.UnderOdds, L.VisitorSpread, L.VisitorSpreadOdds,
		L.HomeSpread, L.HomeSpreadOdds, L.VisitorSpecial, L.VisitorSpecialOdds,
		L.HomeSpecial, L.HomeSpecialOdds, 	
		@bitZero BoldSpread, @bitZero BoldTotal, @bitZero BoldML, G.HasChildren, G.IdEvent,
		null AS TeamLangVisitorTeam, null AS TeamLangHomeTeam,
		null AS GameLangVisitorTeam, null AS GameLangHomeTeam,
		L.HideGame, L.HideSpread, L.HideTotal, L.HideMoneyLine, P.PeriodDescription, 
		G.Description as GameDescription, GL.Description as GameLangDescription,
		row_number() OVER (ORDER BY G.VisitorNumber),0
	FROM Game G WITH (NOLOCK) 
	INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
	LEFT OUTER JOIN GameLang GL WITH(NOLOCK) on G.IdGame = GL.IdGame and GL.IdLanguage = @prmIdLanguage
	JOIN GameValuesByAgent L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdAgent = @prmIdAgent
	WHERE G.GameStat = 'O'
	  AND G.Graded = 0
	  AND G.Online = 1
	  AND G.IdGame IN (SELECT * FROM dbo.fnSplitString(@prmIdGames))
	  AND G.GameDateTime > GETDATE()  
	  --AND L.HideGame = 0

	--ORDER BY CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)), G.VisitorNumber
	ORDER BY 8, 10, 2, 1

delete from #tblMainGames
where IdGame in(select distinct IdGame from #tblMainGames where HideGame = 1)
	
SELECT tbl.*
,(
SELECT b.home_image_id
FROM [MOVER].[dbo].[Games] a
INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
WHERE a.DGS_game_id = tbl.IdGame) home_image_id
,(
SELECT b.away_image_id
FROM [MOVER].[dbo].[Games] a
INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
WHERE a.DGS_game_id = tbl.IdGame) away_image_id,
((SELECT count( DISTINCT G.IdGame) c_games 
FROM Game G WITH (NOLOCK) 
WHERE G.FamilyGame = tbl.FamilyGame 
AND G.IdSport <> 'PROP' 
AND G.FamilyGame IS NOT NULL
AND G.GameStat = 'O'
AND G.Graded = 0
AND G.Online = 1
AND G.GameDateTime > GETDATE() 
)+
(SELECT count( DISTINCT G.IdGame) c_games 
FROM Game G WITH (NOLOCK) 
WHERE G.FamilyGame = tbl.FamilyGame 
AND G.ParentGame = G.IdGame
AND G.IdSport = 'PROP' 
AND G.FamilyGame IS NOT NULL
AND G.GameStat = 'O'
AND G.Graded = 0
AND G.Online = 1
AND G.GameDateTime > GETDATE() 
)-1) count_games 

 FROM #tblMainGames AS tbl WITH(NOLOCK)
ORDER BY GameDateTime, ParentGame, ChildOrder, IdGame, FromAgent --8, 10, 2, 1ParentGame, ParentOrder, ChildOrder
