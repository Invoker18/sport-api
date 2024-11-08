USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetPlayerHistoryTransac]   Script Date: 11/8/2024 10:25:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Nov 8 2024
-- Description:	[VZ_GetPlayerHistoryTransac]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetPlayerHistoryTransac]
	@prmIdPlayer	int,
	@prmStartDate	datetime,
	@prmEndDate	datetime
  AS

SET NOCOUNT ON

	Select 
		Users.LoginName, 
		IsNull(PlayerTransaction.LastModification,PlayerAccounting.LastModification) as TransactionDate,
		PlayerAccounting.[Description], 
		PlayerAccounting.TransactionType, 
		CASE WHEN PlayerAccounting.TransactionType = 'R' THEN 'DEPOSIT'
		     WHEN PlayerAccounting.TransactionType = 'D' THEN 'DISBURSMENT'
		     WHEN PlayerAccounting.TransactionType = 'A' THEN 'ADJUSTMENT'
		     WHEN PlayerAccounting.TransactionType = 'K' THEN 'CASINO'
		     WHEN PlayerAccounting.TransactionType = 'H' THEN 'HORSES ADJUSTMENT'
		     WHEN PlayerAccounting.TransactionType = 'W' THEN 'WAGER'
		     WHEN PlayerAccounting.TransactionType = 'I' THEN 'IFCHILD'
		     WHEN PlayerAccounting.TransactionType = 'O' THEN 'HORSE WAGER'
		END
		AS TransactionTypeDesc,
		PlayerAccounting.IdTransaction, 
		PlayerAccounting.Amount, 
		PlayerAccounting.TaxAmount, 
		PlayerAccounting.LastModification, 
		PlayerAccounting.IdPlayerAccounting
	
	From dbo.PlayerAccounting WITH (NOLOCK)
		LEFT JOIN dbo.PlayerTransaction WITH (NOLOCK) On(PlayerAccounting.IdTransaction = PlayerTransaction.IdTransaction)
		LEFT JOIN dbo.Users WITH (NOLOCK) On(PlayerAccounting.LastModificationUser = Users.IdUser)
	Where 
		(PlayerAccounting.TransactionType <> 'W') and (PlayerAccounting.TransactionType <> 'I') and (PlayerAccounting.TransactionType <> 'O') and
		(PlayerAccounting.IdPlayer = @prmIdPlayer) and
		(PlayerAccounting.LastModification >= @prmStartDate) and 
		(PlayerAccounting.LastModification < (@prmEndDate + 1))
	Order by PlayerAccounting.LastModification, PlayerAccounting.IdPlayerAccounting

SET NOCOUNT OFF

