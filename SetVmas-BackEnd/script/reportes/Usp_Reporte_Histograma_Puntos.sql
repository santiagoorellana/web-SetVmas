IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Histograma_Puntos]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Histograma_Puntos]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Histograma_Puntos]
(
@rango int
)
AS 
BEGIN


    
	 CREATE TABLE #cur_reportePuntos (Puntos varchar(max), Iniciado int, Oro int, Plata int, Bronce int,
	                               Diamante int, Total int
							    )
	

	---------Met Proceso---------------- 
		
		BEGIN

		    DECLARE @Puntos varchar(max), @Iniciado int, @Oro int, @Plata int, @Bronce int, @Diamante int, @Total int,
			@rangoFinal int, @rangoInicial int
			SET @Iniciado= 0
			SET @Oro= 0
			SET @Plata= 0
			SET @Bronce= 0
			SET @Diamante= 0
			SET @Total= 0
			SET @rangoFinal = 0
			SET @rangoInicial = 0

			SET @Puntos = '0-' + CONVERT (varchar, @rango)
			SET @rangoFinal = @rango
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                         
			WHERE cu.Nombre='Iniciado' AND u.Puntos >= 0 AND u.Puntos < @rangoFinal 

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Bronce' AND u.Puntos >= 0 AND u.Puntos < @rangoFinal 

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                         
			WHERE cu.Nombre='Plata' AND u.Puntos >= 0 AND u.Puntos < @rangoFinal 

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Oro' AND u.Puntos >= 0 AND u.Puntos < @rangoFinal 

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Diamante' AND u.Puntos >= 0 AND u.Puntos < @rangoFinal 


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reportePuntos (Puntos, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Puntos, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)
	----------------------------------------------------------------------------------------------------------------------------------------------		
	        SET @rangoInicial = @rangoFinal
	        SET @rangoFinal = @rangoInicial + @rango
	        SET @Puntos = CONVERT (varchar, @rangoInicial) + '-' + CONVERT (varchar, @rangoFinal)
			
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                         
			WHERE cu.Nombre='Iniciado' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Bronce' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Plata' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                         
			WHERE cu.Nombre='Oro' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Diamante' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reportePuntos (Puntos, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Puntos, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)



			 ----------------------------------------------------------------------------------------------------------------------------------------------		

	        SET @rangoInicial = @rangoFinal
	        SET @rangoFinal = @rangoInicial + @rango
	        SET @Puntos = CONVERT (varchar, @rangoInicial) + '-' + CONVERT (varchar, @rangoFinal)
			
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Iniciado' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Bronce' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Plata' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Oro' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Diamante' AND u.Puntos >= @rangoInicial AND u.Puntos < @rangoFinal


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reportePuntos (Puntos, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Puntos, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)

---------------------------------------------------------------------------------------------------------------------

     			
			 SET @rangoInicial = @rangoFinal
	        
	        SET @Puntos = 'más de ' + CONVERT (varchar, @rangoFinal)
			
			
			SELECT @Iniciado= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Iniciado' AND u.Puntos >=  @rangoFinal

			SELECT @Bronce= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Bronce' AND u.Puntos >=  @rangoFinal

			SELECT @Plata= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Plata' AND u.Puntos >=  @rangoFinal

			SELECT @Oro= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Oro' AND u.Puntos >=  @rangoFinal

			SELECT @Diamante= COUNT(DISTINCT(u.UsuarioId)) FROM Usuario u INNER JOIN ClasesUsuarios cu ON cu.ClasesUsuariosId = u.ClasesUsuariosId
			                                          
			WHERE cu.Nombre='Diamante' AND u.Puntos >=  @rangoFinal


			SET @Total = @Iniciado + @Oro + @Plata + @Bronce + @Diamante  
         INSERT INTO #cur_reportePuntos (Puntos, Iniciado, Oro, Plata, Bronce, Diamante, Total )
		                      VALUES (@Puntos, @Iniciado, @Oro, @Plata, @Bronce, @Diamante, @Total)


            SELECT Puntos, Iniciado, Oro, Plata, Bronce, Diamante, Total  FROM #cur_reportePuntos
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




