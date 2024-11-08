USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetGameLineByPlayerId]    Script Date: 11/7/2024 10:11:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Nov 01 2024
-- Description:	[VZ_GetGameLineByPlayerId]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetGameLineByPlayerId]	
	@prmIdPlayer char(5),
	@prmIdGame	 int,
	@prmPlay	 int
 
AS

	IF EXISTS (SELECT 1 FROM Game WITH(NOLOCK) WHERE IdGame=@prmIdGame AND (IdSport = 'PROP' OR IdSport = 'TNT'))

		SELECT L.Odds, 0 Points
		FROM GameTNTPROPAction L WITH (NOLOCK) 
		WHERE L.IdGame = @prmIdGame 
		AND L.IdLineType = (SELECT P.IdLineType FROM  dbo.Player P WITH (NOLOCK) WHERE P.IdPlayer = @prmIdPlayer) 
		AND L.TeamNumber = @prmPlay
	ELSE		
    	SELECT  
		
		CASE WHEN @prmPlay = 0 THEN ISNULL(L.VisitorSpreadOdds,L.VisitorSpecialOdds)
		     WHEN @prmPlay = 1 THEN ISNULL(L.HomeSpreadOdds,L.HomeSpecialOdds)
		     WHEN @prmPlay = 2 THEN L.OverOdds
		     WHEN @prmPlay = 3 THEN L.UnderOdds
		     WHEN @prmPlay = 4 THEN L.VisitorOdds
		     WHEN @prmPlay = 5 THEN L.HomeOdds
		     WHEN @prmPlay = 6 THEN L.VisitorSpecialOdds
		     WHEN @prmPlay = 7 THEN L.VisitorSpecialOdds
		     WHEN @prmPlay = 8 THEN L.HomeSpecialOdds
		END
		AS Odds,
		CASE WHEN @prmPlay = 0 THEN ISNULL(L.VisitorSpread,L.VisitorSpecial)
		     WHEN @prmPlay = 1 THEN ISNULL(L.HomeSpread,L.HomeSpecial)
		     WHEN @prmPlay = 2 THEN (L.TotalOver)*-1
		     WHEN @prmPlay = 3 THEN L.TotalUnder
		     WHEN @prmPlay = 4 THEN 0
		     WHEN @prmPlay = 5 THEN 0
		     WHEN @prmPlay = 6 THEN 0
		     WHEN @prmPlay = 7 THEN L.VisitorSpecial
		     WHEN @prmPlay = 8 THEN L.HomeSpecial
		END
		AS Points
		
		FROM GameValues L WITH (NOLOCK) 
		WHERE L.IdGame = @prmIdGame 
		AND L.IdLineType = (SELECT P.IdLineType FROM  dbo.Player P WITH (NOLOCK) WHERE P.IdPlayer = @prmIdPlayer) 

