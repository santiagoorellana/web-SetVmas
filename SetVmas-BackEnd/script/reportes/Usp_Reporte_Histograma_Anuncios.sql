IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Histograma_Anuncios]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Histograma_Anuncios]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Histograma_Anuncios]

AS 
BEGIN


    
	 CREATE TABLE #cur_reporteAnuncio (Anuncios varchar(max), Iniciado int, Oro int, Plata int, Bronce int,
	                               Diamante int, Total int
							    )
	

	---------Met Proceso---------------- 
		
		BEGIN

		    DECLARE @Anuncios varchar(max), @Iniciado int, @Oro int, @Plata int, @Bronce int, @Diamante int, @Total int
			SET @Iniciado= 0
			SET @Oro= 0
			SET @Plata= 0
			SET @Bronce= 0
			SET @Diamante= 0
			SET @Total= 0

			SET @Anuncios = '0-20'
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Iniciado' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 0
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 20

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Bronce' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 0
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 20

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Plata' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 0
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 20

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Oro' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 0
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 20

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Diamante' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 0
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 20


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reporteAnuncio (Anuncios, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Anuncios, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)
	----------------------------------------------------------------------------------------------------------------------------------------------		

	SET @Anuncios = '20-40'
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Iniciado' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 20
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 40

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Bronce' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 20
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 40

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Plata' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 20
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 40

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Oro' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 20
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 40

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Diamante' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 20
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 40


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reporteAnuncio (Anuncios, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Anuncios, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)



			 ----------------------------------------------------------------------------------------------------------------------------------------------		

	     SET @Anuncios = '40-60'
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Iniciado' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 40
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 60

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Bronce' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 40
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 60

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Plata' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 40
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 60

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Oro' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 40
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 60

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Diamante' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 40
			AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) < 60


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reporteAnuncio (Anuncios, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Anuncios, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)

---------------------------------------------------------------------------------------------------------------------

     SET @Anuncios = 'más de 60'
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Iniciado' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 60
			

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Bronce' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 60
			

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Plata' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 60
			

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Oro' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 60
			

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          INNER JOIN Anuncios a ON a.UsuarioId = u.UsuarioId
			WHERE cu.Nombre='Diamante' AND (SELECT COUNT (aa.AnuncioId) FROM Anuncios aa WHERE aa.UsuarioId = u.UsuarioId) >= 60
			


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reporteAnuncio (Anuncios, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Anuncios, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)

            SELECT Anuncios, Iniciado, Oro, Plata, Bronce, Diamante, Total  FROM #cur_reporteAnuncio
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




