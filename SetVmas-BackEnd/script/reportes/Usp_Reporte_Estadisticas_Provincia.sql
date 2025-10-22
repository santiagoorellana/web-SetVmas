IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Estadisticas_Provincia]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Provincia]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Provincia]

AS 
BEGIN


     CREATE TABLE #cur_listadoProvincia (id INT IDENTITY(1,1) Primary Key,
	                            Nombre varchar (max)
							    )
	 CREATE TABLE #cur_reporteProvincia (Provincia varchar(max), Anuncios decimal, AnuncioPC numeric(18,2), /*Visualizaciones int,*/ Autorrenovable int,
	                            BannerSuperior int, BannerInferior int, AnuncioSimple int,Web int
							    )
	

	---------Met Proceso----------------
		
		BEGIN
		    DELETE FROM #cur_listadoProvincia		    
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('La Habana')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Pinar del Río')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Isla de la Juventud')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Artemisa')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Mayabeque')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Matanzas')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Villa Clara')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Cienfuegos')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Sancti Spíritus')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Ciego de Ávila')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Camagüey')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Las Tunas')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Holguín')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Granma')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Santiago de Cuba')
			INSERT INTO #cur_listadoProvincia (Nombre) VALUES('Guatánamo')

		    DECLARE @i int, @Provincia varchar(max), @TotalAnuncios int, @AnuncioPorC numeric(18,2), @Anuncio decimal,
			@CantVisu int, @temp int, @CantAuto int, @CantBS int, @CantBI int,
			@CantWeb int, @CantASimples int
			SET @i=1
			
			

			SELECT @TotalAnuncios= COUNT(*) FROM Anuncios

			WHILE EXISTS (SELECT * FROM #cur_listadoProvincia WHERE id=@i)
			 BEGIN
			  SELECT @Provincia= Nombre FROM #cur_listadoProvincia WHERE id=@i
			  SELECT @Anuncio = COUNT(DISTINCT (a.AnuncioId)) FROM Anuncios a WHERE a.Provincia = @Provincia
			  SET @AnuncioPorC = @Anuncio/@TotalAnuncios * 100

			   /*SELECT @temp= COUNT(DISTINCT (a.AnuncioId)), @CantVisu = SUM(a.ContadorView) FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaEtiquetaId
																 WHERE c.Nombre = @Categoria*/

            SELECT @CantAuto= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE a.Provincia = @Provincia AND (tiop.NombreCodigo = 'AUTO_TOP' OR tiop.NombreCodigo = 'AUTO_1' OR tiop.NombreCodigo = 'AUTO_6' OR tiop.NombreCodigo = 'AUTO_24')
            
			SELECT @CantBS= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE a.Provincia = @Provincia AND b.Tipo = 'Superior  escritorio'
            SELECT @CantBI= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE a.Provincia = @Provincia AND b.Tipo = 'Inferior'

	    	 SELECT @CantWeb= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE a.Provincia = @Provincia AND (tiop.NombreCodigo = 'ENLACE_WEB' )

			SELECT @CantASimples= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 
							WHERE a.Provincia = @Provincia AND (a.AnuncioId NOT IN (SELECT oa.AnuncioId FROM OpcionAvanzadas oa ))

         /*IF @CantVisu = '' OR @CantVisu IS NULL
		  BEGIN
		   SET @CantVisu = 0
		  END*/

         INSERT INTO #cur_reporteProvincia (Provincia, Anuncios, AnuncioPC,  Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web)
		                           VALUES (@Provincia, @Anuncio, @AnuncioPorC, @CantAuto, @CantBS, @CantBI,@CantASimples, @CantWeb)
			  SET @i = @i+1
			 END

			 SELECT Provincia, Anuncios, AnuncioPC, Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web FROM #cur_reporteProvincia
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




