USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetPlayerInfo]    Script Date: 9/19/2024 14:27:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Apr 04 2024
-- Description:	[VZ_GetPlayerInfo]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetPlayerInfo]
	@prmIdPlayer int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT 	P.Player, 
			P.IdPlayer, 
			P.IdBook, 
			P.IdOffice,
			P.IdAgent,  
			P.IdLineType, 
			CASE WHEN PP.AlternateEnable = 1 THEN PP.AlternateProfile ELSE P.IdProfile END IdProfile, 
			P.IdProfileLimits,	
			P.IdLanguage, 
			P.IdCurrency, 
			C.Symbol as CurrencySymbol, 
			C.Currency as Currency, 
			P.LineStyle,
			P.NHLLine, 
			P.MLBLine, 
			P.BonusPointsStatus, 
			P.OnlineMessage, 
			P.OnlineMinWager, 
			P.OnlineMaxWager, 
			PP.CLMaxWager,
			P.PitcherDefault, 
			P.DuplicatedBetsOnline, 
			P.FreePlayAmount, 
			P.EnableCards, 
			P.EnableSports, 
			P.EnableHorses, 
			P.HoldBets, 
			P.HoldDelay, 
			T.GMT, 
			L.CultureInfo, 
			P.Reset_Password, 
			(select EnforcePassRules from SYSTEMPREFERENCESMANAGER with(nolock)) as EnforcePassRules,
			P.OnlineAccess,
			P.Password,
			P.Status
	FROM dbo.Player P WITH (NOLOCK)
	JOIN dbo.Language L WITH (NOLOCK) ON P.IdLanguage = L.IdLanguage
	JOIN dbo.PlayerProfile PP WITH (NOLOCK) ON P.IdProfile = PP.IdProfile
	JOIN dbo.Currency C WITH (NOLOCK) ON P.IdCurrency = C.IdCurrency
	JOIN dbo.TimeZone T WITH (NOLOCK) ON T.IdTimeZone = P.IdTimeZone
	WHERE IdPlayer = @prmIdPlayer

END
