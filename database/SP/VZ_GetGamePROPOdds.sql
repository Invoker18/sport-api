USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetGamePROPOdds]    Script Date: 1/22/2025 10:22:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: May 08 2024
-- Description:	[VZ_GetGamePROPOdds]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetGamePROPOdds]
	@prmIdGame int,
	@prmIdLineType int,
	@prmIdLanguage tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT      
		G.IdGame,      
		G.ParentGame,  
		ISNULL(CAST(G.HomeNumber AS Varchar),'') AS TeamNumber,        
		ISNULL(CAST(G.HomeTeam As nVarchar(100)),'') AS TeamName,        
		'' AS TeamNameLang,        
		ISNULL(CAST(GTPA.Odds AS Varchar),'') AS Odds        
	FROM Game G WITH (NOLOCK)   
	LEFT JOIN GameTNTPropAction GTPA WITH (NOLOCK) ON (G.IdGame = GTPA.IdGame AND GTPA.IdLineType = @prmIdLinetype AND GTPA.HideGame = 0)   
	WHERE G.ParentGame = @prmIdGame
	ORDER BY TeamNumber  

END
