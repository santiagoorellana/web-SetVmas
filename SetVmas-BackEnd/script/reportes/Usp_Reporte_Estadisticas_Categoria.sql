IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Estadisticas_Categoria]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Categoria]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Categoria]

AS 
BEGIN


     CREATE TABLE #cur_listado (id INT IDENTITY(1,1) Primary Key,
	                            Nombre varchar (max)
							    )
	 CREATE TABLE #cur_reporte (Categoria varchar(max), Anuncios decimal, AnuncioPC numeric(18,2), Visualizaciones int, Autorrenovable int,
	                            BannerSuperior int, BannerInferior int, AnuncioSimple int,Web int
							    )
	

	---------Met Proceso----------------
		
		BEGIN

		    DECLARE @i int, @Categoria varchar(max), @TotalAnuncios int, @AnuncioPorC numeric(18,2), @Anuncio decimal,
			@CantVisu int, @temp int, @CantAuto int, @CantBS int, @CantBI int,
			@CantWeb int, @CantASimples int
			SET @i=1
			DELETE FROM #cur_listado
		    INSERT INTO #cur_listado (Nombre)
			SELECT c.Nombre FROM Categoria c

			SELECT @TotalAnuncios= COUNT(*) FROM Anuncios

			WHILE EXISTS (SELECT * FROM #cur_listado WHERE id=@i)
			 BEGIN
			  SELECT @Categoria= Nombre FROM #cur_listado WHERE id=@i
			  SELECT @Anuncio = COUNT(DISTINCT (a.AnuncioId)) FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId
																 WHERE c.Nombre = @Categoria
			  SET @AnuncioPorC = @Anuncio/@TotalAnuncios * 100

			   SELECT @temp= COUNT(DISTINCT (a.AnuncioId)), @CantVisu = SUM(a.ContadorView) FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId
																 WHERE c.Nombre = @Categoria

            SELECT @CantAuto= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE c.Nombre = @Categoria AND (tiop.NombreCodigo = 'AUTO_TOP' OR tiop.NombreCodigo = 'AUTO_1' OR tiop.NombreCodigo = 'AUTO_6' OR tiop.NombreCodigo = 'AUTO_24')
            
			SELECT @CantBS= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE c.Nombre = @Categoria AND b.Tipo = 'Superior  escritorio'
            SELECT @CantBI= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE c.Nombre = @Categoria AND b.Tipo = 'Inferior'

	    	 SELECT @CantWeb= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE c.Nombre = @Categoria AND (tiop.NombreCodigo = 'ENLACE_WEB' )

			SELECT @CantASimples= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaId
																 
																 
							WHERE c.Nombre = @Categoria AND (a.AnuncioId NOT IN (SELECT oa.AnuncioId FROM OpcionAvanzadas oa ))

         IF @CantVisu = '' OR @CantVisu IS NULL
		  BEGIN
		   SET @CantVisu = 0
		  END

         INSERT INTO #cur_reporte (Categoria, Anuncios, AnuncioPC, Visualizaciones, Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web)
		                           VALUES (@Categoria, @Anuncio, @AnuncioPorC, @CantVisu, @CantAuto, @CantBS, @CantBI,@CantASimples, @CantWeb)
			  SET @i = @i+1
			 END

			 SELECT Categoria, Anuncios, AnuncioPC, Visualizaciones, Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web FROM #cur_reporte
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




