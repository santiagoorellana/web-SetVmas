USE [setDB]
GO

INSERT INTO [dbo].[TipoOpciones]
           ([Nombre]
           ,[NombreCodigo]
           ,[TextoLabel]
           ,[Precio]
           ,[CantidadFrecuencia]
           ,[MinimoComprar])
     VALUES
           ('Autorrenovable 3 horas'
           ,'AUTO_3'
           ,'Autorrenovable 3 horas'
           ,10
           ,10
           ,0)
GO

INSERT INTO [dbo].[TipoOpciones]
           ([Nombre]
           ,[NombreCodigo]
           ,[TextoLabel]
           ,[Precio]
           ,[CantidadFrecuencia]
           ,[MinimoComprar])
     VALUES
           ('Autorrenovable 30 minutos'
           ,'AUTO_30'
           ,'Autorrenovable 30 minutos'
           ,10
           ,10
           ,0)
GO


