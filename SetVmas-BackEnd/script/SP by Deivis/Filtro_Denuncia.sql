USE [setDB]
GO

/****** Object:  StoredProcedure [dbo].[Filtro_Denuncia]    Script Date: 9/7/2020 22:13:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


---- ===================================================================================== ----
-- Este script debe ser ejecutado en la base de datos del cliente
---- ===================================================================================== ----
-- Módulo				:  PlanillasRH
-- Sub-módulo			: Procesos Nomina
-- Opción				: Recepción de archivos
-- Cliente				: Quarzo
---- ===================================================================================== ----
-- Detalle				: Procedimiento almacenado para recibir archivo.
--
-- Autor.....			: Deivis (@SanPanda)- para Ingenius
-- Creación..			: 
-- Modificado			: 22/06/2017
-- Modificado por		: 
-- Parámetros			: 
---- ===================================================================================== ----
ALTER PROCEDURE [dbo].[Filtro_Denuncia]
(
@col varchar(100),
@estado varchar(100),
@antiguedad varchar(100),
@anuncio varchar(100),
@usuario varchar(100),
@codigo varchar(100),
@sortDirection varchar(100),
@pagina int,
@cantPagina int,
@rol varchar(100)
)
AS 
BEGIN


  CREATE TABLE #cur_denuncias (id INT IDENTITY(1,1) Primary Key,
	                            DenunciaId int, Estado varchar (max), FechaCreacion datetime, FechaModificacion datetime,
								MotivoDenunciaId int,Motivo varchar (max),UsuarioId int,Usuario varchar (max),
								AnuncioId int, Anuncio varchar (max),BannerId int, Codigo varchar(max)
								)


	---------Met Proceso----------------
	DECLARE @filtro nvarchar(max), @primer int, @consulta nvarchar(max), @now nvarchar(max)
	 SET @consulta ='SELECT DenunciaId, d.Estado, d.FechaCreacion, d.FechaModificacion, d.MotivoDenunciaId, m.Nombre,
	 d.UsuarioId, u.Correo, d.AnuncioId, a.Titulo, d.BannerId, u.Codigo
	 FROM Denuncias as d 
	 INNER JOIN Anuncios as a ON d.AnuncioId = a.AnuncioId
	 INNER JOIN MotivoDenuncia as m ON d.MotivoDenunciaId = m.MotivoDenunciaId
	 INNER JOIN Usuario as u ON d.UsuarioId = u.UsuarioId'

	SET @primer = 0
	SET @filtro= ''
	Set @now=GETDATE()



	 if @rol = 'Clasificador'
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'd.Estado LIKE ''Sin Clasificar'' '
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND d.Estado LIKE ''Sin Clasificar'' '
	   END
	 END 

	 if @estado <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'd.Estado LIKE '''+''+@estado+''+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND d.Estado LIKE '''+''+@estado+''+''''
	   END
	 END 

	
	if @anuncio <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'a.Titulo LIKE '''+'%'+@anuncio+'%'+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND a.Titulo LIKE '''+'%'+@anuncio+'%'+''''
	   END
	 END 


	  if @antiguedad <> '' and @antiguedad <> '0'
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'DATEDIFF(day, d.FechaCreacion,'''+@now+''')='''+@antiguedad+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	       SET @filtro =@filtro+' AND DATEDIFF(day, d.FechaCreacion,'''+@now+''')='''+@antiguedad+''''
	   END
	 END 

	 

	   if @usuario <> '' and @usuario <> '0'
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'u.UsuarioId='''+@usuario+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	       SET @filtro =@filtro+' AND u.UsuarioId='''+@usuario+''''
	   END
	 END 

	  if @codigo <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'u.Codigo LIKE '''+''+@codigo+''+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND u.Codigo LIKE '''+''+@codigo+''+''''
	   END
	 END 


		IF @filtro <> ''
		 BEGIN
		  SET @consulta = @consulta +' WHERE '+ @filtro
		 END
		 ELSE
	   BEGIN
	       SET @consulta = @consulta
	   END	






	 INSERT INTO #cur_denuncias  ( DenunciaId, Estado, FechaCreacion, FechaModificacion,
								MotivoDenunciaId, Motivo,UsuarioId, Usuario,AnuncioId, Anuncio,BannerId,Codigo)
		 EXEC sp_executesql @consulta
	
	   

		 if @sortDirection='desc'
		 begin
			--SELECT * FROM (
			--SELECT ROW_NUMBER()Over(ORDER BY @col desc) as RowNum, DenunciaId, Estado, FechaCreacion, FechaModificacion,
			--							MotivoDenunciaId, Nombre,UsuarioId, Correo,AnuncioId, Titulo,BannerId FROM #cur_denuncias

		 --  )as resultado WHERE RowNum BETWEEN (@pagina -1) * @cantPagina + 1 AND @pagina * @cantPagina
		set @consulta='SELECT * FROM (
			SELECT ROW_NUMBER()Over(ORDER BY '+@col+' desc) as RowNum, DenunciaId, Estado, FechaCreacion, FechaModificacion,
										MotivoDenunciaId, Motivo,UsuarioId, Usuario,AnuncioId, Anuncio,BannerId, Codigo FROM #cur_denuncias

		   )as resultado WHERE RowNum BETWEEN '+CONVERT(varchar(10),((@pagina -1) * @cantPagina + 1))+' and '+CONVERT(varchar(10),(@pagina * @cantPagina))
		end
		else
		begin
		--SELECT * FROM (
		--	SELECT ROW_NUMBER()Over(ORDER BY @col) as RowNum, DenunciaId, Estado, FechaCreacion, FechaModificacion,
		--								MotivoDenunciaId, Nombre,UsuarioId, Correo,AnuncioId, Titulo,BannerId FROM #cur_denuncias

		--   )as resultado WHERE RowNum BETWEEN (@pagina -1) * @cantPagina + 1 AND @pagina * @cantPagina
			set @consulta='SELECT * FROM (
			SELECT ROW_NUMBER()Over(ORDER BY '+@col+') as RowNum, DenunciaId, Estado, FechaCreacion, FechaModificacion,
										MotivoDenunciaId, Motivo,UsuarioId, Usuario,AnuncioId, Anuncio,BannerId, Codigo FROM #cur_denuncias

		   )as resultado WHERE RowNum BETWEEN '+CONVERT(varchar(10),((@pagina -1) * @cantPagina + 1))+' and '+CONVERT(varchar(10),(@pagina * @cantPagina))

		end
	-----Fin Met Proceso-----------
	 EXEC sp_executesql @consulta

	
	END
GO


