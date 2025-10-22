IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Estadisticas_Generales]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Generales]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Generales]

AS 
BEGIN


    
	 CREATE TABLE #cur_reporteGenerales (Renglon varchar(max), Valor decimal, ValorPC decimal)
	

	---------Met Proceso---------------- 
		
		BEGIN

		    DECLARE @Renglon varchar(max), @Valor decimal, @ValorPC decimal, @Usuario int, @Puntos int, @Anuncios decimal, @BS int,
			@BI int, @View int, @UserUltMes int, @AnuncioInvitado int, @Auto int, @Web int
			SET @Usuario= 0
			SET @Puntos= 0
			SET @Anuncios= 0
			SET @BS= 0
			SET @BI= 0
			SET @View= 0
			SET @UserUltMes = 0
			SET @AnuncioInvitado = 0
			SET @Auto = 0
			SET @Web = 0
			SET @ValorPC = 0

			SET @Renglon = 'Usuarios'			
			SELECT @Valor= COUNT(u.UsuarioId) FROM Usuario u 
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)
	----------------------------------------------------------------------------------------------------------------------------------------------		
	       
		   SET @Renglon = 'Puntos'			
			SELECT @Valor= SUM(u.Puntos) FROM Usuario u 
------------------------------------------------------------------------------------------------------------------------------------------------------

			SET @Renglon = 'Anuncios'			
			SELECT @Valor= COUNT(u.UsuarioId) FROM Anuncios u 
			SET @Anuncios = @Valor
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)
	----------------------------------------------------------------------------------------------------------------------------------------------		
	       
		   

			SET @Renglon = 'Banners Superiores'			
			SELECT @Valor= COUNT(u.BannerId) FROM Banners u WHERE u.Tipo= 'Superior escritorio'
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)
	----------------------------------------------------------------------------------------------------------------------------------------------		
	       SET @Renglon = 'Banners Inferiores'			
			SELECT @Valor= COUNT(u.BannerId) FROM Banners u WHERE u.Tipo= 'Inferior'
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)
	----------------------------------------------------------------------------------------------------------------------------------------------		
	       
		     SET @Renglon = 'Usuarios Último Mes'			
			SELECT @Valor= COUNT(u.UsuarioId) FROM Usuario u WHERE u.FechaCreacion <= GETDATE() AND u.FechaCreacion > GETDATE() - DAY(30)
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)
	----------------------------------------------------------------------------------------------------------------------------------------------		
	             
		     SET @Renglon = 'Visualizaciones'			
			SELECT @Valor= SUM(u.ContadorView) FROM Anuncios u 
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)
	----------------------------------------------------------------------------------------------------------------------------------------------		
	       
		    SET @Renglon = 'Anuncios Usuario Invitado'			
			SELECT @Valor= COUNT(u.UsuarioId) FROM Usuario u WHERE u.Correo = 'invitado@gmail.com'
			SET @ValorPC = @Valor / @Anuncios * 100
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)

							  SET @ValorPC = 0

	----------------------------------------------------------------------------------------------------------------------------------------------		
	       
		      SET @Renglon = 'Anuncios Autorrenovables'			
			
			SELECT @Valor= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE (tiop.NombreCodigo = 'AUTO_TOP' OR tiop.NombreCodigo = 'AUTO_1' OR tiop.NombreCodigo = 'AUTO_6' OR tiop.NombreCodigo = 'AUTO_24')
			SET @ValorPC = @Valor / @Anuncios * 100
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)

							  SET @ValorPC = 0

	----------------------------------------------------------------------------------------------------------------------------------------------		
	          SET @Renglon = 'Referencia a web'			
			SELECT @Valor= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE (tiop.NombreCodigo = 'ENLACE_WEB')
			SET @ValorPC = @Valor / @Anuncios * 100
			
         INSERT INTO #cur_reporteGenerales (Renglon, Valor,ValorPC )
		                      VALUES (@Renglon ,@Valor, @ValorPC)

							  SET @ValorPC = 0

	----------------------------------------------------------------------------------------------------------------------------------------------		
	       

            SELECT Renglon, Valor, ValorPC  FROM #cur_reporteGenerales
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




