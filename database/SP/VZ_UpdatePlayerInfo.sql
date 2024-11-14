USE [DGSDATA]
GO
/****** Object:  StoredProcedure [dbo].[VZ_UpdatePlayerInfo]    Script Date: 11/12/2024 08:57:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexander De Sousa
-- Create date: Nov 12 2024
-- Description:	[VZ_UpdatePlayerInfo]
-- =============================================
CREATE PROCEDURE [dbo].[VZ_UpdatePlayerInfo]
	@IdPlayer 	  INT,
	@Password	  VARCHAR(20),
	@NewPassword  VARCHAR(20),
	@Name		  NVARCHAR(20),
	@LastName	  NVARCHAR(20),
	@LastName2	  NVARCHAR(20),
	@Title		  VARCHAR(10),
	@Address1	  NVARCHAR(50),
	@Address2	  NVARCHAR(50),
	@City		  NVARCHAR(20),
	@State		  NVARCHAR(20),
	@Country	  VARCHAR(30),
	@Zip		  VARCHAR(15),
	@Phone		  VARCHAR(15),
	@Fax		  VARCHAR(15),
	@Email		  VARCHAR(50),
	@CultureInfo  VARCHAR(12),
	@LineStyle    CHAR(1),
	@IdTimeZone   INT,
	@IdLanguage   INT
 
AS
DECLARE @IdLanguageCI INT

SET NOCOUNT ON

 IF NOT EXISTS(SELECT IdPlayer FROM Player WITH(NOLOCK) WHERE IdPlayer = @IdPlayer AND OnlinePassword=@Password) BEGIN Select 0  AS 'return'  END

 IF @NewPassword <> '' 
	UPDATE Player SET OnlinePassword = @NewPassword WHERE IdPlayer = @IdPlayer

 IF @Name <> '' 
	UPDATE Player SET Name = @Name WHERE IdPlayer = @IdPlayer

 IF @LastName <> '' 
	UPDATE Player SET LastName = @LastName WHERE IdPlayer = @IdPlayer
 
 IF @LastName2 <> '' 
	UPDATE Player SET LastName2 = @LastName2 WHERE IdPlayer = @IdPlayer

 IF @Title <> '' 
	UPDATE Player SET Title = @Title WHERE IdPlayer = @IdPlayer

 IF @Address1 <> '' 
	UPDATE Player SET Address1 = @Address1 WHERE IdPlayer = @IdPlayer

 IF @Address2 <> '' 
	UPDATE Player SET Address2 = @Address2 WHERE IdPlayer = @IdPlayer

 IF @City <> '' 
	UPDATE Player SET City = @City WHERE IdPlayer = @IdPlayer

 IF @State <> '' 
	UPDATE Player SET State = @State WHERE IdPlayer = @IdPlayer

 IF @Country <> '' 
	UPDATE Player SET Country = @Country WHERE IdPlayer = @IdPlayer

 IF @Zip <> '' 
	UPDATE Player SET Zip = @Zip WHERE IdPlayer = @IdPlayer

 IF @Phone <> '' 
	UPDATE Player SET Phone = @Phone WHERE IdPlayer = @IdPlayer

 IF @Fax <> '' 
	UPDATE Player SET Fax = @Fax WHERE IdPlayer = @IdPlayer

 IF @Email <> '' 
	UPDATE Player SET Email = @Email WHERE IdPlayer = @IdPlayer

 IF @CultureInfo <> '' BEGIN
	SELECT @IdLanguageCI = IdLanguage From Language WHERE CultureInfo = @CultureInfo
	IF ISNULL(@IdLanguageCI,-1) <> -1 BEGIN	
		UPDATE Player SET IdLanguage = @IdLanguageCI WHERE IdPlayer = @IdPlayer
	END
 END

IF @LineStyle <> '' 
	UPDATE Player SET LineStyle = @LineStyle WHERE IdPlayer = @IdPlayer

IF @IdTimeZone <> '' 
	UPDATE Player SET IdTimeZone = @IdTimeZone WHERE IdPlayer = @IdPlayer

IF @IdLanguage <> '' 
	UPDATE Player SET IdLanguage = @IdLanguage WHERE IdPlayer = @IdPlayer

 Select 1 AS 'return' 
