USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetActiveWebRow]    Script Date: 4/12/2024 10:13:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Apr 18 2024
-- Description:	[VZ_GetActiveWebRow]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetActiveWebRow]
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
				L.IdSport, 
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

	SELECT  LG.IdWebRow, 
			CASE WHEN LG.RowDescriptionLang IS NULL THEN LG.RowDescription ELSE LG.RowDescriptionLang END AS RowDescription,
			MIN(LG.RowOrder) AS RowOrder,
			SUM(LG.Games) AS GameCount,
			SUM(LG.Leagues) AS LeagueCount 
	FROM (
		SELECT  L.IdWebRow,
		        L.RowDescription,
				WL.Description AS RowDescriptionLang,
				L.RowOrder, 
				COUNT(distinct G.IdGame) Games,
				COUNT(distinct G.IdLeague) Leagues
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
		GROUP BY L.RowDescription,
				WL.Description,
				L.RowOrder, 
				L.IdWebRow
			
		UNION	
			
		SELECT  L.IdWebRow, 
				L.RowDescription,
				WL.Description AS RowDescriptionLang,
				L.RowOrder, 
				COUNT(distinct G.IdGame) Games,
				COUNT(distinct G.IdLeague) Leagues
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
		GROUP BY L.RowDescription,
				WL.Description ,
				L.RowOrder, 
				L.IdWebRow

	) LG
	GROUP BY 
			LG.IdWebRow, 
			LG.RowDescription,
			LG.RowDescriptionLang
	ORDER BY 3

END
GO
            