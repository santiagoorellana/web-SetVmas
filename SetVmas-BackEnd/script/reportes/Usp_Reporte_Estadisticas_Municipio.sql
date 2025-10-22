IF EXISTS (SELECT name FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[Usp_Reporte_Estadisticas_Municipio]') AND OBJECTPROPERTY(id,N'IsProcedure') = 1)
    DROP PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Municipio]
GO


CREATE PROCEDURE [dbo].[Usp_Reporte_Estadisticas_Municipio]

AS 
BEGIN


     CREATE TABLE #cur_listadoMunicipio (id INT IDENTITY(1,1) Primary Key,
	                            Nombre varchar (max)
							    )
	 CREATE TABLE #cur_reporteMunicipio (Municipio varchar(max), Anuncios decimal, AnuncioPC numeric(18,2), /*Visualizaciones int,*/ Autorrenovable int,
	                            BannerSuperior int, BannerInferior int, AnuncioSimple int,Web int
							    )
	

	---------Met Proceso----------------
		
		BEGIN
		    DELETE FROM #cur_listadoMunicipio    
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Arroyo Naranjo')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Boyeros')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Centro Habana')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cerro')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cotorro')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Guanabacoa')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Diez de Octubre')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Habana del Este')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Habana Vieja')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('La Lisa')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Marianao')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Playa')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Plaza de la Revolución')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Regla')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Miguel del Padrón')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Consolación del Sur')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Guane')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('La Palma')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Los Palacios')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Mantua')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Minas de Matahambre')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Pinar del Río')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Juan y Martínez')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Luis')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Sandino')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Viñales')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Alquízar')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Artemisa')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Bahía Honda')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Bauta')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Caimito')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Guanajay')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Güira de Melena')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Mariel')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Antonio de los Baños')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Cristobal')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Batabanó')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Bejucal')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Güines')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jaruco')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Madruga')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Melena del Sur')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Nueva Paz')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Quivicán')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San José de las Lajas')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Nicolás de Bari')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Santa Cruz del Norte')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Calimete')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cárdenas')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Ciénaga de Zapata')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Colón')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jaguey Grande')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jovellanos')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Limonar')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Los Arabos')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Martí')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Matanzas')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Pedro Betancourt')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Perico')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Unión de Reyes')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Caibarién')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Camajuaní')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cifuentes')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Corralillo')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Encrucijada')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Placetas')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Quemado de Güines')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Ranchuelos')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Remedios')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Sagua la Grande')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Santa Clara')								
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Santo Domingo')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Abreus')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Aguada de Pasajeros')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cienfuegos')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cruces')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cumanayagua')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Palmira')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Rodas')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Santa Isabel de las Lajas')	
					
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cabaigúan')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Fomento')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jatibonico')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('La Sierpe')				
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Sancti Spíritus')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Taguasco')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Trinidad')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Yaguajay')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Ciro Redondo')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Baraguá')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Bolivia')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Chambas')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Ciego de Ávila')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Florencia')								
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Majagua')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Morón')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Primero de Enero')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Venezuela')	
					
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Camagüey')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Carlos Manuel de Céspedes')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Esmeralda')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Florida')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Guaimaro')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jimagüayú')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Najasa')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Nuevitas')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Santa Cruz del Sur')				
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Sibanicú')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Sierra de Cubitas')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Vertientes')	
					
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Amancio Rodríguez')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Colombia')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jesús Menéndez')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jobabo')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Las Tunas')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Majibacoa')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Manatí')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Puerto Padre')	
										
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Antilla')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Báguanos')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Banes')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cacocum')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Calixto García')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cueto')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Frank País')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Gibara')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Holguín')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Mayarí')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Moa')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Rafael Freyre')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Sagua de Tánamo')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Urbano Noris')

			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Bartolomé Masó')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Bayamo')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Buey Arriba')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Campechuela')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Cauto Cristo')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Guisa')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Jiguaní')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Manzanillo')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Media Luna')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Niquero')								
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Pilón')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Río Cauto')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Yara')	
					
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Contramaestre')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Guamá')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Julio Antonio Mella')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Palma Soriano')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Luis')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Santiago de Cuba')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Segundo Frente')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Songo la Maya')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Tercer Frente')	
					
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Baracoa')				
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Caimanera')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('El Salvador')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Guantánamo')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Imías')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Maisí')			
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Niceto Pérez')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('San Antonio del Sur')
			INSERT INTO #cur_listadoMunicipio (Nombre) VALUES('Yateras')
			
			
			

		    DECLARE @i int, @Municipio varchar(max), @TotalAnuncios int, @AnuncioPorC numeric(18,2), @Anuncio decimal,
			@CantVisu int, @temp int, @CantAuto int, @CantBS int, @CantBI int,
			@CantWeb int, @CantASimples int
			SET @i=1
			
			

			SELECT @TotalAnuncios= COUNT(*) FROM Anuncios

			WHILE EXISTS (SELECT * FROM #cur_listadoMunicipio WHERE id=@i)
			 BEGIN
			  SELECT @Municipio= Nombre FROM #cur_listadoMunicipio WHERE id=@i
			  SELECT @Anuncio = COUNT(DISTINCT (a.AnuncioId)) FROM Anuncios a WHERE a.Municipio = @Municipio
			  SET @AnuncioPorC = @Anuncio/@TotalAnuncios * 100

			   /*SELECT @temp= COUNT(DISTINCT (a.AnuncioId)), @CantVisu = SUM(a.ContadorView) FROM Anuncios a INNER JOIN AnuncioEtiquetas ae ON a.AnuncioId = ae.AnuncioId
			                                                     INNER JOIN Etiqueta e ON e.EtiquetaId = ae.EtiquetaId
																 INNER JOIN CategoriaEtiqueta ce ON ce.EtiquetaId = e.EtiquetaId
																 INNER JOIN Categoria c ON c.CategoriaId = ce.CategoriaEtiquetaId
																 WHERE c.Nombre = @Categoria*/

            SELECT @CantAuto= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE a.Municipio = @Municipio AND (tiop.NombreCodigo = 'AUTO_TOP' OR tiop.NombreCodigo = 'AUTO_1' OR tiop.NombreCodigo = 'AUTO_6' OR tiop.NombreCodigo = 'AUTO_24')
            
			SELECT @CantBS= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE a.Municipio = @Municipio AND b.Tipo = 'Superior  escritorio'
            SELECT @CantBI= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN Banners b ON b.AnuncioId = a.AnuncioId
							WHERE a.Municipio = @Municipio AND b.Tipo = 'Inferior'

	    	 SELECT @CantWeb= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 INNER JOIN OpcionAvanzadas oa ON oa.AnuncioId = a.AnuncioId
																 INNER JOIN TipoOpciones tiop ON tiop.TipoOpcionId = oa.TipoOpcionId
							WHERE a.Municipio = @Municipio AND (tiop.NombreCodigo = 'ENLACE_WEB' )

			SELECT @CantASimples= COUNT(DISTINCT (a.AnuncioId))  FROM Anuncios a 
																 
							WHERE a.Municipio = @Municipio AND (a.AnuncioId NOT IN (SELECT oa.AnuncioId FROM OpcionAvanzadas oa ))

         /*IF @CantVisu = '' OR @CantVisu IS NULL
		  BEGIN
		   SET @CantVisu = 0
		  END*/

         INSERT INTO #cur_reporteMunicipio (Municipio, Anuncios, AnuncioPC,  Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web)
		                           VALUES (@Municipio, @Anuncio, @AnuncioPorC, @CantAuto, @CantBS, @CantBI,@CantASimples, @CantWeb)
			  SET @i = @i+1
			 END

			 SELECT Municipio, Anuncios, AnuncioPC, Autorrenovable, BannerSuperior, BannerInferior, AnuncioSimple, Web FROM #cur_reporteMunicipio
           
		END
	
	-------Fin Met Proceso-----------
	
	
END--Procedure




