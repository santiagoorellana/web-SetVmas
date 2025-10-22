IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Histograma_Puntos_Clase]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Histograma_Puntos_Clase]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Histograma_Puntos_Clase]
(
@rangoI int,
@rangoF int
)
AS 
BEGIN


    
	 CREATE TABLE #cur_reportePClase (Clase varchar(max), Usuario decimal, UsuarioPC decimal, ClasePC decimal)
	

	---------Met Proceso---------------- 
		
		BEGIN

		    DECLARE @Clase varchar(max), @Usuario decimal, @UsuarioPC decimal, @ClasePC int, @totalUser decimal, @totalPuntos decimal,
			@totalClase decimal
			SET @Usuario= 0
			SET @UsuarioPC= 0
			SET @ClasePC= 0
			SET @totalUser= 1
			SET @totalPuntos= 1

			SELECT @totalPuntos= SUM(a.ContadorView) FROM Anuncios a
			SELECT @totalUser= COUNT(a.UsuarioId) FROM Usuario a
			

			SET @Clase = 'Iniciado'			
			SELECT @Usuario= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase AND u.Puntos >= @rangoI AND u.Puntos <= @rangoF
			
			SELECT @totalClase= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase 


            IF @totalUser = 0
			 BEGIN
			   SET @UsuarioPC = 0			
			 END
			ELSE
			 BEGIN
			  SET @UsuarioPC = @Usuario/@totalUser * 100			  
			 END

			IF @totalClase = 0
			 BEGIN
			  SET @ClasePC = 0
			 END
			ELSE
			 BEGIN			  
			  SET @ClasePC = @Usuario/@totalClase * 100
			 END
			

			
         INSERT INTO #cur_reportePClase (Clase, Usuario, UsuarioPC, ClasePC )
		                      VALUES (@Clase, @Usuario ,@UsuarioPC, @ClasePC)
			
	----------------------------------------------------------------------------------------------------------------------------------------------		
	       
		   SET @Clase = 'Bronce'			
			SELECT @Usuario= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase AND u.Puntos >= @rangoI AND u.Puntos <= @rangoF
			
			SELECT @totalClase= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase 


			  IF @totalUser = 0
			 BEGIN
			   SET @UsuarioPC = 0			
			 END
			ELSE
			 BEGIN
			  SET @UsuarioPC = @Usuario/@totalUser * 100			  
			 END

			IF @totalClase = 0
			 BEGIN
			  SET @ClasePC = 0
			 END
			ELSE
			 BEGIN			  
			  SET @ClasePC = @Usuario/@totalClase * 100
			 END

			
         INSERT INTO #cur_reportePClase (Clase, Usuario, UsuarioPC, ClasePC )
		                      VALUES (@Clase, @Usuario ,@UsuarioPC, @ClasePC)
			
		---------------------------------------------------------------------------------------------------------------------------------------------------
		
		    SET @Clase = 'Plata'			
			SELECT @Usuario= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase AND u.Puntos >= @rangoI AND u.Puntos <= @rangoF
			
			SELECT @totalClase= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase 


			  IF @totalUser = 0
			 BEGIN
			   SET @UsuarioPC = 0			
			 END
			ELSE
			 BEGIN
			  SET @UsuarioPC = @Usuario/@totalUser * 100			  
			 END

			IF @totalClase = 0
			 BEGIN
			  SET @ClasePC = 0
			 END
			ELSE
			 BEGIN			  
			  SET @ClasePC = @Usuario/@totalClase * 100
			 END

			
         INSERT INTO #cur_reportePClase (Clase, Usuario, UsuarioPC, ClasePC )
		                      VALUES (@Clase, @Usuario ,@UsuarioPC, @ClasePC)
			

		-----------------------------------------------------------------------------------------------------------------------------------------------------

		 SET @Clase = 'Oro'			
			SELECT @Usuario= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase AND u.Puntos >= @rangoI AND u.Puntos <= @rangoF
			
			SELECT @totalClase= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase 


			  IF @totalUser = 0
			 BEGIN
			   SET @UsuarioPC = 0			
			 END
			ELSE
			 BEGIN
			  SET @UsuarioPC = @Usuario/@totalUser * 100			  
			 END

			IF @totalClase = 0
			 BEGIN
			  SET @ClasePC = 0
			 END
			ELSE
			 BEGIN			  
			  SET @ClasePC = @Usuario/@totalClase * 100
			 END

			
         INSERT INTO #cur_reportePClase (Clase, Usuario, UsuarioPC, ClasePC )
		                      VALUES (@Clase, @Usuario ,@UsuarioPC, @ClasePC)
			

			-----------------------------------------------------------------------------------------------------------------------------------------
			 SET @Clase = 'Diamante'			
			SELECT @Usuario= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase AND u.Puntos >= @rangoI AND u.Puntos <= @rangoF
			
			SELECT @totalClase= COUNT(u.UsuarioId) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId=u.ClasesUsuariosId
			                                    WHERE cu.Nombre = @Clase 


			  IF @totalUser = 0
			 BEGIN
			   SET @UsuarioPC = 0			
			 END
			ELSE
			 BEGIN
			  SET @UsuarioPC = @Usuario/@totalUser * 100			  
			 END

			IF @totalClase = 0
			 BEGIN
			  SET @ClasePC = 0
			 END
			ELSE
			 BEGIN			  
			  SET @ClasePC = @Usuario/@totalClase * 100
			 END

			
         INSERT INTO #cur_reportePClase (Clase, Usuario, UsuarioPC, ClasePC )
		                      VALUES (@Clase, @Usuario ,@UsuarioPC, @ClasePC)
			

            SELECT Clase, Usuario, UsuarioPC, ClasePC  FROM #cur_reportePClase
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




