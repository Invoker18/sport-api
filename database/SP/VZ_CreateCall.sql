USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_CreateCall]    Script Date: 4/3/2024 10:13:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Apr 04 2024
-- Description:	[VZ_CreateCall]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_CreateCall]
	@prmIdPlayer int,
	@prmIP varchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON
 	DECLARE @p6 int;

	EXEC CreateCall @IdPlayer=@prmIdPlayer, @PhoneLine=-1, @IdUser=0, @IP = @prmIP, @System='I', @IdCall=@p6 output, @URL=''
    
	SELECT IdCall = @p6;

END
GO