USE [setDB]
GO

INSERT INTO [dbo].[VariableConfiguracion]
           ([Nombre]
           ,[NombreCodigo]
           ,[Valor]
           ,[Tipo])
     VALUES
           ('Tiempo (en d�as) de bloqueo por denuncia'
           ,'TIEMPO_BLOQUEO'
           ,'5'
           ,'General')
GO


