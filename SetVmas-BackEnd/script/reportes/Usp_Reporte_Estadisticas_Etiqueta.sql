IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Estadisticas_Etiqueta]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Etiqueta]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Etiqueta]

AS 
BEGIN


     CREATE TABLE #cur_listadoEti (id INT IDENTITY(1,1) Primary Key,
	                            Nombre varchar (max)
							    )
	 CREATE TABLE #cur_reporteEti (Etiqueta varchar(max), Anuncios decimal, AnuncioPC numeric(18,2), Visualizaciones int, Autorrenovable int,
	                            BannerSuperior int, BannerInferior int, AnuncioSimple int,Web int
							    )
	

	---------Met Proceso---------------- 
		
		BEGIN

		    DECLARE @i int, @Etiqueta varchar(max), @TotalAnuncios int, @AnuncioPorC numeric(18,2), @Anuncio decimal,
			@CantVisu int, @temp int, @CantAuto int, @CantBS int, @CantBI int,
			@CantWeb int, @CantASimples int
			SET @i=1
			DELETE FROM #cur_listadoEti
		    INSERT INTO #cur_listadoEti (Nombre)
			SELECT e.Nombre FROM Etiqueta e

			SELECT @TotalAnuncios= COUNT(*) FROM Anuncios

			WHILE EXISTS (SELECT * FROM #cur_listadoEti WHERE id=@i)
			 BEGIN
			  SELECT @Etiqueta= Nombre FROM #cur_listadoEti WHERE id=@i
			  SELECT @Anuncio = COUNT(DISTINCT (a.AnuncioId)) FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId																 
																 WHERE e.Nombre = @Etiqueta
			  SET @AnuncioPorC = @Anuncio/@TotalAnuncios * 100

			   SELECT @temp= COUNT(DISTINCT (a.AnuncioId)), @CantVisu = SUM(a.ContadorView) FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId																 
																 WHERE e.Nombre = @Etiqueta

            SELECT @CantAuto= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId																 
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE e.Nombre = @Etiqueta AND (tiop.NombreCodigo = 'AUTO_TOP' OR tiop.NombreCodigo = 'AUTO_1' OR tiop.NombreCodigo = 'AUTO_6' OR tiop.NombreCodigo = 'AUTO_24')
            
			SELECT @CantBS= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId																 
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE e.Nombre = @Etiqueta AND b.Tipo = 'Superior  escritorio'
            SELECT @CantBI= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId																
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE e.Nombre = @Etiqueta AND b.Tipo = 'Inferior'

	    	 SELECT @CantWeb= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId																
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE e.Nombre = @Etiqueta AND (tiop.NombreCodigo = 'ENLACE_WEB' )

			SELECT @CantASimples= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																																 
																 
							WHERE e.Nombre = @Etiqueta AND (a.AnuncioId NOT IN (SELECT oa.AnuncioId FROM OpcionAvanzadas oa ))

         IF @CantVisu = '' OR @CantVisu IS NULL
		  BEGIN
		   SET @CantVisu = 0
		  END

         INSERT INTO #cur_reporteEti (Etiqueta, Anuncios, AnuncioPC, Visualizaciones, Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web)
		                           VALUES (@Etiqueta, @Anuncio, @AnuncioPorC, @CantVisu, @CantAuto, @CantBS, @CantBI,@CantASimples, @CantWeb)
			  SET @i = @i+1
			 END

			 SELECT Etiqueta, Anuncios, AnuncioPC, Visualizaciones, Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web FROM #cur_reporteEti
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




