IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Estadisticas_ClasesUsuarios]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Estadisticas_ClasesUsuarios]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Estadisticas_ClasesUsuarios]

AS 
BEGIN


     CREATE TABLE #cur_listadoClase (id INT IDENTITY(1,1) Primary Key,
	                            Nombre varchar (max)
							    )
	 CREATE TABLE #cur_reporteClase (Clase varchar(max), Anuncios decimal, AnuncioPC numeric(18,2), Puntos decimal, PuntosPC numeric(18,2),
	                           Usuarios decimal, UsuariosPC numeric(18,2),
							    )
	

	---------Met Proceso----------------
		
		BEGIN

		    DECLARE @i int, @Clase varchar(max), @TotalAnuncios int, @AnuncioPorC numeric(18,2), @Anuncio decimal,
			 @TotalPuntos int, @PuntosPorC numeric(18,2), @Puntos decimal, @temp int,
			  @TotalUsuarios int, @UsuariosPorC numeric(18,2), @Usuarios decimal
		
			SET @i=1
			DELETE FROM #cur_listadoClase
		    INSERT INTO #cur_listadoClase (Nombre)
			SELECT c.Nombre FROM ClasesUsuarios c

			SELECT @TotalAnuncios= COUNT(*) FROM Anuncios
			SELECT @TotalUsuarios= COUNT(*) FROM Usuario
			SELECT @TotalPuntos= SUM(Puntos) FROM Usuario

			WHILE EXISTS (SELECT * FROM #cur_listadoClase WHERE id=@i)
			 BEGIN
			  SELECT @Clase= Nombre FROM #cur_listadoClase WHERE id=@i
			  SELECT @Anuncio = COUNT(DISTINCT (a.AnuncioId)) FROM Anuncios a INNER JOIN Usuario u ON a.UsuarioId = u.UsuarioId
			                                                     INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
																 
																 WHERE cu.Nombre = @Clase
			  SET @AnuncioPorC = @Anuncio/@TotalAnuncios * 100

			   SELECT @temp= COUNT(DISTINCT (u.UsuarioId)), @Puntos = SUM(u.Puntos) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
																 WHERE cu.Nombre = @Clase
             SET @PuntosPorC = @Puntos/@TotalPuntos * 100

           SELECT @Usuarios = COUNT(DISTINCT (u.UsuarioId)) FROM Usuario u  
			                                                     INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId																 
																 WHERE cu.Nombre = @Clase
			  SET @UsuariosPorC = @Usuarios/@TotalUsuarios * 100
         
		/* IF @CantVisu = '' OR @CantVisu IS NULL
		  BEGIN
		   SET @CantVisu = 0
		  END*/

         INSERT INTO #cur_reporteClase (Clase, Anuncios, AnuncioPC, Puntos, PuntosPC, Usuarios , UsuariosPC)
		                           VALUES (@Clase, @Anuncio, @AnuncioPorC, @Puntos, @PuntosPorC, @Usuarios, @UsuariosPorC)
			  SET @i = @i+1
			 END

			 SELECT Clase, Anuncios, AnuncioPC, Puntos, PuntosPC, Usuarios , UsuariosPC FROM #cur_reporteClase
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




