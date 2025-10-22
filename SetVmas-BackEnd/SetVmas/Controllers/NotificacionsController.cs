using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Super Administrador, Administrador")]
    public class NotificacionsController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Notificacion> _notificacionpository;

        public NotificacionsController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _notificacionpository = _unitOfWork.NotificacionRepository;
        }


        // GET: api/Notificacions
        [HttpGet]
        public IEnumerable<Notificacion> GetNotificacion()
        {
            return _notificacionpository.List();
        }

        // GET: api/Notificacions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificacion([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var notificacion = await _notificacionpository.FindAsync(id);

            if (notificacion == null)
            {
                return NotFound();
            }

            return Ok(notificacion);
        }

        // PUT: api/Notificacions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotificacion([FromRoute] int id, [FromBody] Notificacion notificacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != notificacion.NotificacionId)
            {
                return BadRequest();
            }

            _notificacionpository.Update(notificacion);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificacionExists(id))
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

        // POST: api/Notificacions
        [HttpPost]
        public async Task<IActionResult> PostNotificacion([FromBody] Notificacion notificacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _notificacionpository.Create(notificacion);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetNotificacion", new { id = notificacion.NotificacionId }, notificacion);
        }

        // DELETE: api/Notificacions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificacion([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var notificacion = await _notificacionpository.FindAsync(id);
            if (notificacion == null)
            {
                return NotFound();
            }

            _notificacionpository.Delete(notificacion);
            await _unitOfWork.SaveChangesAsync();

            return Ok(notificacion);
        }

        private bool NotificacionExists(int id)
        {
            return _notificacionpository.Queryable().Any(e => e.NotificacionId == id);
        }

    }
}