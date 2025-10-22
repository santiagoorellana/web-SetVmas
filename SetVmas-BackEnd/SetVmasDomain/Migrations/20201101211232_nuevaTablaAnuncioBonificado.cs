using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SetVmasDomain.Migrations
{
    public partial class nuevaTablaAnuncioBonificado : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateTable(
            //    name: "Categoria",
            //    columns: table => new
            //    {
            //        CategoriaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        Imagen = table.Column<string>(nullable: true),
            //        CantAutoRenovables = table.Column<int>(nullable: false),
            //        ImageContent = table.Column<string>(nullable: true),
            //        ImageMimeType = table.Column<string>(nullable: true),
            //        ImageName = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Categoria", x => x.CategoriaId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "ClasesUsuarios",
            //    columns: table => new
            //    {
            //        ClasesUsuariosId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        FactorBonificacionCompra = table.Column<double>(nullable: false),
            //        BonificacionPorAlcanzarla = table.Column<double>(nullable: false),
            //        BonificacionPorAnuncioDiario = table.Column<double>(nullable: false),
            //        RequisitoAntigueda = table.Column<int>(nullable: false),
            //        RequisitoCompras = table.Column<int>(nullable: false),
            //        RequisitoCantidadReferidos = table.Column<int>(nullable: false),
            //        RequisitoPuntos = table.Column<decimal>(type: "decimal(18, 4)", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_ClasesUsuarios", x => x.ClasesUsuariosId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Etiqueta",
            //    columns: table => new
            //    {
            //        EtiquetaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        CantUsada = table.Column<int>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Etiqueta", x => x.EtiquetaId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "FactoresBonificacionVentas",
            //    columns: table => new
            //    {
            //        FactoresBonificacionVentasId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nivel = table.Column<int>(nullable: false),
            //        ClaseDiamante = table.Column<double>(nullable: false),
            //        ClaseOro = table.Column<double>(nullable: false),
            //        ClasePlata = table.Column<double>(nullable: false),
            //        ClaseBronce = table.Column<double>(nullable: false),
            //        ClaseIniciada = table.Column<double>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_FactoresBonificacionVentas", x => x.FactoresBonificacionVentasId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "MotivoDenuncia",
            //    columns: table => new
            //    {
            //        MotivoDenunciaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        NombreCodigo = table.Column<string>(nullable: true),
            //        Estado = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_MotivoDenuncia", x => x.MotivoDenunciaId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "PaginasEstaticas",
            //    columns: table => new
            //    {
            //        PaginasEstaticasId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Titulo = table.Column<string>(nullable: true),
            //        Contenido = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_PaginasEstaticas", x => x.PaginasEstaticasId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "TipoOpciones",
            //    columns: table => new
            //    {
            //        TipoOpcionId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        NombreCodigo = table.Column<string>(nullable: true),
            //        TextoLabel = table.Column<string>(nullable: true),
            //        Precio = table.Column<double>(nullable: false),
            //        CantidadFrecuencia = table.Column<int>(nullable: false),
            //        MinimoComprar = table.Column<int>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_TipoOpciones", x => x.TipoOpcionId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "TipoTransferencia",
            //    columns: table => new
            //    {
            //        TipoTransferenciaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        NombreCodigo = table.Column<string>(nullable: true),
            //        Cantidad = table.Column<double>(nullable: false),
            //        Descripcion = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_TipoTransferencia", x => x.TipoTransferenciaId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "VariableConfiguracion",
            //    columns: table => new
            //    {
            //        VariableConfiguracionId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        NombreCodigo = table.Column<string>(nullable: true),
            //        Valor = table.Column<string>(nullable: true),
            //        Tipo = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_VariableConfiguracion", x => x.VariableConfiguracionId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Usuario",
            //    columns: table => new
            //    {
            //        UsuarioId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Codigo = table.Column<string>(nullable: true),
            //        Correo = table.Column<string>(nullable: true),
            //        Password = table.Column<string>(nullable: true),
            //        Url = table.Column<string>(nullable: true),
            //        Telefono = table.Column<string>(nullable: true),
            //        Edad = table.Column<string>(nullable: true),
            //        Direccion = table.Column<string>(nullable: true),
            //        Municipio = table.Column<string>(nullable: true),
            //        Provincia = table.Column<string>(nullable: true),
            //        Rol = table.Column<string>(nullable: true),
            //        Puntos = table.Column<decimal>(type: "decimal(18, 4)", nullable: false),
            //        CantReferidos = table.Column<int>(nullable: false),
            //        Activo = table.Column<bool>(nullable: false),
            //        Bloqueado = table.Column<bool>(nullable: false),
            //        Anfitrion = table.Column<string>(nullable: true),
            //        FechaCreacion = table.Column<DateTime>(nullable: false),
            //        FechaModificacion = table.Column<DateTime>(nullable: true),
            //        FechaUltimaEntrada = table.Column<DateTime>(nullable: true),
            //        FechaDesbloqueo = table.Column<DateTime>(nullable: true),
            //        FechaUltimoAnuncio = table.Column<DateTime>(nullable: true),
            //        FechaUltimaView = table.Column<DateTime>(nullable: true),
            //        ClasesUsuariosId = table.Column<int>(nullable: true),
            //        Visible = table.Column<bool>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Usuario", x => x.UsuarioId);
            //        table.ForeignKey(
            //            name: "FK_Usuario_ClasesUsuarios_ClasesUsuariosId",
            //            column: x => x.ClasesUsuariosId,
            //            principalTable: "ClasesUsuarios",
            //            principalColumn: "ClasesUsuariosId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "CategoriaEtiqueta",
            //    columns: table => new
            //    {
            //        CategoriaEtiquetaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        EtiquetaId = table.Column<int>(nullable: false),
            //        CategoriaId = table.Column<int>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_CategoriaEtiqueta", x => x.CategoriaEtiquetaId);
            //        table.ForeignKey(
            //            name: "FK_CategoriaEtiqueta_Categoria_CategoriaId",
            //            column: x => x.CategoriaId,
            //            principalTable: "Categoria",
            //            principalColumn: "CategoriaId",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_CategoriaEtiqueta_Etiqueta_EtiquetaId",
            //            column: x => x.EtiquetaId,
            //            principalTable: "Etiqueta",
            //            principalColumn: "EtiquetaId",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Anuncios",
            //    columns: table => new
            //    {
            //        AnuncioId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Titulo = table.Column<string>(nullable: true),
            //        Descripcion = table.Column<string>(nullable: true),
            //        NombreContacto = table.Column<string>(nullable: true),
            //        TelefonoContacto = table.Column<string>(nullable: true),
            //        CorreoContacto = table.Column<string>(nullable: true),
            //        Precio = table.Column<decimal>(nullable: false),
            //        IsActivo = table.Column<bool>(nullable: false),
            //        IsVisible = table.Column<bool>(nullable: false),
            //        FechaCreacion = table.Column<DateTime>(nullable: false),
            //        FechaModificacion = table.Column<DateTime>(nullable: true),
            //        ImageContent = table.Column<string>(nullable: true),
            //        ImageMimeType = table.Column<string>(nullable: true),
            //        ImageName = table.Column<string>(nullable: true),
            //        Url = table.Column<string>(nullable: true),
            //        Provincia = table.Column<string>(nullable: true),
            //        Municipio = table.Column<string>(nullable: true),
            //        ContadorView = table.Column<int>(nullable: false),
            //        ProductoNuevo = table.Column<bool>(nullable: false),
            //        Accion = table.Column<string>(nullable: true),
            //        UsuarioId = table.Column<int>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Anuncios", x => x.AnuncioId);
            //        table.ForeignKey(
            //            name: "FK_Anuncios_Usuario_UsuarioId",
            //            column: x => x.UsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Pagos",
            //    columns: table => new
            //    {
            //        PagoId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        TransferenciaId = table.Column<int>(nullable: false),
            //        Tipo = table.Column<string>(nullable: true),
            //        CantCup = table.Column<decimal>(nullable: false),
            //        Fecha = table.Column<DateTime>(nullable: false),
            //        Estado = table.Column<string>(nullable: true),
            //        Puntos = table.Column<decimal>(type: "decimal(18, 4)", nullable: false),
            //        UsuarioId = table.Column<int>(nullable: true),
            //        Fuente = table.Column<string>(maxLength: 50, nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Pagos", x => x.PagoId);
            //        table.ForeignKey(
            //            name: "FK_Pagos_Usuario_UsuarioId",
            //            column: x => x.UsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Transferencia",
            //    columns: table => new
            //    {
            //        TransferenciaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        UsuarioId = table.Column<int>(nullable: true),
            //        UsuarioFuenteUsuarioId = table.Column<int>(nullable: true),
            //        UsuarioDestinoUsuarioId = table.Column<int>(nullable: true),
            //        Fecha = table.Column<DateTime>(nullable: false),
            //        Puntos = table.Column<decimal>(type: "decimal(18, 4)", nullable: false),
            //        TipoTransferenciaId = table.Column<int>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Transferencia", x => x.TransferenciaId);
            //        table.ForeignKey(
            //            name: "FK_Transferencia_TipoTransferencia_TipoTransferenciaId",
            //            column: x => x.TipoTransferenciaId,
            //            principalTable: "TipoTransferencia",
            //            principalColumn: "TipoTransferenciaId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Transferencia_Usuario_UsuarioDestinoUsuarioId",
            //            column: x => x.UsuarioDestinoUsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Transferencia_Usuario_UsuarioFuenteUsuarioId",
            //            column: x => x.UsuarioFuenteUsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Transferencia_Usuario_UsuarioId",
            //            column: x => x.UsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "AlmacenImagen",
            //    columns: table => new
            //    {
            //        AlmacenImagenId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Imagen = table.Column<string>(nullable: true),
            //        ImageContent = table.Column<string>(nullable: true),
            //        ImageMimeType = table.Column<string>(nullable: true),
            //        ImageName = table.Column<string>(nullable: true),
            //        AnuncioId = table.Column<int>(nullable: false),
            //        IsFree = table.Column<bool>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_AlmacenImagen", x => x.AlmacenImagenId);
            //        table.ForeignKey(
            //            name: "FK_AlmacenImagen_Anuncios_AnuncioId",
            //            column: x => x.AnuncioId,
            //            principalTable: "Anuncios",
            //            principalColumn: "AnuncioId",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            migrationBuilder.CreateTable(
                name: "AnuncioBonificados",
                columns: table => new
                {
                    AnuncioBonificadoId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AnuncioId = table.Column<int>(nullable: false),
                    UsuarioId = table.Column<int>(nullable: false),
                    FechaBoni = table.Column<DateTime>(nullable: false),
                    CantidadBonificada = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnuncioBonificados", x => x.AnuncioBonificadoId);
                    table.ForeignKey(
                        name: "FK_AnuncioBonificados_Anuncios_AnuncioId",
                        column: x => x.AnuncioId,
                        principalTable: "Anuncios",
                        principalColumn: "AnuncioId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnuncioBonificados_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            //migrationBuilder.CreateTable(
            //    name: "AnuncioEtiquetas",
            //    columns: table => new
            //    {
            //        AnuncioEtiquetaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        AnuncioId = table.Column<int>(nullable: false),
            //        EtiquetaId = table.Column<int>(nullable: false),
            //        IsFree = table.Column<bool>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_AnuncioEtiquetas", x => x.AnuncioEtiquetaId);
            //        table.ForeignKey(
            //            name: "FK_AnuncioEtiquetas_Anuncios_AnuncioId",
            //            column: x => x.AnuncioId,
            //            principalTable: "Anuncios",
            //            principalColumn: "AnuncioId",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_AnuncioEtiquetas_Etiqueta_EtiquetaId",
            //            column: x => x.EtiquetaId,
            //            principalTable: "Etiqueta",
            //            principalColumn: "EtiquetaId",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Banners",
            //    columns: table => new
            //    {
            //        BannerId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Nombre = table.Column<string>(nullable: true),
            //        Url = table.Column<string>(nullable: true),
            //        Tipo = table.Column<string>(nullable: true),
            //        CantidadDias = table.Column<int>(nullable: false),
            //        ImageContent = table.Column<string>(nullable: true),
            //        ImageMimeType = table.Column<string>(nullable: true),
            //        ImageName = table.Column<string>(nullable: true),
            //        FechaCreacion = table.Column<DateTime>(nullable: false),
            //        FechaUltView = table.Column<DateTime>(nullable: true),
            //        FechaDesactivacion = table.Column<DateTime>(nullable: true),
            //        IsActivo = table.Column<bool>(nullable: false),
            //        AnuncioId = table.Column<int>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Banners", x => x.BannerId);
            //        table.ForeignKey(
            //            name: "FK_Banners_Anuncios_AnuncioId",
            //            column: x => x.AnuncioId,
            //            principalTable: "Anuncios",
            //            principalColumn: "AnuncioId",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Notificacion",
            //    columns: table => new
            //    {
            //        NotificacionId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        FechaCReacion = table.Column<DateTime>(nullable: false),
            //        Motivo = table.Column<string>(nullable: true),
            //        Descripcion = table.Column<string>(nullable: true),
            //        Texto = table.Column<string>(nullable: true),
            //        UsuarioId = table.Column<int>(nullable: true),
            //        UsuarioCreaUsuarioId = table.Column<int>(nullable: true),
            //        AnuncioId = table.Column<int>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Notificacion", x => x.NotificacionId);
            //        table.ForeignKey(
            //            name: "FK_Notificacion_Anuncios_AnuncioId",
            //            column: x => x.AnuncioId,
            //            principalTable: "Anuncios",
            //            principalColumn: "AnuncioId",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_Notificacion_Usuario_UsuarioCreaUsuarioId",
            //            column: x => x.UsuarioCreaUsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Notificacion_Usuario_UsuarioId",
            //            column: x => x.UsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "OpcionAvanzadas",
            //    columns: table => new
            //    {
            //        OpcionAvanzadaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        CantidadDias = table.Column<int>(nullable: false),
            //        FechaDesactivacion = table.Column<DateTime>(nullable: true),
            //        IsActivo = table.Column<bool>(nullable: false),
            //        AnuncioId = table.Column<int>(nullable: false),
            //        TipoOpcionId = table.Column<int>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_OpcionAvanzadas", x => x.OpcionAvanzadaId);
            //        table.ForeignKey(
            //            name: "FK_OpcionAvanzadas_Anuncios_AnuncioId",
            //            column: x => x.AnuncioId,
            //            principalTable: "Anuncios",
            //            principalColumn: "AnuncioId",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_OpcionAvanzadas_TipoOpciones_TipoOpcionId",
            //            column: x => x.TipoOpcionId,
            //            principalTable: "TipoOpciones",
            //            principalColumn: "TipoOpcionId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Denuncias",
            //    columns: table => new
            //    {
            //        DenunciaId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Estado = table.Column<string>(nullable: true),
            //        FechaCreacion = table.Column<DateTime>(nullable: false),
            //        FechaModificacion = table.Column<DateTime>(nullable: true),
            //        MotivoDenunciaId = table.Column<int>(nullable: true),
            //        UsuarioId = table.Column<int>(nullable: true),
            //        AnuncioId = table.Column<int>(nullable: true),
            //        BannerId = table.Column<int>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Denuncias", x => x.DenunciaId);
            //        table.ForeignKey(
            //            name: "FK_Denuncias_Anuncios_AnuncioId",
            //            column: x => x.AnuncioId,
            //            principalTable: "Anuncios",
            //            principalColumn: "AnuncioId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Denuncias_Banners_BannerId",
            //            column: x => x.BannerId,
            //            principalTable: "Banners",
            //            principalColumn: "BannerId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Denuncias_MotivoDenuncia_MotivoDenunciaId",
            //            column: x => x.MotivoDenunciaId,
            //            principalTable: "MotivoDenuncia",
            //            principalColumn: "MotivoDenunciaId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Denuncias_Usuario_UsuarioId",
            //            column: x => x.UsuarioId,
            //            principalTable: "Usuario",
            //            principalColumn: "UsuarioId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateIndex(
            //    name: "IX_AlmacenImagen_AnuncioId",
            //    table: "AlmacenImagen",
            //    column: "AnuncioId");

            migrationBuilder.CreateIndex(
                name: "IX_AnuncioBonificados_AnuncioId",
                table: "AnuncioBonificados",
                column: "AnuncioId");

            migrationBuilder.CreateIndex(
                name: "IX_AnuncioBonificados_UsuarioId",
                table: "AnuncioBonificados",
                column: "UsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_AnuncioEtiquetas_AnuncioId",
            //    table: "AnuncioEtiquetas",
            //    column: "AnuncioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_AnuncioEtiquetas_EtiquetaId",
            //    table: "AnuncioEtiquetas",
            //    column: "EtiquetaId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Anuncios_UsuarioId",
            //    table: "Anuncios",
            //    column: "UsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Banners_AnuncioId",
            //    table: "Banners",
            //    column: "AnuncioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_CategoriaEtiqueta_CategoriaId",
            //    table: "CategoriaEtiqueta",
            //    column: "CategoriaId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_CategoriaEtiqueta_EtiquetaId",
            //    table: "CategoriaEtiqueta",
            //    column: "EtiquetaId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Denuncias_AnuncioId",
            //    table: "Denuncias",
            //    column: "AnuncioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Denuncias_BannerId",
            //    table: "Denuncias",
            //    column: "BannerId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Denuncias_MotivoDenunciaId",
            //    table: "Denuncias",
            //    column: "MotivoDenunciaId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Denuncias_UsuarioId",
            //    table: "Denuncias",
            //    column: "UsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Notificacion_AnuncioId",
            //    table: "Notificacion",
            //    column: "AnuncioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Notificacion_UsuarioCreaUsuarioId",
            //    table: "Notificacion",
            //    column: "UsuarioCreaUsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Notificacion_UsuarioId",
            //    table: "Notificacion",
            //    column: "UsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_OpcionAvanzadas_AnuncioId",
            //    table: "OpcionAvanzadas",
            //    column: "AnuncioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_OpcionAvanzadas_TipoOpcionId",
            //    table: "OpcionAvanzadas",
            //    column: "TipoOpcionId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Pagos_UsuarioId",
            //    table: "Pagos",
            //    column: "UsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Transferencia_TipoTransferenciaId",
            //    table: "Transferencia",
            //    column: "TipoTransferenciaId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Transferencia_UsuarioDestinoUsuarioId",
            //    table: "Transferencia",
            //    column: "UsuarioDestinoUsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Transferencia_UsuarioFuenteUsuarioId",
            //    table: "Transferencia",
            //    column: "UsuarioFuenteUsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Transferencia_UsuarioId",
            //    table: "Transferencia",
            //    column: "UsuarioId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Usuario_ClasesUsuariosId",
            //    table: "Usuario",
            //    column: "ClasesUsuariosId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "AlmacenImagen");

            migrationBuilder.DropTable(
                name: "AnuncioBonificados");

            //migrationBuilder.DropTable(
            //    name: "AnuncioEtiquetas");

            //migrationBuilder.DropTable(
            //    name: "CategoriaEtiqueta");

            //migrationBuilder.DropTable(
            //    name: "Denuncias");

            //migrationBuilder.DropTable(
            //    name: "FactoresBonificacionVentas");

            //migrationBuilder.DropTable(
            //    name: "Notificacion");

            //migrationBuilder.DropTable(
            //    name: "OpcionAvanzadas");

            //migrationBuilder.DropTable(
            //    name: "PaginasEstaticas");

            //migrationBuilder.DropTable(
            //    name: "Pagos");

            //migrationBuilder.DropTable(
            //    name: "Transferencia");

            //migrationBuilder.DropTable(
            //    name: "VariableConfiguracion");

            //migrationBuilder.DropTable(
            //    name: "Categoria");

            //migrationBuilder.DropTable(
            //    name: "Etiqueta");

            //migrationBuilder.DropTable(
            //    name: "Banners");

            //migrationBuilder.DropTable(
            //    name: "MotivoDenuncia");

            //migrationBuilder.DropTable(
            //    name: "TipoOpciones");

            //migrationBuilder.DropTable(
            //    name: "TipoTransferencia");

            //migrationBuilder.DropTable(
            //    name: "Anuncios");

            //migrationBuilder.DropTable(
            //    name: "Usuario");

            //migrationBuilder.DropTable(
            //    name: "ClasesUsuarios");
        }
    }
}
