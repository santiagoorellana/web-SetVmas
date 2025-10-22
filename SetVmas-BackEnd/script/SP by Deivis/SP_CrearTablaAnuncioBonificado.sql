USE [setDB]
GO

/****** Object:  Table [dbo].[AnuncioBonificados]    Script Date: 7/2/2021 11:38:44 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[AnuncioBonificados](
	[AnuncioBonificadoId] [int] IDENTITY(1,1) NOT NULL,
	[AnuncioId] [int] NOT NULL,
	[UsuarioId] [int] NOT NULL,
	[FechaBoni] [datetime2](7) NOT NULL,
	[CantidadBonificada] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_AnuncioBonificados] PRIMARY KEY CLUSTERED 
(
	[AnuncioBonificadoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[AnuncioBonificados]  WITH CHECK ADD  CONSTRAINT [FK_AnuncioBonificados_Anuncios_AnuncioId] FOREIGN KEY([AnuncioId])
REFERENCES [dbo].[Anuncios] ([AnuncioId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[AnuncioBonificados] CHECK CONSTRAINT [FK_AnuncioBonificados_Anuncios_AnuncioId]
GO

ALTER TABLE [dbo].[AnuncioBonificados]  WITH CHECK ADD  CONSTRAINT [FK_AnuncioBonificados_Usuario_UsuarioId] FOREIGN KEY([UsuarioId])
REFERENCES [dbo].[Usuario] ([UsuarioId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[AnuncioBonificados] CHECK CONSTRAINT [FK_AnuncioBonificados_Usuario_UsuarioId]
GO


