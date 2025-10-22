USE [setDB]
GO

/****** Object:  StoredProcedure [dbo].[USP_Boni_Referido]    Script Date: 23/7/2020 22:55:19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


---- ===================================================================================== ----
-- Este script debe ser ejecutado en la base de datos del cliente
---- ===================================================================================== ----

-- Parámetros			: 
---- ===================================================================================== ----
ALTER PROCEDURE [dbo].[USP_Boni_Referido]
(


@userDestino int,
@codigoDestino nvarchar(max),
@cantVendida decimal

)
AS 
BEGIN

	---------Met Proceso----------------

	DECLARE @userFuente int,@codigoAdmin nvarchar(max), @idAdmin int, @boni decimal(18,4), @puntos int, @anfitrion nvarchar(max),  
	@cont int,  @claseNombre nvarchar(max), @consulta nvarchar(max), @tipoTransf int, @tipoTransfBoni int, @id int, @boniComprar decimal(18,4),
	@cant_max_ref int, @isActivo bit, @correo varchar(max)
	Set @cont=1
	
	SELECT @cant_max_ref = Valor FROM VariableConfiguracion WHERE NombreCodigo = 'Cant_Max_Referidos'

	SELECT @codigoAdmin=Usuario.Codigo, @idAdmin =Usuario.UsuarioId FROM Usuario where Usuario.Correo='info@setvmas.com'
	/*SELECT @tipoTransf=TipoTransferencia.TipoTransferenciaId FROM TipoTransferencia where TipoTransferencia.NombreCodigo='COMP_DIRECT'*/
	SELECT @tipoTransfBoni=TipoTransferencia.TipoTransferenciaId FROM TipoTransferencia where TipoTransferencia.NombreCodigo='BONIF_REFERIDO'
	
/*asignar bonificacion al referido*/
	 WHILE (@cont<>@cant_max_ref and @codigoDestino<>'0001')
	 BEGIN
	SELECT @correo=Usuario.Correo,@id=Usuario.UsuarioId, @puntos=Usuario.Puntos, @anfitrion=Usuario.Anfitrion, @claseNombre=ClasesUsuarios.Nombre,
	@isActivo= Usuario.Activo FROM Usuario
	 INNER JOIN ClasesUsuarios ON Usuario.ClasesUsuariosId = ClasesUsuarios.ClasesUsuariosId where Usuario.codigo=@codigoDestino 
	IF @isActivo = 1
	BEGIN
	
	If @claseNombre ='Iniciado'
	   BEGIN
	     SELECT @boni=FactoresBonificacionVentas.ClaseIniciada FROM FactoresBonificacionVentas where FactoresBonificacionVentas.Nivel=@cont
	   END
	   ELSE If @claseNombre ='Bronce'
	   BEGIN
	     SELECT @boni=FactoresBonificacionVentas.ClaseBronce FROM FactoresBonificacionVentas where FactoresBonificacionVentas.Nivel=@cont
	   END
	   ELSE If @claseNombre ='Plata'
	   BEGIN
	     SELECT @boni=FactoresBonificacionVentas.ClasePlata FROM FactoresBonificacionVentas where FactoresBonificacionVentas.Nivel=@cont
	   END
	   ELSE If @claseNombre ='Oro'
	   BEGIN
	      SELECT @boni=FactoresBonificacionVentas.ClaseOro FROM FactoresBonificacionVentas where FactoresBonificacionVentas.Nivel=@cont
	   END
	   ELSE
	    BEGIN
	       SELECT @boni=FactoresBonificacionVentas.ClaseDiamante FROM FactoresBonificacionVentas where FactoresBonificacionVentas.Nivel=@cont
	   END
	   --SELECT @cont as Nivel, @codigoDestino as UsuarioRecBon, @anfitrion as Anfi, @claseNombre as Clase, @correo as correo, @boni as Bonfi
	   UPDATE Usuario SET Puntos += (@cantVendida * @boni) WHERE (Usuario.Codigo= @codigoDestino)
	   --*-*Inserto la transferencias de bionificacion por venta
		INSERT Transferencia([UsuarioFuenteUsuarioId],[UsuarioDestinoUsuarioId],[UsuarioId],[Fecha],[Puntos],[TipoTransferenciaId])
		VALUES (@idAdmin,@id,@idAdmin,GETDATE(), @cantVendida*@boni, @tipoTransfBoni)

		END
	SET @cont = @cont+1
	SET @codigoDestino= @anfitrion
	 END
/*asignar bonificacion al referido*/
	-------Fin Met Proceso-----------

	END





GO


