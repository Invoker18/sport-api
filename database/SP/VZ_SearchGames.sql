USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_SearchGames]    Script Date: 11/14/2024 14:21:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Nov 08 2024
-- Description:	[VZ_SearchGames]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_SearchGames]
    @prmSearch varchar(255),
	@prmIdBook smallint,
	@prmIdLineType smallint,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	DECLARE @SEARCH NVARCHAR(4000) = '%' + @prmSearch + '%'

	SELECT DISTINCT
		G.IdGame, 
		G.IdLeague, 
	    G.FamilyGame,
		G.GameDateTime, 
		LTRIM(RTRIM(G.IdSport)) as IdSport, 
		CASE WHEN G.VisitorTeam IS NULL THEN TLV.Name ELSE G.VisitorTeam END AS VisitorTeam,
		CASE WHEN G.HomeTeam IS NULL THEN TLH.Name ELSE G.HomeTeam END AS HomeTeam,
		GL.VisitorTeam AS GameLangVisitorTeam, 
		GL.HomeTeam AS GameLangHomeTeam,
		CASE WHEN GL.[Description] IS NULL THEN G.[Description] ELSE GL.[Description] END AS GameLangDescription,
		CASE WHEN LGL.[Description] IS NULL THEN LG.[Description] ELSE LGL.[Description] END AS LeagueLangDescription,
		WRD.IdWebRow
		,(
			SELECT b.home_image_id
			FROM [MOVER].[dbo].[Games] a
			INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
			WHERE a.DGS_game_id = G.IdGame) home_image_id
		,(
			SELECT b.away_image_id
			FROM [MOVER].[dbo].[Games] a
			INNER JOIN [MOVER].[dbo].[Bet365Results] b on a.external_event_id = b.bet365_id
			WHERE a.DGS_game_id = G.IdGame) away_image_id
	FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = 0
	JOIN GameValues GV With(NOLOCK) ON G.IdGame = GV.IdGame AND GV.IdLineType = @prmIdLineType
	JOIN League LG WITH (NOLOCK) ON G.IdLeague = LG.IdLeague
	JOIN WebRowDetail WRD  WITH (NOLOCK) ON G.IdLeague = WRD.IdLeague 
	JOIN WebColumnDetail WCD With(NOLOCK) ON WCD.IdWebRow = WRD.IdWebRow
	JOIN Book B With(NOLOCK) ON B.IdWebColumn = WCD.IdWebColumn AND B.IdBook = @prmIdBook
	LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLV WITH (NOLOCK) ON G.IdTeamVisitor = TLV.IdTeam AND TLV.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLH WITH (NOLOCK) ON G.IdTeamHome = TLH.IdTeam AND TLH.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
	WHERE G.Online = 1 
		AND G.GameStat = 'O'
		AND G.GameDateTime > GETDATE()
		AND G.IdEvent IS NULL
		AND G.IdSport NOT IN ('TNT', 'PROPS')
		AND G.IdGame = G.FamilyGame
		AND (
		G.VisitorTeam COLLATE Latin1_General_CI_AI LIKE @SEARCH  
		OR G.HomeTeam COLLATE Latin1_General_CI_AI LIKE @SEARCH  
		OR TLV.Name COLLATE Latin1_General_CI_AI LIKE @SEARCH 
		OR TLH.Name COLLATE Latin1_General_CI_AI LIKE @SEARCH  
		OR GL.VisitorTeam COLLATE Latin1_General_CI_AI LIKE @SEARCH  
		OR GL.HomeTeam COLLATE Latin1_General_CI_AI LIKE @SEARCH 
		OR GL.[Description] COLLATE Latin1_General_CI_AI LIKE @SEARCH 
		OR G.[Description] COLLATE Latin1_General_CI_AI LIKE @SEARCH 
		)

END
