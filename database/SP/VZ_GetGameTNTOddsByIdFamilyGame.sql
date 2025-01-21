USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetGameTNTOddsByIdFamilyGame]    Script Date: 1/21/2025 10:10:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: May 08 2024
-- Description:	[VZ_GetGameTNTOddsByIdFamilyGame]
-- =============================================
ALTER PROCEDURE [dbo].[VZ_GetGameTNTOddsByIdFamilyGame]
	@prmIdFamilyGame int,
	@prmIdLineType int,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT      
		GT.IdGame,
		(SELECT COUNT(GTNT.TeamNumber) From GameTNT GTNT With(NoLock) WHERE GTNT.IdGame = GT.IdGame GROUP BY GTNT.IdGame) AS NumTeams,        
		ISNULL(CAST(GT.TeamNumber AS Varchar),'') AS TeamNumber,        
		ISNULL(CAST(GT.TeamName As nVarchar(100)),'') AS TeamName,        
		ISNULL(CAST(GTL.TeamName As nVarchar(100)),'') AS TeamNameLang,        
		ISNULL(CAST(GTPA.Odds AS Varchar),'') AS Odds        
	FROM GameTNT GT WITH (NOLOCK) 
	INNER JOIN Game G WITH (NOLOCK) ON G.IdGame = GT.IdGame
	LEFT JOIN GameTNTPropAction GTPA WITH (NOLOCK) ON (GT.IdGame = GTPA.IdGame AND GT.TeamNumber = GTPA.TeamNumber AND GTPA.IdLineType = @prmIdLinetype)   
	LEFT JOIN GameTNTLang GTL WITH (NOLOCK) ON GTPA.IdGame = GTL.IdGame AND GTPA.TeamNumber = GTL.TeamNumber AND GTL.IdLanguage = @prmIdLanguage 
	WHERE 
	G.FamilyGame = @prmIdFamilyGame
	AND G.IdSport = 'TNT'
	AND G.GameStat = 'O'
	AND G.Graded = 0
	AND G.Online = 1
	AND G.GameDateTime > GETDATE()
	AND GTPA.HideGame = 0
	AND GT.Result = 255
    ORDER BY TeamNumber ASC  

END
