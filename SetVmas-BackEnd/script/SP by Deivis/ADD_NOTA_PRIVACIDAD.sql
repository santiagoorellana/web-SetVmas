USE [setDB]
GO
SET IDENTITY_INSERT [dbo].[VariableConfiguracion] ON 
GO

INSERT [dbo].[VariableConfiguracion] ([VariableConfiguracionId], [Nombre], [NombreCodigo], [Valor], [Tipo]) VALUES (1074, N'Nota de Privacidad', N'Nota_Privac', N'Usted recibe este mensaje porque ha suministrado voluntariamente su dirección de correo electrónico al sistema setvmas.com. Este mensaje está dirigido solamente a usted, por tanto, su contenido no debe ser revelado
a terceros distintos de usted o setvmas.com.
Recibirá notificaciones desde setvmas.com a esta dirección de correo electrónico, referentes a operaciones realizadas por usted en la plataforma setvmas.com, así como mensajes publicitarios exclusivamente desde setvmas.com, los cuales le ayudarán a conocer mejor y mantenerse actualizado sobre las funcionalidades y beneficios que le ofrece setvmas.com
Si no desea seguir siendo parte de setvmas.com, cancele su suscripción en su Oficina Virtual: https://setvmas.com/#/oficina, en la sección Datos de Registro, en el botón: Cancelar Suscripción. Para ello debe acceder con su nombre de usuario (Email o Código de Usuario) y contraseña.
', N'General')
GO
INSERT [dbo].[VariableConfiguracion] ([VariableConfiguracionId], [Nombre], [NombreCodigo], [Valor], [Tipo]) VALUES (1075, N'Nombre Remitente', N'Nombre_Remitente', N'SetvMas.com', N'General')
GO
SET IDENTITY_INSERT [dbo].[VariableConfiguracion] OFF
GO
