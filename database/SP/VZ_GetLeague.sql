USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetLeague]    Script Date: 11/7/2024 10:15:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: May 06 2024
-- Description:	[VZ_GetLeague]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetLeague]
	@prmIdLeague int,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT 	L.IDLeagueRegion, 
			L.IdLeague, 
			L.LeagueOrder, 
			LTRIM(RTRIM(L.IdSport)) as IdSport,
			L.[Description], 
			L.ShortDescription,
			L.TeamFKRequired,
			LRL.[Description] as RegionDescription,
			CASE WHEN LL.[Description] IS NULL THEN L.[Description] ELSE LL.[Description] END AS LeagueDescription
	FROM League L With(NoLock)
	LEFT JOIN LeagueLang LL with(nolock) ON L.IdLeague=LL.IdLeague AND LL.IdLanguage=@prmIdLanguage
	LEFT JOIN LeagueRegionLang LRL with(nolock) ON L.IDLeagueRegion=LRL.IDLeagueRegion AND LRL.IdLanguage=@prmIdLanguage
	WHERE  L.IdLeague = @prmIdLeague


END
