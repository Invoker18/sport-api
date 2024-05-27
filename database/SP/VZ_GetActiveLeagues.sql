USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetActiveLeagues]    Script Date: 4/3/2024 10:13:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Apr 03 2024
-- Description:	[VZ_GetActiveLeagues]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetActiveLeagues]
	@prmIdBook smallint,
	@prmIdLineType smallint,	
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	CREATE TABLE #TempLeague 
		(
			IDLeagueRegion smallint, 
			IdLeague smallint, 
			IdWebRow int, 
			ColumnOrder int, 
			RowOrder int, 
			LeagueOrder smallint, 
			RegionOrder smallint,
			RowDescription varchar (50), 
			IdSport varchar(5), 
			LeagueDescription varchar(50), 
			RegionDescription varchar(50)
		)

	INSERT INTO #TempLeague
	(IDLeagueRegion, IdLeague, IdWebRow, ColumnOrder, RowOrder, LeagueOrder, RegionOrder, RowDescription, IdSport, LeagueDescription, RegionDescription)
		SELECT 	LR.IDLeagueRegion, 
				L.IdLeague, 
				WR.IdWebRow, 
				WCD.ColumnOrder, 
				WRD.RowOrder, 
				L.LeagueOrder, 
				LR.RegionOrder, 
				WR.Description, 
				LTRIM(RTRIM(L.IdSport)) as IdSport,
				L.[Description], 
				LR.[Description] as RegionDescription
		FROM Book B With(NoLock)
		JOIN WebColumn WC With(NoLock) ON B.IdWebColumn = WC.IdWebColumn AND B.IdBook = @prmIdBook
		JOIN WebColumnDetail WCD With(NoLock) ON WC.IdWebColumn = WCD.IdWebColumn
		JOIN WebRow WR With(NoLock) ON WR.IdWebRow = WCD.IdWebRow
		JOIN WebRowDetail WRD With(NoLock) ON WRD.IdWebRow = WR.IdWebRow
		JOIN League L With(NoLock) ON L.IdLeague = WRD.IdLeague	
		JOIN LeagueRegion LR With(NoLock) ON L.IDLeagueRegion = LR.IDLeagueRegion
		GROUP BY L.IdLeague, L.LeagueOrder,  WCD.ColumnOrder, WRD.RowOrder, LR.RegionOrder, WR.[Description],  LR.[Description], L.IdSport, L.[Description], WR.IdWebRow, LR.IDLeagueRegion
		ORDER BY WCD.ColumnOrder, WRD.RowOrder, LR.RegionOrder, L.LeagueOrder

	SELECT  LG.IdLeague, 
			LG.ColumnOrder, 
			CASE WHEN LG.RowDescriptionLang IS NULL THEN LG.RowDescription ELSE LG.RowDescriptionLang END as RowDescription,
			LG.RowOrder, 
			LG.LeagueOrder, 
			CASE WHEN LG.LeagueDescriptionLang IS NULL THEN LG.LeagueDescription ELSE LG.LeagueDescriptionLang END as LeagueDescription,
			LG.IdSport, 
			LG.IdWebRow, 
			CASE WHEN LG.RegionDescriptionLang IS NULL THEN LG.RegionDescription ELSE LG.RegionDescriptionLang END as RegionDescription,
			LG.IDLeagueRegion, 
			SUM(LG.Games) as GameCount 
	FROM (
		SELECT  G.IdLeague, 
				L.ColumnOrder, 
				L.RowDescription,
				WL.Description AS RowDescriptionLang,
				L.RowOrder, 
				L.LeagueOrder, 
				L.LeagueDescription,
				LL.Description AS LeagueDescriptionLang,
				LTRIM(RTRIM(L.IdSport)) as IdSport,
				L.IdWebRow, 
				L.RegionDescription,
				LRL.Description AS RegionDescriptionLang,
				L.IDLeagueRegion, 
				COUNT(G.IdGame) Games
		FROM Game G With(NoLock)
		JOIN GameValues GV With(NoLock) ON G.IdGame = GV.IdGame AND GV.IdLineType = @prmIdLineType
		JOIN #TempLeague L With(NoLock) ON G.IdLeague = L.IdLeague
		LEFT JOIN WebRowLang WL with(nolock) ON L.IdWebRow=WL.IdWebRow AND WL.IdLanguage=@prmIdLanguage
		LEFT JOIN LeagueLang LL with(nolock) ON L.IdLeague=LL.IdLeague AND LL.IdLanguage=@prmIdLanguage
		LEFT JOIN LeagueRegionLang LRL with(nolock) ON L.IDLeagueRegion=LRL.IDLeagueRegion AND LRL.IdLanguage=@prmIdLanguage
		WHERE G.Online = 1 
		AND G.GameStat = 'O'
		AND G.GameDateTime > GETDATE()
		AND G.IdEvent IS NULL
		GROUP BY G.IdLeague, 
			 	L.ColumnOrder, 
				L.RowDescription,
				WL.Description ,
				L.RowOrder, 
				L.LeagueOrder, 
				L.LeagueDescription,
				LL.Description,
				L.IdSport, 
				L.IdWebRow, 
				L.RegionDescription,
				LRL.Description,
			 	L.IDLeagueRegion 
			
		UNION	
			
		SELECT  G.IdLeague, 
				L.ColumnOrder, 
				L.RowDescription,
				WL.Description AS RowDescriptionLang,
				L.RowOrder, 
				L.LeagueOrder, 
				L.LeagueDescription,
				LL.Description AS LeagueDescriptionLang,
				LTRIM(RTRIM(L.IdSport)) as IdSport,
				L.IdWebRow, 
				L.RegionDescription,
				LRL.Description AS RegionDescriptionLang,
				L.IDLeagueRegion, 
				COUNT(G.IdGame) Games
		FROM Game G With(NoLock)
		JOIN GameTNTPropAction P With(NoLock) ON G.IdGame = P.IdGame AND P.IdLineType = @prmIdLineType 
		JOIN #TempLeague L With(NoLock) ON G.IdLeague = L.IdLeague
		LEFT JOIN WebRowLang WL with(nolock) ON L.IdWebRow=WL.IdWebRow AND WL.IdLanguage=@prmIdLanguage
		LEFT JOIN LeagueLang LL with(nolock) ON L.IdLeague=LL.IdLeague AND LL.IdLanguage=@prmIdLanguage
		LEFT JOIN LeagueRegionLang LRL with(nolock) ON L.IDLeagueRegion=LRL.IDLeagueRegion AND LRL.IdLanguage=@prmIdLanguage
		WHERE G.Online = 1 
		AND G.GameStat = 'O'
		AND G.GameDateTime > GETDATE()
		AND G.IdEvent IS NULL
		GROUP BY G.IdLeague, 
			 	L.ColumnOrder, 
				L.RowDescription,
				WL.Description ,
				L.RowOrder, 
				L.LeagueOrder, 
				L.LeagueDescription,
				LL.Description,
				L.IdSport, 
				L.IdWebRow, 
				L.RegionDescription,
				LRL.Description,
			 	L.IDLeagueRegion 
	) LG
	GROUP BY LG.IdLeague, 
			 LG.ColumnOrder, 
			 LG.RowDescription,
			 LG.RowDescriptionLang,
			 LG.RowOrder, 
			 LG.LeagueOrder, 
			 LG.LeagueDescription, 
			 LG.LeagueDescriptionLang, 
			 LG.IdSport, 
			 LG.IdWebRow, 
			 LG.RegionDescription,
			 LG.RegionDescriptionLang,
			 LG.IDLeagueRegion 
	ORDER BY 2,4,5

END
GO
            