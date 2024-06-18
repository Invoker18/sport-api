USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetOpenFamilyGames]    Script Date: 6/4/2024 12:47:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: MAY 06 2024
-- Description:	[VZ_GetOpenFamilyGames]
-- =============================================

CREATE PROCEDURE [dbo].[VZ_GetOpenFamilyGames]
	@prmIdFamilyGame int,
	@prmIdAgent int,
	@prmIdLineType int,
	@prmIdLanguage tinyint,
	@prmPeriod int
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
	IdSport				  char(5), 
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
	LeagueLangDescription nvarchar(510),
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
	LGL.Description as LeagueLangDescription, 
	row_number() OVER (ORDER BY G.VisitorNumber),0
	FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
	JOIN GameValues L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdLineType = @prmIdLineType
	LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLV WITH (NOLOCK) ON G.IdTeamVisitor = TLV.IdTeam AND TLV.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLH WITH (NOLOCK) ON G.IdTeamHome = TLH.IdTeam AND TLH.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
	WHERE G.GameStat = 'O'
	  AND G.Graded = 0
	  AND G.Online = 1
	  AND G.FamilyGame = @prmIdFamilyGame
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
		LGL.Description as LeagueLangDescription,
		row_number() OVER (ORDER BY G.VisitorNumber),0
	FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
							  LEFT OUTER JOIN GameLang GL WITH(NOLOCK) on G.IdGame = GL.IdGame and GL.IdLanguage = @prmIdLanguage
							  LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
	JOIN GameValuesByAgent L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdAgent = @prmIdAgent
	WHERE G.GameStat = 'O'
	  AND G.Graded = 0
	  AND G.Online = 1
	  AND G.FamilyGame = @prmIdFamilyGame
	  AND G.GameDateTime > GETDATE()  
	  --AND L.HideGame = 0

	--ORDER BY CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)), G.VisitorNumber
	ORDER BY 8, 10, 2, 1
	
	


	DECLARE GetEventsForGame_Cursor CURSOR FOR
		SELECT Game.IdGame,LTRIM(RTRIM(Game.IdSport)) as IdSport, ParentOrder FROM Game WITH(NOLOCK) LEFT JOIN #tblMainGames on Game.ParentGame = #tblMainGames.IdGame
		WHERE 
			Game.ParentGame in (SELECT Distinct(IdGame) FROM #tblMainGames) AND 
			Game.IdGame not in (SELECT Distinct(IdGame) FROM #tblMainGames)
		ORDER BY Game.IdGame
	
	OPEN GetEventsForGame_Cursor
	FETCH NEXT FROM GetEventsForGame_Cursor
	INTO @Main_IdGame, @Main_IdSport, @Main_ParentOrder
	
	WHILE @@FETCH_STATUS = 0
	BEGIN
		
		IF(LTRIM(RTRIM(@Main_IdSport)) = 'TNT')
		BEGIN
			INSERT INTO #tblMainGames
				SELECT 0 as AgentLine, G.IdGame, G.VisitorTeam, G.HomeTeam, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106))as FixedDate,
					   G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,G.NormalGame, G.ParentGame, G.FamilyGame,
					   L.IdLineType, L.Odds,L.Odds,null,T.TeamNumber,null,null,null,null,null,null,null,null,null,null,0,0,L.BoldML, G.HasChildren,G.IdEvent ,GTL.TeamName AS TeamLangVisitorTeam, 
					   null AS TeamLangHomeTeam,null AS GameLangVisitorTeam,GL.VisitorTeam  AS GameLangHomeTeam,@bitZero HideGame,0,0,0,T.TeamName,G.Description as GameDescription, GL.Description as GameLangDescription, 
					   LGL.Description as LeagueLangDescription, @Main_ParentOrder,@Order
				FROM Game G WITH (NOLOCK)
				JOIN GameTNT T WITH (NOLOCK) ON G.IdGame = T.IdGame
				JOIN GameTNTPROPAction L WITH (NOLOCK) ON T.IdGame = L.IdGame AND T.TeamNumber = L.TeamNumber AND L.IdLineType = @prmIdLineType
				LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN GameTNTLang GTL WITH (NOLOCK) ON T.IdGame = GTL.IdGame 
					AND T.TeamNumber = GTL.TeamNumber AND GTL.IdLanguage = @prmIdLanguage
				WHERE G.GameStat = 'O'
				  AND G.Graded = 0
				  AND G.Online = 1
				  AND G.IdSport = 'TNT'
				  AND G.GameDateTime > GETDATE()
				  AND L.HideGame = 0
				  AND T.Result = 255	
				  AND G.IdGame = @Main_IdGame

				UNION

				SELECT 1 as AgentLine, G.IdGame, G.VisitorTeam, G.HomeTeam, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106))as FixedDate,
					   G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,G.NormalGame, G.ParentGame, G.FamilyGame,
					   @prmIdLineType IdLineType, L.Odds,L.Odds,null,T.TeamNumber,null,null,null,null,null,null,null,null,null,null,0,0,@bitZero BoldML, G.HasChildren,G.IdEvent ,GTL.TeamName AS TeamLangVisitorTeam, 
					   null AS TeamLangHomeTeam,null AS GameLangVisitorTeam,GL.VisitorTeam  AS GameLangHomeTeam,@bitZero HideGame,0,0,0,T.TeamName,G.Description as GameDescription, GL.Description as GameLangDescription,
					   LGL.Description as LeagueLangDescription, @Main_ParentOrder,@Order
				FROM Game G WITH (NOLOCK)
				JOIN GameTNT T WITH (NOLOCK) ON G.IdGame = T.IdGame
				JOIN GameTNTPROPByAgent L WITH (NOLOCK) ON T.IdGame = L.IdGame AND T.TeamNumber = L.TeamNumber AND  L.IdAgent = @prmIdAgent	
				LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN GameTNTLang GTL WITH (NOLOCK) ON T.IdGame = GTL.IdGame AND T.TeamNumber = GTL.TeamNumber AND GTL.IdLanguage = @prmIdLanguage
				WHERE G.GameStat = 'O'
				  AND G.Graded = 0
				  AND G.Online = 1
				  AND G.IdSport = 'TNT'
				  AND G.GameDateTime > GETDATE()  
				  --AND L.HideGame = 0
				  AND T.Result = 255
				  AND G.IdGame = @Main_IdGame
				  
			    ORDER BY G.IdGame, T.TeamNumber
		END
		ELSE IF(LTRIM(RTRIM(@Main_IdSport)) = 'PROP')
		BEGIN
			INSERT INTO #tblMainGames
				SELECT 0, G.IdGame, G.VisitorTeam, G.HomeTeam, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType, CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)),
					   G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
					   G.NormalGame, G.ParentGame, G.FamilyGame,L.IdLineType, L.Odds, L.Odds,null,null,null,null,null,null,null,null,null,null,null,null,0,0,L.BoldML, G.HasChildren, G.IdEvent, 
					   null AS TeamLangVisitorTeam, null AS TeamLangHomeTeam,GL.VisitorTeam AS GameLangVisitorTeam, GL.HomeTeam AS GameLangHomeTeam, @bitZero HideGame,
					   0,0,0, 'Game' as PeriodDescription,G.Description as GameDescription, GL.Description as GameLangDescription, LGL.Description as LeagueLangDescription, @Main_ParentOrder,@Order
				FROM Game G WITH (NOLOCK)
				JOIN GameTNTPROPAction L WITH (NOLOCK) ON G.IdGame = L.IdGame AND L.IdLineType = @prmIdLineType
				LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
				WHERE G.GameStat = 'O'
				  AND G.Graded = 0
				  AND G.Online = 1
				  AND G.IdSport = 'PROP'
				  AND G.GameDateTime > GETDATE()
				  AND L.HideGame = 0
				  AND G.IdGame = @Main_IdGame

				UNION

				SELECT 1, G.IdGame, G.VisitorTeam, G.HomeTeam, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType, CONVERT(datetime, CONVERT(varchar(11), G.GameDateTime, 106)),
					   G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,G.Hookups, G.Period, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
					   G.NormalGame, G.ParentGame, G.FamilyGame,@prmIdLineType IdLineType, L.Odds, L.Odds,null,null,null,null,null,null,null,null,null,null,null,null,0,0,@bitZero BoldML, G.HasChildren, G.IdEvent, 
					   null AS TeamLangVisitorTeam, null AS TeamLangHomeTeam,GL.VisitorTeam AS GameLangVisitorTeam, GL.HomeTeam AS GameLangHomeTeam, @bitZero HideGame,
					   0,0,0, 'Game' as PeriodDescription,G.Description as GameDescription, GL.Description as GameLangDescription, LGL.Description as LeagueLangDescription, @Main_ParentOrder,@Order
				FROM Game G WITH (NOLOCK)
				JOIN GameTNTPROPByAgent L WITH (NOLOCK) ON G.IdGame = L.IdGame AND L.IdAgent = @prmIdAgent
				LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
				WHERE G.GameStat = 'O'
				  AND G.Graded = 0
				  AND G.Online = 1
				  AND G.IdSport = 'PROP'
				  AND G.GameDateTime > GETDATE()
				  --AND L.HideGame = 0
				  AND G.IdGame = @Main_IdGame
		END
		ELSE
		BEGIN
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
				LGL.Description as LeagueLangDescription,
				@Main_ParentOrder,@Order
				FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
				JOIN GameValues L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdLineType = @prmIdLineType
				LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN TeamLang TLV WITH (NOLOCK) ON G.IdTeamVisitor = TLV.IdTeam AND TLV.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN TeamLang TLH WITH (NOLOCK) ON G.IdTeamHome = TLH.IdTeam AND TLH.IdLanguage = @prmIdLanguage
				LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
				WHERE G.GameStat = 'O'
				  AND G.Graded = 0
				  AND G.Online = 1
				  AND G.GameDateTime > GETDATE()
				  AND L.HideGame = 0
				  AND G.IdGame = @Main_IdGame

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
					LGL.Description as LeagueLangDescription,
					@Main_ParentOrder,@Order
				FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
										  LEFT OUTER JOIN GameLang GL WITH(NOLOCK) on G.IdGame = GL.IdGame and GL.IdLanguage = @prmIdLanguage
										  LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
				JOIN GameValuesByAgent L  WITH (NOLOCK)ON G.IdGame = L.IdGame AND L.IdAgent = @prmIdAgent
				WHERE G.GameStat = 'O'
				  AND G.Graded = 0
				  AND G.Online = 1
				  AND G.GameDateTime > GETDATE()  
				  --AND L.HideGame = 0
				  AND G.IdGame = @Main_IdGame
		END
		
		SET @Order = @Order + 1
		
		FETCH NEXT FROM GetEventsForGame_Cursor
		INTO @Main_IdGame, @Main_IdSport, @Main_ParentOrder
	END
	
	CLOSE GetEventsForGame_Cursor
	DEALLOCATE GetEventsForGame_Cursor
	
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
WHERE a.DGS_game_id = tbl.IdGame) away_image_id
 FROM #tblMainGames AS tbl WITH(NOLOCK)
WHERE tbl.Period = @prmPeriod or @prmPeriod = -1
ORDER BY ParentGame, ChildOrder, IdGame, FromAgent--8, 10, 2, 1ParentGame, ParentOrder, ChildOrder

