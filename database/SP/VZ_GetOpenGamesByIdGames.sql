USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetOpenGamesByIdGames]    Script Date: 1/29/2025 11:07:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: DEC 06 2024
-- Description:	[VZ_GetOpenGamesByIdGames]
-- =============================================

CREATE PROCEDURE [dbo].[VZ_GetOpenGamesByIdGames]
	@prmIdBook int,
	@prmIdGames NVARCHAR(MAX),
	@prmIdAgent int,
	@prmIdLineType int,
	@prmIdLanguage tinyint
AS
DECLARE @bitZero bit,
	    @Main_IdGame int, 
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
	HideGame			  bit, 
	HideSpread			  bit, 
	HideTotal			  bit, 
	HideMoneyLine		  bit, 
	PeriodDescription	  varchar(50), 
	GameDescription		  varchar(255), 
	GameLangDescription   nvarchar(510),
	LeagueLangDescription nvarchar(510),
	ParentOrder			  smallint,
	ChildOrder			  smallint
);

INSERT INTO #tblMainGames
	SELECT 0, G.IdGame, 
	CASE 
		WHEN TLV.Name IS NOT NULL THEN TLV.Name 
		WHEN GL.VisitorTeam IS NOT NULL THEN GL.VisitorTeam 
		ELSE G.VisitorTeam 
	END AS VisitorTeam,
	CASE 
		WHEN TLH.Name IS NOT NULL THEN TLH.Name
		WHEN GL.HomeTeam IS NOT NULL THEN GL.HomeTeam 
		ELSE G.HomeTeam 
	END AS HomeTeam,
	LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,
	CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)),
	G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,
	G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
	G.NormalGame, G.ParentGame, G.FamilyGame,
	L.IdLineType, L.VisitorOdds, L.HomeOdds, L.TotalOver, L.OverOdds,
	L.TotalUnder, L.UnderOdds, L.VisitorSpread, L.VisitorSpreadOdds,
	L.HomeSpread, L.HomeSpreadOdds, L.VisitorSpecial, L.VisitorSpecialOdds,
	L.HomeSpecial, L.HomeSpecialOdds, 	
	L.BoldSpread, L.BoldTotal, L.BoldML, G.HasChildren, G.IdEvent,
	@bitZero HideGame, @bitZero HideSpread, @bitZero HideTotal, @bitZero HideMoneyLine, P.PeriodDescription, 
	G.Description as GameDescription, GL.Description as GameLangDescription, 
	CASE WHEN LGL.[Description] IS NULL THEN LG.[Description] ELSE LGL.[Description] END AS LeagueLangDescription, 
	row_number() OVER (ORDER BY G.VisitorNumber),0
	FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
	LEFT OUTER JOIN GameValues L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdLineType = @prmIdLineType AND L.HideGame = 0
	LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLV WITH (NOLOCK) ON G.IdTeamVisitor = TLV.IdTeam AND TLV.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLH WITH (NOLOCK) ON G.IdTeamHome = TLH.IdTeam AND TLH.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN League LG WITH (NOLOCK) ON G.IdLeague = LG.IdLeague
	LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
	WHERE G.GameStat = 'O'
	  AND G.Graded = 0
	  AND G.Online = 1
	  AND G.IdGame IN (SELECT * FROM dbo.VZ_fnSplitString(@prmIdGames))
	  AND G.GameDateTime > GETDATE()

	UNION

	SELECT 1, G.IdGame, 
		G.VisitorTeam, G.HomeTeam, 
		LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,
		CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)),
		G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,
		G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
		G.NormalGame, G.ParentGame, G.FamilyGame,
		@prmIdLineType IdLineType, L.VisitorOdds, L.HomeOdds, L.TotalOver, L.OverOdds,
		L.TotalUnder, L.UnderOdds, L.VisitorSpread, L.VisitorSpreadOdds,
		L.HomeSpread, L.HomeSpreadOdds, L.VisitorSpecial, L.VisitorSpecialOdds,
		L.HomeSpecial, L.HomeSpecialOdds, 	
		@bitZero BoldSpread, @bitZero BoldTotal, @bitZero BoldML, G.HasChildren, G.IdEvent,
		L.HideGame, L.HideSpread, L.HideTotal, L.HideMoneyLine, P.PeriodDescription, 
		G.Description as GameDescription, GL.Description as GameLangDescription,
		CASE WHEN LGL.[Description] IS NULL THEN LG.[Description] ELSE LGL.[Description] END AS LeagueLangDescription, 
		row_number() OVER (ORDER BY G.VisitorNumber),0
	FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
							  LEFT OUTER JOIN GameLang GL WITH(NOLOCK) on G.IdGame = GL.IdGame and GL.IdLanguage = @prmIdLanguage
							  LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
							  LEFT OUTER JOIN League LG WITH (NOLOCK) ON G.IdLeague = LG.IdLeague
	JOIN GameValuesByAgent L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdAgent = @prmIdAgent
	WHERE G.GameStat = 'O'
	  AND G.Graded = 0
	  AND G.Online = 1
	  AND G.IdGame IN (SELECT * FROM dbo.VZ_fnSplitString(@prmIdGames))
	  AND G.GameDateTime > GETDATE()  
	  AND L.HideGame = 0

	--ORDER BY CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)), G.VisitorNumber
	ORDER BY 8, 10, 2, 1
	
SELECT tbl.*
	,(SELECT TOP 1 WRD.IdWebRow 
		FROM WebRowDetail WRD With(NoLock)
		JOIN WebColumnDetail WCD With(NoLock) ON WRD.IdWebRow = WCD.IdWebRow
		JOIN Book B With(NoLock) ON WCD.IdWebColumn = B.IdWebColumn AND B.IdBook = @prmIdBook
		WHERE tbl.IdLeague = WRD.IdLeague) AS IdWebRow
	,(SELECT G.GameDateTime 
	FROM Game G WITH (NOLOCK) 
	WHERE G.IdGame = tbl.FamilyGame
	) AS GameDateTimeMain
	,(
	SELECT b.home_image_id
	FROM [MOVER].[dbo].[Games] a
	INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
	WHERE a.DGS_game_id = tbl.IdGame) home_image_id
	,(
	SELECT b.away_image_id
	FROM [MOVER].[dbo].[Games] a
	INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
	WHERE a.DGS_game_id = tbl.IdGame) away_image_id
	,((SELECT count( DISTINCT G.IdGame) c_games 
		FROM Game G WITH (NOLOCK) 
		WHERE G.FamilyGame = tbl.FamilyGame
		AND G.IdSport <> 'PROP' 
		AND G.FamilyGame IS NOT NULL
		AND G.FamilyGame <> G.IdGame
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
		)) count_games

 FROM #tblMainGames AS tbl WITH(NOLOCK)
ORDER BY ParentGame, ChildOrder, IdGame, FromAgent--8, 10, 2, 1ParentGame, ParentOrder, ChildOrder


