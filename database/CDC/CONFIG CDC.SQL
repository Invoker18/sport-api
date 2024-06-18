ALTER DATABASE [DGSDATA] SET ALLOW_SNAPSHOT_ISOLATION ON
ALTER DATABASE [DGSDATA] SET READ_COMMITTED_SNAPSHOT ON

USE [DGSDATA]
GO
--SQL  Queries to implement CDC

--MAKE YOUR USER OWNER OF DATABASE

EXEC sp_changedbowner 'sa'

--ENABLE CHANGE DATA TRACKING

EXEC sys.sp_cdc_enable_db

/** si hubo cambio de server name

exec sp_dropserver "WIN-I4G9EV5B90U"
exec sp_addserver "DGS-DB01", local

SELECT srvname AS OldName FROM master.dbo.sysservers
SELECT SERVERPROPERTY('ServerName') AS NewName

EXEC [sys].[sp_cdc_add_job] @job_type = N'capture';
EXEC [sys].[sp_cdc_add_job] @job_type = N'cleanup'; 

ALTER DATABASE DGSDATA SET ANSI_NULL_DEFAULT ON; 
*/

--CHECK WEATHER CDC IS ENABLED OR NOT

SELECT name, is_cdc_enabled FROM sys.databases
-- Enable CDC on a specific table

EXEC sys.sp_cdc_enable_table

@source_schema = 'dbo',

@source_name = 'GAMEVALUES',

@role_name = NULL,

-- @captured_column_list = N'column list',

@supports_net_changes = 1



-- Check that CDC is enabled in the table

EXECUTE sys.sp_cdc_help_change_data_capture

@source_schema = 'dbo',

@source_name = 'GAMEVALUES';

GO


--Check current Change Tracking Version Number
SELECT CHANGE_TRACKING_CURRENT_VERSION(); 
GO

--SHOW ACCOUNTS TABLE

SELECT * FROM GAMEVALUES


SELECT '[' + s.name + '].[' + t.name + ']' AS Table_name
  FROM sys.change_tracking_tables tr
INNER JOIN sys.tables t on t.object_id = tr.object_id
INNER JOIN sys.schemas s on s.schema_id = t.schema_id



-- CHANGE TRACKING TABLE

SELECT * FROM [DGSDATA].[cdc].[dbo_GAMEVALUES_CT];

SELECT    name AS object_name   
        ,SCHEMA_NAME(schema_id) AS schema_name  
        ,type_desc  
        ,is_ms_shipped  
FROM sys.objects 
WHERE is_ms_shipped= 1 AND SCHEMA_NAME(schema_id) = 'cdc'





/**
NOTA DEBE ESTA CORRIENDO EL SQL Server Agent
**/
