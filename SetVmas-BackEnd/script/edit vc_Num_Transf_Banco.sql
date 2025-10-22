USE [setDB]
GO

UPDATE [dbo].[VariableConfiguracion]
   SET [Nombre] = 'Número de tarjeta para pago por transferencia de Banco'
 WHERE NombreCodigo='Num_Transf_Banco'
GO


