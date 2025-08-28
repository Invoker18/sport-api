USE [DGSDATA]
GO
/****** Object:  UserDefinedFunction [dbo].[VZ_fnSplitString]    Script Date: 8/28/2025 2:45:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[VZ_fnSplitString] ( @stringToSplit NVARCHAR(MAX))
RETURNS
@returnList TABLE ([Name] [nvarchar] (500))
AS
BEGIN

 DECLARE @value int
 DECLARE @pos INT

 WHILE CHARINDEX(',', @stringToSplit) > 0
 BEGIN
  SELECT @pos  = CHARINDEX(',', @stringToSplit)  
  SELECT @value = SUBSTRING(@stringToSplit, 1, @pos-1)

  INSERT INTO @returnList 
  SELECT @value

  SELECT @stringToSplit = SUBSTRING(@stringToSplit, @pos+1, LEN(@stringToSplit)-@pos)
 END

 INSERT INTO @returnList
 SELECT @stringToSplit

 RETURN
END
