using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SetVmas.utils;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AlmacenImagensController : BaseController
    {
        private readonly Repository<AlmacenImagen> _almacenRepository;
        private readonly string images_path;
        public AlmacenImagensController(IUnitOfWork unitofwork) : base(unitofwork)
        {
            _unitOfWork = unitofwork;
            _almacenRepository = _unitOfWork.AlmacenImagenRepository;
            images_path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\almacen");
        }

        // GET: api/AlmacenImagens
        [HttpGet]
        public IEnumerable<AlmacenImagen> GetAlmacenImagen()
        {
            return _almacenRepository.List();
        }

        // GET: api/AlmacenImagens/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlmacenImagen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var almacenImagen = await _almacenRepository.FindAsync(id);

            if (almacenImagen == null)
            {
                return NotFound();
            }

            return Ok(almacenImagen);
        }

        // PUT: api/AlmacenImagens/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlmacenImagen([FromRoute] int id, [FromBody] AlmacenImagen almacenImagen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != almacenImagen.AlmacenImagenId)
            {
                return BadRequest();
            }

            _almacenRepository.Update(almacenImagen);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlmacenImagenExists(id))
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

        // POST: api/AlmacenImagens
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpPost]
        public async Task<IActionResult> PostAlmacenImagen([FromBody] AlmacenImagen almacenImagen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

             Tools.SaveImages(almacenImagen.ImageContent, almacenImagen.ImageName, images_path);
             almacenImagen.ImageContent = "";
            _almacenRepository.Create(almacenImagen);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetAlmacenImagen", new { id = almacenImagen.AlmacenImagenId }, almacenImagen);
        }

        // DELETE: api/AlmacenImagens/5
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlmacenImagen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var almacenImagen = await _almacenRepository.FindAsync(id);
            if (almacenImagen == null)
            {
                return NotFound();
            }

            _almacenRepository.Delete(almacenImagen);
            await _unitOfWork.SaveChangesAsync();

            return Ok(almacenImagen);
        }

        private bool AlmacenImagenExists(int id)
        {
            return _almacenRepository.Queryable().Any(e => e.AlmacenImagenId == id);
        }
    }
}