using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnuncioBonificadoesController : BaseController
    {
        private readonly setDBContext _context;

        private readonly IMapper _mapper;
        public IConfiguration Configuration { get; }
        private readonly Repository<Usuario> _usuariorepository;
        private readonly Repository<ClasesUsuarios> _clasesUsuariosrepository;
        private readonly Repository<Transferencia> _transferenciasrepository;
        private readonly Repository<Pagos> _pagosrepository;
        private readonly Repository<TipoTransferencia> _tiposTransferenciasrepository;
        private readonly Repository<VariableConfiguracion> _configrepository;
        private readonly Repository<Anuncios> _anunciosRepository;
        private readonly Repository<Banners> _bannersrepository;
        private readonly Repository<OpcionAvanzadas> _opcionesAvanzadasrepository;
        private readonly Repository<Denuncias> _denunciasrepository;
        private readonly Repository<FactoresBonificacionVentas> _factoresbonificacionventaspository;
        static Random random;

        public AnuncioBonificadoesController(IMapper mapper, IUnitOfWork unitofwork, IConfiguration configuration) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            Configuration = configuration;
            _usuariorepository = _unitOfWork.UsuarioRepository;
            _clasesUsuariosrepository = _unitOfWork.ClasesUsuariosRepository;
            _transferenciasrepository = _unitOfWork.TransferenciaRepository;
            _pagosrepository = _unitOfWork.PagosRepository;
            _tiposTransferenciasrepository = _unitOfWork.TipoTransferenciaRepository;
            _configrepository = _unitOfWork.VariableConfiguracionRepository;
            _anunciosRepository = _unitOfWork.AnunciosRepository;
            _bannersrepository = _unitOfWork.BannersRepository;
            _opcionesAvanzadasrepository = _unitOfWork.OpcionAvanzadasRepository;
            _denunciasrepository = _unitOfWork.DenunciasRepository;
            _factoresbonificacionventaspository = _unitOfWork.FactoresBonificacionVentasRepository;
        }

        // GET: api/AnuncioBonificadoes
        [HttpGet]
        public IEnumerable<AnuncioBonificado> GetAnuncioBonificados()
        {
            return _context.AnuncioBonificados;
        }

        // GET: api/AnuncioBonificadoes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnuncioBonificado([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var anuncioBonificado = await _context.AnuncioBonificados.FindAsync(id);

            if (anuncioBonificado == null)
            {
                return NotFound();
            }

            return Ok(anuncioBonificado);
        }

        // PUT: api/AnuncioBonificadoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnuncioBonificado([FromRoute] int id, [FromBody] AnuncioBonificado anuncioBonificado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != anuncioBonificado.AnuncioBonificadoId)
            {
                return BadRequest();
            }

            _context.Entry(anuncioBonificado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnuncioBonificadoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/AnuncioBonificadoes
        [HttpPost]
        public async Task<IActionResult> PostAnuncioBonificado([FromBody] AnuncioBonificado anuncioBonificado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AnuncioBonificados.Add(anuncioBonificado);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnuncioBonificado", new { id = anuncioBonificado.AnuncioBonificadoId }, anuncioBonificado);
        }

        // DELETE: api/AnuncioBonificadoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnuncioBonificado([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var anuncioBonificado = await _context.AnuncioBonificados.FindAsync(id);
            if (anuncioBonificado == null)
            {
                return NotFound();
            }

            _context.AnuncioBonificados.Remove(anuncioBonificado);
            await _context.SaveChangesAsync();

            return Ok(anuncioBonificado);
        }

        private bool AnuncioBonificadoExists(int id)
        {
            return _context.AnuncioBonificados.Any(e => e.AnuncioBonificadoId == id);
        }
    }
}