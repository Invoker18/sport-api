USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetGame]    Script Date: 6/6/2024 14:25:34 ******/
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
	@prmIdGame int,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT G.IdGame, G.VisitorTeam, G.HomeTeam, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague, G.IdGameType,
	G.GameDateTime, G.VisitorNumber, G.HomeNumber, G.GameStat, G.Graded,
	G.Hookups, G.VisitorPitcher, G.HomePitcher, G.PitcherChanged,
	G.NormalGame, G.ParentGame, G.FamilyGame,
	TLV.Name AS TeamLangVisitorTeam, TLH.Name AS TeamLangHomeTeam,
	GL.VisitorTeam AS GameLangVisitorTeam, GL.HomeTeam AS GameLangHomeTeam,
	P.PeriodDescription, 
	G.Description as GameDescription, GL.Description as GameLangDescription, 
	CASE WHEN LGL.[Description] IS NULL THEN LG.[Description] ELSE LGL.[Description] END AS LeagueLangDescription
	FROM Game G WITH (NOLOCK) INNER JOIN Period P WITH (NOLOCK) ON G.IdSport = P.IdSport AND G.Period = P.NumberOfPeriod
	LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLV WITH (NOLOCK) ON G.IdTeamVisitor = TLV.IdTeam AND TLV.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN TeamLang TLH WITH (NOLOCK) ON G.IdTeamHome = TLH.IdTeam AND TLH.IdLanguage = @prmIdLanguage
	LEFT OUTER JOIN League LG WITH (NOLOCK) ON G.IdLeague = LG.IdLeague
	LEFT OUTER JOIN LeagueLang LGL WITH (NOLOCK) ON G.IdLeague = LGL.IdLeague AND LGL.IdLanguage = @prmIdLanguage
	WHERE G.IdGame = @prmIdGame 


END
