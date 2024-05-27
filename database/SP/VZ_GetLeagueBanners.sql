USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetLeagueBanners]    Script Date: 4/12/2024 10:13:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: May 06 2024
-- Description:	[VZ_GetLeagueBanners]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetLeagueBanners]
	@IdLeague smallint,
	@IdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT G.IdGame, G.VisitorTeam, G.HomeTeam, G.ParentGame, LTRIM(RTRIM(G.IdSport)) as IdSport, G.IdLeague,
		G.NormalGame, 
		G2.GameDateTime, IsNull(G2.VisitorNumber,G.VisitorNumber) AS VisitorNumber,
		BTL.Line1 AS TeamLangVisitorTeam, BTL.Line2 AS TeamLangHomeTeam,
		GL.VisitorTeam AS GameLangVisitorTeam, GL.HomeTeam AS GameLangHomeTeam
	FROM Game G WITH (NOLOCK)
	LEFT OUTER JOIN Game G2 WITH (NOLOCK) ON G.ParentGame = G2.IdGame
	LEFT OUTER JOIN GameLang GL WITH (NOLOCK) ON G.IdGame = GL.IdGame AND GL.IdLanguage = @IdLanguage
	LEFT OUTER JOIN BannerTypeLang BTL WITH (NOLOCK) ON G.IdBannerType = BTL.IdBannerType AND BTL.IdLanguage = @IdLanguage
	WHERE G.IdLeague = @IdLeague
	AND G.GameStat = 'B'
	AND G.Online = 1
	ORDER BY CONVERT(datetime, CONVERT(char(8), G2.GameDateTime, 112)), G2.VisitorNumber

END
GO
            