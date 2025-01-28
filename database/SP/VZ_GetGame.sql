USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetGame]    Script Date: 1/28/2025 12:35:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Jun 20 2024
-- Description:	[VZ_GetGame]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetGame]
	@prmIdBook int,
	@prmIdGame int,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT G.IdGame,  LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,
	G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,
	G.Hookups, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
	G.NormalGame, G.ParentGame, G.FamilyGame,
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
	P.PeriodDescription
	,(SELECT TOP 1 WRD.IdWebRow 
		FROM WebRowDetail WRD With(NoLock)
		JOIN WebColumnDetail WCD With(NoLock) ON WRD.IdWebRow = WCD.IdWebRow
		JOIN Book B With(NoLock) ON WCD.IdWebColumn = B.IdWebColumn AND B.IdBook = @prmIdBook
		WHERE G.IdLeague = WRD.IdLeague) AS IdWebRow
	,LG.IDLeagueRegion
	,LG.LeagueOrder 
	,LG.ShortDescription
	,LRL.[Description] as RegionDescription
	,G.Description as GameDescription, GL.Description as GameLangDescription 
	,CASE WHEN LGL.[Description] IS NULL THEN LG.[Description] ELSE LGL.[Description] END AS LeagueLangDescription
	,(
		SELECT b.home_image_id
		FROM [MOVER].[dbo].[Games] a
		INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
		WHERE a.DGS_game_id = G.IdGame) home_image_id
	,(
		SELECT b.away_image_id
		FROM [MOVER].[dbo].[Games] a
		INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
		WHERE a.DGS_game_id = G.IdGame) away_image_id,
	((SELECT count( DISTINCT G2.IdGame) c_games 
		FROM Game G2 WITH (NOLOCK) 
		WHERE G2.FamilyGame = G.FamilyGame
		AND G2.IdSport <> 'PROP' 
		AND G2.FamilyGame IS NOT NULL
		AND G2.FamilyGame <> G2.IdGame
		AND G2.GameStat = 'O'
		AND G2.Graded = 0
		AND G2.Online = 1
		AND G2.GameDateTime > GETDATE() 
		)+
		(SELECT count( DISTINCT G2.IdGame) c_games 
		FROM Game G2 WITH (NOLOCK) 
		WHERE G2.FamilyGame = G.FamilyGame 
		AND G2.ParentGame = G2.IdGame
		AND G2.IdSport = 'PROP' 
		AND G2.FamilyGame IS NOT NULL
		AND G2.GameStat = 'O'
		AND G2.Graded = 0
		AND G2.Online = 1
		AND G2.GameDateTime > GETDATE() 
		)) count_games 
	FROM Game G WITH (NOLOCK) 
	INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
	LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLV WITH (NOLOCK) ON G.IdTeamVisitor = TLV.IdTeam AND TLV.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLH WITH (NOLOCK) ON G.IdTeamHome = TLH.IdTeam AND TLH.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN League LG WITH (NOLOCK) ON G.IdLeague = LG.IdLeague
	LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN LeagueRegionLang LRL with(nolock) ON LG.IDLeagueRegion=LRL.IDLeagueRegion AND LRL.IdLanguage=@prmIdLanguage
	WHERE G.IdGame = @prmIdGame 


END