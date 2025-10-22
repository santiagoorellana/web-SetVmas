USE [setDB]
GO

/****** Object:  StoredProcedure [dbo].[USP_ListarAnuncios]    Script Date: 23/9/2020 19:44:05 ******/
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
ALTER PROCEDURE [dbo].[USP_ListarAnuncios]
(
@col varchar(100), 
@titulo varchar(100),
@rol varchar(100),
@antiguedad varchar(100), --tipo opcion
@renovacion varchar(100), -- categoria
@sortDirection varchar(100),
@pagina int,
@cantPagina int
)
AS 
BEGIN


  CREATE TABLE #cur_anuncio(id INT IDENTITY(1,1) Primary Key,
                                       AnuncioId numeric (18,0), Titulo varchar (max), Descripcion varchar (max), NombreContacto varchar (max),
									    TelefonoContacto varchar (max), CorreoContacto varchar (max), Precio decimal(18,4),
	                                    IsActivo bit, IsVisible bit, FechaCreacion datetime, FechaModificacion datetime, ImageContent varchar (max),
										ImageMimeType varchar (max), ImageName varchar (max),Url varchar (max), Provincia varchar (max), Municipio varchar (max),
										ContadorView int, ProductoNuevo bit, Accion  varchar (max), UsuarioId  varchar (max),Rol varchar (max),Codigo varchar (max)
								)



	---------Met Proceso----------------
	DECLARE @filtro nvarchar(max), @primer int, @consulta nvarchar(max), @now nvarchar(max), @JOIN nvarchar(max)=' '
	 SET @consulta ='SELECT DISTINCT a.AnuncioId, Titulo, Descripcion, NombreContacto, TelefonoContacto, CorreoContacto, a.Precio,
	                                   a.IsActivo, IsVisible, a.FechaCreacion, a.FechaModificacion, a.ImageContent, a.ImageMimeType, a.ImageName,
									   a.Url, a.Provincia, a.Municipio, ContadorView, ProductoNuevo, Accion, a.UsuarioId,
									   u.Rol, u.Codigo FROM Anuncios a  
									   INNER JOIN Usuario u ON a.UsuarioId = u.UsuarioId'


	SET @primer = 0
	SET @filtro= ''
	Set @now=GETDATE()

	 if @titulo <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'Titulo LIKE '''+'%'+@titulo+'%'+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND Titulo LIKE '''+'%'+@titulo+'%'+''''
	   END
	 END 

	
	if @rol <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'u.Rol LIKE '''+'%'+@rol+'%'+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND u.Rol LIKE '''+'%'+@rol+'%'+''''
	   END
	 END 


	  if @antiguedad <> '' and @antiguedad <> '0'
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @JOIN= @JOIN + 'INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId =a.AnuncioId '
	     SET @filtro = 'oa.TipoOpcionId = '+@antiguedad
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	   SET @JOIN= @JOIN + 'INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId =a.AnuncioId '
	       SET @filtro =@filtro+' AND oa.TipoOpcionId = '+@antiguedad
	   END
	 END 

	  if @renovacion <> '' and @renovacion <> '0'
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @JOIN= @JOIN + ' INNER JOIN AnuncioEtiquetas ae ON ae.AnuncioId=a.AnuncioId
									   INNER JOIN Etiqueta e ON e.EtiquetaId=ae.EtiquetaId
									   INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId= e.EtiquetaId
									   INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId '

	     SET @filtro = 'c.CategoriaId= '+@renovacion
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	    SET @JOIN= @JOIN + ' INNER JOIN AnuncioEtiquetas ae ON ae.AnuncioId=a.AnuncioId
									   INNER JOIN Etiqueta e ON e.EtiquetaId=ae.EtiquetaId
									   INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId= e.EtiquetaId
									   INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId '

	       SET @filtro =@filtro+' AND c.CategoriaId= '+@renovacion
	   END
	 END 

		IF @filtro <> ''
		 BEGIN
		  SET @consulta = @consulta +@JOIN+' WHERE a.IsVisible=1 AND '+ @filtro
		 END
		 ELSE
	   BEGIN
	       SET @consulta = @consulta
	   END
	    DECLARE @cantidadTotal int=0	
	   	    INSERT INTO #cur_anuncio  (   AnuncioId, Titulo, Descripcion, NombreContacto,TelefonoContacto, CorreoContacto, Precio,
	                                    IsActivo, IsVisible, FechaCreacion, FechaModificacion, ImageContent, ImageMimeType,
										ImageName,Url, Provincia, Municipio,ContadorView, ProductoNuevo, Accion, UsuarioId,Rol, Codigo
							)


		 EXEC sp_executesql @consulta
			
		 SELECT @cantidadTotal=@@ROWCOUNT 
	-------Fin Met Proceso-----------
	if @sortDirection='desc'
	begin
			--SELECT * FROM (
			--	SELECT ROW_NUMBER()Over(ORDER BY FechaCreacion) as RowNum, AnuncioId, Titulo, Descripcion, NombreContacto,TelefonoContacto, CorreoContacto, Precio,
			--										IsActivo, IsVisible, FechaCreacion, FechaModificacion, ImageContent,
			--										ImageMimeType, ImageName,Url, Provincia, Municipio,ContadorView, ProductoNuevo, Accion, UsuarioId,Rol FROM #cur_anuncio 

			--  )as resultado WHERE RowNum BETWEEN (@pagina -1) * @cantPagina + 1 AND @pagina * @cantPagina
	set @consulta='SELECT * FROM (
			SELECT ROW_NUMBER()Over(ORDER BY '+@col+' desc) as RowNum,'+convert(varchar(20),@cantidadTotal)+' as TOTAL, AnuncioId, Titulo, Descripcion, NombreContacto,TelefonoContacto, CorreoContacto, Precio,
													IsActivo, IsVisible, FechaCreacion, FechaModificacion, ImageContent,
													ImageMimeType, ImageName,Url, Provincia, Municipio,ContadorView, ProductoNuevo, Accion, UsuarioId,Rol FROM #cur_anuncio 
		   )as resultado WHERE RowNum BETWEEN '+CONVERT(varchar(10),((@pagina -1) * @cantPagina + 1))+' and '+CONVERT(varchar(10),(@pagina * @cantPagina))

	end
	else
	begin
	set @consulta='SELECT * FROM (
			SELECT ROW_NUMBER()Over(ORDER BY '+@col+') as RowNum,'+convert(varchar(20),@cantidadTotal)+' as TOTAL, AnuncioId, Titulo, Descripcion, NombreContacto,TelefonoContacto, CorreoContacto, Precio,
													IsActivo, IsVisible, FechaCreacion, FechaModificacion, ImageContent,
													ImageMimeType, ImageName,Url, Provincia, Municipio,ContadorView, ProductoNuevo, Accion, UsuarioId,Rol FROM #cur_anuncio 
		   )as resultado WHERE RowNum BETWEEN '+CONVERT(varchar(10),((@pagina -1) * @cantPagina + 1))+' and '+CONVERT(varchar(10),(@pagina * @cantPagina))


	end
	
	 EXEC sp_executesql @consulta
	
	END
GO


