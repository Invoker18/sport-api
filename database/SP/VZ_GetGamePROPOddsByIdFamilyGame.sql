USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetGamePROPOddsByIdFamilyGame]    Script Date: 11/7/2024 10:14:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: May 08 2024
-- Description:	[VZ_GetGamePROPOddsByIdFamilyGame]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetGamePROPOddsByIdFamilyGame]
	@prmIdFamilyGame int,
	@prmIdLineType int,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT      
		G.IdGame,        
		ISNULL(CAST(G.HomeNumber AS Varchar),'') AS TeamNumber,        
		ISNULL(CAST(G.HomeTeam As nVarchar(100)),'') AS TeamName,        
		'' AS TeamNameLang,        
		ISNULL(CAST(GTPA.Odds AS Varchar),'') AS Odds        
	FROM Game G WITH (NOLOCK)   
	LEFT JOIN GameTNTPropAction GTPA WITH (NOLOCK) ON (G.IdGame = GTPA.IdGame AND GTPA.IdLineType = @prmIdLinetype)   
	WHERE 
	G.GameStat = 'O'
	AND G.Graded = 0
	AND G.Online = 1
	AND G.IdSport = 'PROP'
	AND G.GameDateTime > GETDATE()
	AND GTPA.HideGame = 0
	AND G.FamilyGame = @prmIdFamilyGame
	ORDER BY TeamNumber  

END
