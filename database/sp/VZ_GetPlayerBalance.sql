USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetPlayerBalance]    Script Date: 4/3/2024 10:13:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Apr 03 2024
-- Description:	[VZ_GetPlayerBalance]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetPlayerBalance]
	@prmIdPlayer int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	DECLARE 
		@vTempCredit money,
		@vAmountAtRisk money,
		@vExpireDate datetime

	SELECT
		@vExpireDate = CAST(CONVERT(CHAR(10), TempCreditExpire, 110) AS datetime), 
		@vTempCredit = TempCredit
	FROM dbo.Player WITH(NOLOCK)
	WHERE IdPlayer = @prmIdPlayer

	IF (@vExpireDate < (GETDATE()-1))
		SET @vTempCredit = 0.0

	SELECT 
		@vAmountAtRisk = AmountAtRisk
	FROM dbo.PlayerStatistic WITH(NOLOCK)
	WHERE IdPlayer = @prmIdPlayer

	IF (@vAmountAtRisk < 0)
		SET @vAmountAtRisk = 0.0

	SELECT 
		PL.IdPlayer, 
		PL.Player, 
		PL.FreePlayAmount,
		(PL.CreditLimit + @vTempCredit) AS CreditLimit, 
		PLS.CurrentBalance, 
		PLS.AmountAtRisk, 
		PLS.AvailBalance, 
		(PL.CreditLimit + @vTempCredit + PLS.CurrentBalance - @vAmountAtRisk) AS RealAvailBalance,
		(ISNULL(PLS.ThisWeekSports + PLS.ThisWeekHorses + PLS.ThisWeekCasino, 0.0)) AS ThisWeek,
		(ISNULL(PLS.ThisWeekSports, 0.0)) AS ThisWeekSports,
		(ISNULL(PLS.ThisWeekHorses, 0.0)) AS ThisWeekHorses,
		(ISNULL(PLS.ThisWeekCasino, 0.0)) AS ThisWeekCasino,
		(ISNULL(PLS.LastWeekSports + PLS.LastWeekHorses + PLS.LastWeekCasino, 0.0)) AS LastWeek,
		(ISNULL(PLS.LastWeekSports, 0.0)) AS LastWeekSports,
		(ISNULL(PLS.LastWeekHorses, 0.0)) AS LastWeekHorses,
		(ISNULL(PLS.LastWeekCasino, 0.0)) AS LastWeekCasino,
		(ISNULL(PLS.BonusPoints, 0.0)) AS BonusPoints,
		PLS.LastWager	
	FROM dbo.Player PL WITH(NOLOCK) 
	JOIN dbo.PlayerStatistic PLS WITH(NOLOCK) ON(PL.IdPlayer = PLS.IdPlayer)
	WHERE PL.IdPlayer = @prmIdPlayer

END
GO
            