UPDATE VariableConfiguracion SET Tipo= 'Bonificación'
WHERE Tipo = 'Bonificacion'

--Este script se creo pq en la aplicacion se estaba usando Bonificación con tilde para buscar
--en la tabla de variables de configuracion y habia algunas variables con Bonificacion sin
--tiilde