USE [setDB]
GO

UPDATE [dbo].[Categoria]
   SET [Imagen] = ''
      ,[ImageContent] = ''
 WHERE CategoriaId<>0
GO


