USE [setDB]
GO

/****** Object:  StoredProcedure [dbo].[Filtro_Usuario]    Script Date: 21/7/2020 20:46:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


---- ===================================================================================== ----
-- Este script debe ser ejecutado en la base de datos del cliente
---- ===================================================================================== ----
-- Cliente				: SetvMAS
---- ===================================================================================== ----
-- Detalle				: Procedimiento almacenado para recibir archivo.
--
-- Autor.....			: Deivis (@SanPanda)- para DOSSL
-- Creación..			: 
-- Modificado			: 22/04/2020
-- Modificado por		: 
-- Parámetros			: 
---- ===================================================================================== ----


ALTER PROCEDURE [dbo].[Filtro_Usuario]
(

@rol varchar (100),
@correo varchar(100),
@clase varchar(100),
@puntos varchar(100),
@diasInactividad varchar(100),
@fechaCreacion varchar(100),
@pagina int,
@cantPagina int	,
@col varchar(100),
@sortDirection varchar(100),
@codigo varchar(100)
)
AS 
BEGIN

  CREATE TABLE #cur_usuario (id INT IDENTITY(1,1) Primary Key,
								 UsuarioId numeric (18,0), Codigo varchar (max), Correo varchar (max), Password1 varchar (max), Rol varchar (max), Telefono varchar (max),
								  Activo bit, Bloqueado bit, Puntos decimal(18,4), FechaCreacion datetime2, FechaUltimaEntrada datetime2, Anfitrion varchar (max), ClasesUsuariosId int,
								  FechaUltimaView datetime2,FechaModificacion datetime2,FechaDesbloqueo datetime2,FechaUltimoAnuncio datetime2, Clase varchar (max)
								)


	---------Met Proceso----------------
	DECLARE @filtro nvarchar(max), @primer int, @consulta nvarchar(max), @now nvarchar(max)
	 SET @consulta ='SELECT UsuarioId, Codigo, Correo, Password, Rol, Telefono, Activo, Bloqueado, Puntos, FechaCreacion, 
	 FechaUltimaEntrada, Anfitrion, u.ClasesUsuariosId,FechaUltimaView,FechaModificacion,FechaDesbloqueo,
	 FechaUltimoAnuncio,c.Nombre 
	 FROM Usuario u
	 INNER JOIN ClasesUsuarios as c ON c.ClasesUsuariosId = u.ClasesUsuariosId'

	SET @primer = 0
	SET @filtro= ''
	Set @now=GETDATE()

	 if @correo <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'Correo LIKE '''+'%'+@correo+'%'+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND Correo LIKE '''+'%'+@correo+'%'+''''
	   END
	 END 

	  if @codigo <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'Codigo LIKE '''+'%'+@codigo+'%'+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	     SET @filtro =@filtro+' AND Codigo LIKE '''+'%'+@codigo+'%'+''''
	   END
	 END 

	if @rol <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'Rol LIKE '''+'%'+@rol+'%'+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	       SET @filtro =@filtro+' AND Rol LIKE '''+'%'+@rol+'%'+''''
	   END
	 END 

	 if @clase <> '' and @clase <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'u.ClasesUsuariosId='+@clase
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	       SET @filtro =@filtro+' AND u.ClasesUsuariosId='+@clase
	   END
	 END 


	 if @puntos <> '' and @puntos <> '0'
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'Puntos>='+@puntos
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	       SET @filtro =@filtro+' AND Puntos>='+@puntos
	   END
	 END 

	  if @diasInactividad <> '' and @diasInactividad <> '0'
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro = 'DATEDIFF(day, FechaUltimaEntrada,'''+@now+''')>='''+@diasInactividad+''' AND Activo=''false'''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	       SET @filtro =@filtro+' AND DATEDIFF(day, FechaUltimaEntrada,'''+@now+''')>='''+@diasInactividad+''''
	   END
	 END 

	  if @fechaCreacion <> ''
	 BEGIN
	  IF @primer = 0
	   BEGIN
	     SET @filtro ='FechaCreacion LIKE '''+'%'+@fechaCreacion+'%'+''''
		 SET @primer = @primer + 1
	   END
	   ELSE
	   BEGIN
	       SET @filtro =@filtro+' AND FechaCreacion LIKE '''+'%'+@fechaCreacion+'%'+''''
	   END
	 END 
		
		IF @filtro <> ''
		 BEGIN
		  SET @consulta = @consulta +' WHERE '+ @filtro+' AND Visible=1 and Correo <> ''invitado@gmail.com'''
		 END
		 ELSE
	   BEGIN
	       SET @consulta = @consulta +' WHERE Visible=1 and Correo <> ''invitado@gmail.com'''
	   END	
	    
	    INSERT INTO #cur_usuario  ( UsuarioId, Codigo, Correo, Password1, Rol, Telefono,
								  Activo, Bloqueado, Puntos, FechaCreacion, FechaUltimaEntrada, Anfitrion, ClasesUsuariosId,
								  FechaUltimaView,FechaModificacion,FechaDesbloqueo,FechaUltimoAnuncio,Clase
							)


		 EXEC sp_executesql @consulta
		
		 
		 --SELECT * FROM (
   -- SELECT ROW_NUMBER()Over(ORDER BY FechaCreacion) as RowNum, UsuarioId, Codigo, Correo, Password, Rol, Telefono,
			--					  Activo, Bloqueado, Puntos, FechaCreacion, FechaUltimaEntrada, Anfitrion, ClasesUsuariosId,
			--					  FechaUltimaView,FechaModificacion,FechaDesbloqueo,FechaUltimoAnuncio FROM #cur_usuario

   --)as resultado WHERE RowNum BETWEEN (@pagina -1) * @cantPagina + 1 AND @pagina * @cantPagina

         IF @col = 'ClasesUsuarios'
		 BEGIN
		  SET @col= 'Clase'
		 END

   		 if @sortDirection='desc'
		 begin

		set @consulta='SELECT * FROM (
			SELECT ROW_NUMBER()Over(ORDER BY '+@col+' desc) as RowNum, UsuarioId, Codigo, Correo, Password1, Rol, Telefono,
								  Activo, Bloqueado, Puntos, FechaCreacion, FechaUltimaEntrada, Anfitrion, ClasesUsuariosId,
								  FechaUltimaView,FechaModificacion,FechaDesbloqueo,FechaUltimoAnuncio, Clase FROM #cur_usuario

		   )as resultado WHERE RowNum BETWEEN '+CONVERT(varchar(10),((@pagina -1) * @cantPagina + 1))+' and '+CONVERT(varchar(10),(@pagina * @cantPagina))
		end
		else
		begin
			set @consulta='SELECT * FROM (
			SELECT ROW_NUMBER()Over(ORDER BY '+@col+') as RowNum, UsuarioId, Codigo, Correo, Password1, Rol, Telefono,
								  Activo, Bloqueado, Puntos, FechaCreacion, FechaUltimaEntrada, Anfitrion, ClasesUsuariosId,
								  FechaUltimaView,FechaModificacion,FechaDesbloqueo,FechaUltimoAnuncio, Clase FROM #cur_usuario


		   )as resultado WHERE RowNum BETWEEN '+CONVERT(varchar(10),((@pagina -1) * @cantPagina + 1))+' and '+CONVERT(varchar(10),(@pagina * @cantPagina))

		end
		
		 EXEC sp_executesql @consulta
		
	-------Fin Met Proceso-----------
	
	

	
	END
GO


