USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_GetOddsConversion]    Script Date: 4/12/2024 10:13:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: May 10 2024
-- Description:	[VZ_GetOddsConversion]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_GetOddsConversion]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON

	SELECT 
	    AmericanFormat American,
        CAST(DecimalFormat as DECIMAL(18,3)) Decimal,
        RTRIM(FractionalFormat) Fractional
	FROM SYSTEMODDSCONVERSION WITH(NOLOCK)

END
GO
            