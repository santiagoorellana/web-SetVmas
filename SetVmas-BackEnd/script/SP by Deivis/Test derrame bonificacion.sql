USE [setDB]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_Boni_Referido]
		@userDestino = 3485,
		@codigoDestino = N'0026',-- '00E2' --0026
		@cantVendida = 10

SELECT	'Return Value' = @return_value

GO
