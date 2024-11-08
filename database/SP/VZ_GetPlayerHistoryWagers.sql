USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetPlayerHistoryWagers]    Script Date: 11/7/2024 09:58:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Nov 01 2024
-- Description:	[VZ_GetPlayerHistoryWagers]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetPlayerHistoryWagers]
	@prmIdPlayer int,
	@prmStartDate datetime,
	@prmEndDate	datetime
  
AS

SET NOCOUNT ON

CREATE TABLE #tmpHistory
(
	IdWager						int, 
	PhoneLine					smallint, 
	PlacedDate					datetime,					
	CompleteDescription			varchar(100), 
	CompleteDescriptionLang		varchar(100), 
	RiskAmount					money, 
	WinAmount					money,  
	IfBetWagerType				tinyint,
	Result						tinyint, 
	IfParent					int, 
	IfChild						int, 
	SettledDate					datetime, 
	TicketNumber				int,
	WagerType					tinyint, 
	IP							varchar(100),
	OriginalRiskAmount			money, 
	OriginalWinAmount			money, 
	OriginalWagerAmount			money, 

	LoginName					varchar(15), 
	TransactionType				char(1), 
	Amount						money, 
	TaxAmount					money, 
	IdPlayerAccounting			int,

	IdWagerDetail				int, 
	IdGame						int, 
	IdSport						varchar(5), 
	GameDateTime				datetime, 
	IsPastPost					bit,
	DetailDescription			nvarchar(255), 
	DetailDescriptionLang		nvarchar(255), 
	DetailResult				tinyint,
	Play						int, 
	ShortGame					bit, 
	PitcherChange				bit,

	IdEvent						smallint, 
	EventDesc					varchar(50),
	ResultDesc                  varchar(50), 
	DetailResultDesc            varchar(50) 
)

	INSERT INTO #tmpHistory(IdWager, PhoneLine, PlacedDate, CompleteDescription, CompleteDescriptionLang, RiskAmount, WinAmount, IfBetWagerType,
						    Result, IfParent, IfChild, SettledDate, TicketNumber, WagerType, IP, OriginalRiskAmount, OriginalWinAmount, OriginalWagerAmount,
						    LoginName, TransactionType, Amount, TaxAmount, IdPlayerAccounting, IdWagerDetail, IdGame, IdSport, GameDateTime,
						    IsPastPost, DetailDescription, DetailDescriptionLang, DetailResult, Play, ShortGame, PitcherChange, IdEvent, EventDesc,
							ResultDesc, DetailResultDesc)
	SELECT 
		GradedWagerHeader.IdWager, 
		GradedWagerHeader.PhoneLine, 
		GradedWagerHeader.PlacedDate, 
		GradedWagerHeader.CompleteDescription, 
		GradedWagerHeader.[Description] AS CompleteDescriptionLang, 
		GradedWagerHeader.RiskAmount, 
		GradedWagerHeader.WinAmount,  
		GradedWagerHeader.IfBetWagerType,
		GradedWagerHeader.Result, 
		GradedWagerHeader.IfParent, 
		GradedWagerHeader.IfChild, 
		GradedWagerHeader.SettledDate, 
		GradedWagerHeader.TicketNumber,
		GradedWagerHeader.WagerType, 
		GradedWagerHeader.IP,	
	
		GradedWagerHeader.OriginalRiskAmount, 
		GradedWagerHeader.OriginalWinAmount, 
		GradedWagerHeader.OriginalWagerAmount, 

		Users.LoginName, 
		PlayerAccounting.TransactionType, 
		PlayerAccounting.Amount, 
		PlayerAccounting.TaxAmount, 
		PlayerAccounting.IdPlayerAccounting,

		GradedWagerDetail.IdWagerDetail, 
		ISNULL(GradedWagerDetail.IdGame,0) AS IdGame, 
		LTRIM(RTRIM(GradedWagerDetail.IdSport)) AS IdSport, 
		GradedWagerDetail.GameDateTime, 
		GradedWagerDetail.IsPastPost,
		GradedWagerDetail.CompleteDescription AS DetailDescription, 
		GradedWagerDetail.[Description] AS DetailDescriptionLang, 
		GradedWagerDetail.Result AS DetailResult,
		GradedWagerDetail.Play, 
		GradedWagerDetail.ShortGame, 
		GradedWagerDetail.PitcherChange,

		[Event].IdEvent, [Event].[Description] AS EventDesc,

		case when GradedWagerHeader.Result = 255 then 'PEND'
		     when GradedWagerHeader.Result = 0 then 'LOSE'
		     when GradedWagerHeader.Result = 1 then 'WIN'
		     when GradedWagerHeader.Result = 2 then 'PUSH'
		     when GradedWagerHeader.Result = 3 then 'NO BET'
		     when GradedWagerHeader.Result = 4 then 'N/A'
		     when GradedWagerHeader.Result = 5 then 'N/A PITCHER'
		     when GradedWagerHeader.Result = 6 then 'N/A CANCEL'
		     when GradedWagerHeader.Result = 7 then 'N/A SHORT'
		     when GradedWagerHeader.Result = 8 then 'N/A VOID'
		     when GradedWagerHeader.Result = 9 then 'WIN BY 1/4'
		     when GradedWagerHeader.Result = 10 then 'LOSE BY 1/4'
		     when GradedWagerHeader.Result = 11 then 'WIN BY 1/2'
		     when GradedWagerHeader.Result = 12 then 'LOSE BY 1/2' end
		as ResultDesc,
		case when GradedWagerDetail.Result = 255 then 'PEND'
		     when GradedWagerDetail.Result = 0 then 'LOSE'
		     when GradedWagerDetail.Result = 1 then 'WIN'
		     when GradedWagerDetail.Result = 2 then 'PUSH'
		     when GradedWagerDetail.Result = 3 then 'NO BET'
		     when GradedWagerDetail.Result = 4 then 'N/A'
		     when GradedWagerDetail.Result = 5 then 'N/A PITCHER'
		     when GradedWagerDetail.Result = 6 then 'N/A CANCEL'
		     when GradedWagerDetail.Result = 7 then 'N/A SHORT'
		     when GradedWagerDetail.Result = 8 then 'N/A VOID'
		     when GradedWagerDetail.Result = 9 then 'WIN BY 1/4'
		     when GradedWagerDetail.Result = 10 then 'LOSE BY 1/4'
		     when GradedWagerDetail.Result = 11 then 'WIN BY 1/2'
		     when GradedWagerDetail.Result = 12 then 'LOSE BY 1/2' end
		as DetailResultDesc

	FROM dbo.PlayerAccounting WITH(NOLOCK), 
			dbo.GradedWagerDetail WITH(NOLOCK) 
				LEFT JOIN dbo.Event WITH(NOLOCK) ON(GradedWagerDetail.IdEvent = [Event].IdEvent), 
			dbo.GradedWagerHeader WITH(NOLOCK) 
				LEFT JOIN dbo.Users WITH(NOLOCK) ON(GradedWagerHeader.IdUser = Users.IdUser)
	WHERE PlayerAccounting.IdTransaction = GradedWagerHeader.IdWager AND GradedWagerHeader.IdWager = GradedWagerDetail.IdWager AND
		(PlayerAccounting.TransactionType = 'W' OR PlayerAccounting.TransactionType = 'I' OR PlayerAccounting.TransactionType = 'O') AND
		PlayerAccounting.IdPlayer = @prmIdPlayer AND
		PlayerAccounting.LastModification >= @prmStartDate AND 
		PlayerAccounting.LastModification < (@prmEndDate + 1)
	ORDER BY GradedWagerHeader.SettledDate, PlayerAccounting.IdPlayerAccounting, GradedWagerHeader.IdWager, GradedWagerDetail.IdWagerDetail
		

	SELECT 
		#tmpHistory.*,
		GAME.Description as GameDescription, 
		GameLang.Description as GameLangDescription,
		ISNULL(GAME.HomeScore,GRADEDGAME.HomeScore) AS HomeScore,
		ISNULL(GAME.VisitorScore,GRADEDGAME.HomeScore) AS VisitorScore,
		ISNULL(GAME.Period,GRADEDGAME.HomeScore) AS Period
	FROM #tmpHistory 
		 LEFT OUTER JOIN GAME WITH(NOLOCK) ON #tmpHistory.IdGame = GAME.IdGame
		 LEFT OUTER JOIN GRADEDGAME WITH(NOLOCK) ON #tmpHistory.IdGame = GRADEDGAME.IdGame
		 LEFT OUTER JOIN GameLang WITH(NOLOCK) ON GameLang.IdGame = #tmpHistory.IdGame AND
												  GameLang.IdLanguage = (SELECT IdLanguage FROM PLAYER WITH(NOLOCK) WHERE IdPlayer = @prmIdPlayer)
	ORDER BY #tmpHistory.SettledDate, #tmpHistory.IdPlayerAccounting, #tmpHistory.IdWager, #tmpHistory.IdWagerDetail

