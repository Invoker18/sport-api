USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetGameTNTOdds]    Script Date: 4/12/2024 10:13:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: May 08 2024
-- Description:	[VZ_GetGameTNTOdds]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetGameTNTOdds]
	@prmIdGame int,
	@prmIdLineType int,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT      
		(SELECT COUNT(GTNT.TeamNumber) From GameTNT GTNT With(NoLock) WHERE GTNT.IdGame = GT.IdGame GROUP BY GTNT.IdGame) AS NumTeams,        
		ISNULL(CAST(GT.TeamNumber AS Varchar),'') AS TeamNumber,        
		ISNULL(CAST(GT.TeamName As nVarchar(100)),'') AS TeamName,        
		ISNULL(CAST(GTL.TeamName As nVarchar(100)),'') AS TeamNameLang,        
		ISNULL(CAST(GTPA.Odds AS Varchar),'') AS Odds        
	FROM GameTNT GT WITH (NOLOCK)   
	LEFT JOIN GameTNTPropAction GTPA WITH (NOLOCK) ON (GT.IdGame = GTPA.IdGame AND GT.TeamNumber = GTPA.TeamNumber AND GTPA.IdLineType = @prmIdLinetype)   
	LEFT JOIN GameTNTLang GTL WITH (NOLOCK) ON GTPA.IdGame = GTL.IdGame AND GTPA.TeamNumber = GTL.TeamNumber AND GTL.IdLanguage = @prmIdLanguage 
	WHERE GT.IdGame = @prmIdGame
    ORDER BY TeamNumber ASC  

END
GO
            