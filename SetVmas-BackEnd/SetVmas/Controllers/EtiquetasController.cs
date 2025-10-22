using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PagedList.Core;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;
namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class EtiquetasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Etiqueta> _etiquetasrepository;
        private readonly Repository<CategoriaEtiqueta> _categoriaEtiquetarepository;
        private readonly Repository<Categoria> _categoriarepository;
        private readonly Repository<AnuncioEtiquetas> _anuncioEtiquetarepository;

        public EtiquetasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _etiquetasrepository = _unitOfWork.EtiquetaRepository;
            _categoriaEtiquetarepository = _unitOfWork.CategoriaEtiquetaRepository;
            _categoriarepository = _unitOfWork.CategoriaRepository;
            _anuncioEtiquetarepository = _unitOfWork.AnuncioEtiquetasRepository;
        }

        // GET: api/Etiquetas
        [HttpGet]
        public IEnumerable<EtiquetaViewModel> GetEtiqueta(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 0, int pageSize = 0)
        {
            IEnumerable<EtiquetaViewModel> lista;
            if (!string.IsNullOrEmpty(filter))
            {
                //lista = _mapper.Map<List<EtiquetaViewModel>>(_etiquetasrepository.Queryable().Include(c=>c.CategoriaEtiqueta).ThenInclude(y => y.Categoria).Where(p => (p.Nombre.ToLower().Contains(filter.ToLower()))).OrderBy(x => x.Nombre).ToPagedList(pageIndex, pageSize).ToList());
                lista = _mapper.Map<List<EtiquetaViewModel>>(_etiquetasrepository.Queryable().Where(p => (p.Nombre.ToLower().Contains(filter.ToLower()))).OrderBy(x => x.Nombre).ToPagedList(pageIndex, pageSize).ToList());
            }
            else
            {
               // lista = _mapper.Map<List<EtiquetaViewModel>>(_etiquetasrepository.Queryable().Include(c => c.CategoriaEtiqueta).ThenInclude(y => y.Categoria).OrderBy(x => x.Nombre).ToPagedList(pageIndex, pageSize).ToList());
                lista = _mapper.Map<List<EtiquetaViewModel>>(_etiquetasrepository.Queryable().OrderBy(x => x.Nombre).ToPagedList(pageIndex, pageSize).ToList());

            }
            switch (sortDirection)
            {
                case "desc":
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.Nombre);

                        }
                        else
                        {
                            lista = lista.OrderByDescending(l => l.CantUsada);

                        }
                        break;
                    }

                default:
                    {
                        if ("Nombre".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.Nombre);

                        }
                        else
                        {
                            lista = lista.OrderBy(l => l.CantUsada);

                        }
                        break;
                    }
            }

            return lista;
        }

        // GET: api/Etiquetas/List
        [Route("List")]
        [HttpGet]
        public IEnumerable<EtiquetaViewModel> GetListaEtiqueta()
        {
            //Esto lo quite porque causa un gran consumo de red
          //  return _mapper.Map<List<EtiquetaViewModel>>(_etiquetasrepository.Queryable().Include(c => c.CategoriaEtiqueta).ThenInclude(y => y.Categoria).OrderByDescending(e => e.CantUsada).ToList());
            return _mapper.Map<List<EtiquetaViewModel>>(_etiquetasrepository.Queryable().OrderByDescending(e => e.CantUsada).ToList());

        }

        // GET: api/Etiquetas/Count
        [Route("Count")]
        [HttpGet]
        public int GetEtiquetasCount(string filter = "")
        {
            if (filter != null)
                return _etiquetasrepository.Queryable().Where(x => x.Nombre.ToLower().Contains(filter.ToLower())).Count();
            else
                return _etiquetasrepository.Queryable().Count();
        }


        // GET: api/Etiquetas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEtiqueta([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            // var etiqueta = await _context.Etiqueta.FindAsync(id);
        
            Etiqueta etiqueta = await _etiquetasrepository.Queryable()
                   .Include(x => x.CategoriaEtiqueta)
                   .ThenInclude(y => y.Categoria)
                   .Where(x => x.EtiquetaId == id).FirstAsync();

            EtiquetaViewModel model;
            model = _mapper.Map<EtiquetaViewModel>(etiqueta);

            if (etiqueta == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        // PUT: api/Etiquetas/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PutEtiqueta([FromRoute] int id, [FromBody] EtiquetaViewModel model)
        {
            Etiqueta etiqueta = new Etiqueta();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.EtiquetaId)
            {
                return BadRequest();
            }
            etiqueta.EtiquetaId = model.EtiquetaId;
            etiqueta.Nombre = model.Nombre;
            etiqueta.CantUsada = model.CantUsada;

            if (_categoriaEtiquetarepository.Queryable().Any(x => x.EtiquetaId == etiqueta.EtiquetaId))
            {
                _categoriaEtiquetarepository.DeleteRange(_categoriaEtiquetarepository.Queryable().Where(x => x.EtiquetaId == etiqueta.EtiquetaId));
                await _unitOfWork.SaveChangesAsync();
            }
            foreach (var item in model.Categorias)
            {

                Categoria cat = _categoriarepository.Queryable().First(f => f.CategoriaId == item.CategoriaId);

                CategoriaEtiqueta anet = new CategoriaEtiqueta();
                anet.Categoria = cat;
                anet.CategoriaId = cat.CategoriaId;
                anet.Etiqueta = etiqueta;
                _categoriaEtiquetarepository.Create(anet);
            }
  
           
            try
            {
                _etiquetasrepository.Update(etiqueta);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtiquetaExists(id))
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

        // POST: api/Etiquetas
        [HttpPost]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PostEtiqueta([FromBody] EtiquetaViewModel model)
        {
            Etiqueta etiqueta = new Etiqueta();
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (!_etiquetasrepository.Queryable().Any(x => x.Nombre == etiqueta.Nombre))
                {
                    etiqueta.Nombre = model.Nombre;
                    etiqueta.CantUsada = model.CantUsada;
                    List<CategoriaEtiqueta> lista = new List<CategoriaEtiqueta>();
                    foreach (var item in model.Categorias)
                    {
                        //Etiqueta et = _context.Etiqueta.First(f => f.EtiquetaId == item.etiqueta.EtiquetaId);Verificar conn deivis
                        Categoria cat = _categoriarepository.Queryable().First(f => f.CategoriaId == item.CategoriaId);

                        CategoriaEtiqueta anet = new CategoriaEtiqueta();
                        anet.Categoria = cat;
                        anet.CategoriaId = cat.CategoriaId;
                        anet.Etiqueta = etiqueta;
                        lista.Add(anet);
                    }
                    etiqueta.CategoriaEtiqueta = lista;
                    _etiquetasrepository.Create(etiqueta);
                    await _unitOfWork.SaveChangesAsync();
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {

                throw;
            }
            return CreatedAtAction("GetEtiqueta", new { id = etiqueta.EtiquetaId }, etiqueta);

        }

        // DELETE: api/Etiquetas/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> DeleteEtiqueta([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var etiqueta = await _etiquetasrepository.FindAsync(id);
            if (etiqueta == null)
            {
                return NotFound();
            }
            if (!_anuncioEtiquetarepository.Queryable().Any(x => x.EtiquetaId == id))
            {
                _categoriaEtiquetarepository.Delete(_categoriaEtiquetarepository.Queryable().Where(x => x.EtiquetaId == id).First());
                _etiquetasrepository.Delete(etiqueta);
                await _unitOfWork.SaveChangesAsync();

                return Ok(etiqueta);
            }
            else
                return NotFound();


        }

        private bool EtiquetaExists(int id)
        {
            return _etiquetasrepository.Queryable().Any(e => e.EtiquetaId == id);
        }
    }
}