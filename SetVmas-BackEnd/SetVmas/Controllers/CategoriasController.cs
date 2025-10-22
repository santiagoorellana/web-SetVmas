using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PagedList.Core;
using SetVmas.utils;
using SetVmas.ViewModels;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;

namespace SetVmas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class CategoriasController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Categoria> _categoriarepository;
        private readonly Repository<CategoriaEtiqueta> _categoriaEtiquetarepository;
        private readonly Repository<Etiqueta> _etiquetasrepository;
        private readonly Repository<AnuncioEtiquetas> _anuncioEtiquetarepository;
        private readonly string images_path;
        private readonly string images_categoria_path_mini;
     
        public CategoriasController(IMapper mapper, IUnitOfWork unitofwork) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;
            _categoriarepository = _unitOfWork.CategoriaRepository;
            _categoriaEtiquetarepository = _unitOfWork.CategoriaEtiquetaRepository;
            _etiquetasrepository = _unitOfWork.EtiquetaRepository;
            _anuncioEtiquetarepository = _unitOfWork.AnuncioEtiquetasRepository;
            images_path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\categorias");
            images_categoria_path_mini = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\categorias\\mini");
        }

        // GET: api/Categorias
        [HttpGet]
        public IEnumerable<CategoriaViewModel> GetCategorias(string col = "", string filter = "", string sortDirection = "asc", int pageIndex = 1, int pageSize = 10)
        {
            IEnumerable<CategoriaViewModel> lista = new List<CategoriaViewModel>();
            if (!string.IsNullOrEmpty(filter))
            {
               // lista = _mapper.Map<List<CategoriaViewModel>>(_categoriarepository.Queryable().Include(x=>x.CategoriaEtiqueta).ThenInclude(y=>y.Etiqueta).Where(p => (p.Nombre.ToLower().Contains(filter.ToLower()))).OrderBy(x => x.Nombre.ToLower()).ToPagedList(pageIndex, pageSize).ToList());
                lista = _mapper.Map<List<CategoriaViewModel>>(_categoriarepository.Queryable().Where(p => (p.Nombre.ToLower().Contains(filter.ToLower()))).OrderBy(x => x.Nombre.ToLower()).ToPagedList(pageIndex, pageSize).ToList());
            }
            else
            {
                // lista = _mapper.Map<List<CategoriaViewModel>>(_categoriarepository.Queryable().Include(x => x.CategoriaEtiqueta).ThenInclude(y => y.Etiqueta).OrderBy(x => x.Nombre.Trim().ToLower()).ToPagedList(pageIndex, pageSize).ToList());
                try
                {
                    lista = _mapper.Map<List<CategoriaViewModel>>(_categoriarepository.Queryable().OrderBy(x => x.Nombre.Trim().ToLower()).ToPagedList(pageIndex, pageSize).ToList());
                }
                catch( Exception ex)
                {
                    var a = ex;
                }
               
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
                        if ("ImageName".Equals(col))
                        {
                            lista = lista.OrderByDescending(l => l.ImageName);

                        }
                        else
                        {
                            lista = lista.OrderByDescending(l => l.CantAutoRenovables);

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
                       if ("ImageName".Equals(col))
                        {
                            lista = lista.OrderBy(l => l.ImageName);

                        }
                        else
                        {
                            lista = lista.OrderBy(l => l.CantAutoRenovables);

                        }
                        break;

                    }


            }

            return lista;

        }
        // GET: api/Categorias/Count
        [HttpGet]
        [Route("Count")]
        public int GetCategoriaCount()
        {
            return _categoriarepository.Queryable().Count();
        }

        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoria([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                Categoria categoria = await _categoriarepository.Queryable()
                    .Include(x=>x.CategoriaEtiqueta)
                    .ThenInclude(y=>y.Etiqueta)
                    .Where(x => x.CategoriaId == id).FirstAsync();

                CategoriaViewModel model;
                model = _mapper.Map<CategoriaViewModel>(categoria);

                if (model == null)
                {
                    return NotFound();
                }

                return Ok(model);
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        // PUT: api/Categorias/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PutCategoria([FromRoute] int id, [FromBody] CategoriaViewModel model)
        {
            Categoria categoria = _categoriarepository.Find(model.CategoriaId);
            string nombreImg = "";
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != categoria.CategoriaId)
            {
                return BadRequest();
            }
            if (model.ImageName != null && model.ImageName != "" )
            {
                if (categoria.ImageName != null && categoria.ImageName != "" && Tools.ExistImagen(categoria.ImageName, images_path))
                {
                    Tools.DeleteImagen(categoria.ImageName, images_path);
                    Tools.DeleteImagen(categoria.ImageName, images_categoria_path_mini);
                }

                categoria.ImageName = Tools.GenerarNombre(model.ImageName);
                Tools.SaveImages(model.ImageContent, categoria.ImageName, images_path);
                Tools.RedimensionAndSaveImages(model.ImageContent, categoria.ImageName, images_categoria_path_mini, 173, 132);
                categoria.ImageMimeType = model.ImageMimeType;
            }
            categoria.Nombre = model.Nombre;
            categoria.CantAutoRenovables = model.CantAutoRenovables;

            if (_categoriaEtiquetarepository.Queryable().Any(x => x.CategoriaId == categoria.CategoriaId))
            {
                _categoriaEtiquetarepository.DeleteRange(_categoriaEtiquetarepository.Queryable().Where(x => x.CategoriaId == categoria.CategoriaId));
                await _unitOfWork.SaveChangesAsync();
            }

            var etiquetas = model.Etiquetas;
            if (etiquetas != null && etiquetas.Count > 0)
            {
                foreach (var item in etiquetas)
                {

                    Etiqueta et = _etiquetasrepository.Queryable().First(f => f.EtiquetaId == item.EtiquetaId);
                    CategoriaEtiqueta anet = new CategoriaEtiqueta();
                    anet.Etiqueta = et;
                    anet.EtiquetaId = et.EtiquetaId;
                    anet.Categoria = categoria;
                    _categoriaEtiquetarepository.Create(anet);
                }
            }

            _categoriarepository.Update(categoria);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
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

        // POST: api/Categorias
        [HttpPost]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> PostCategoria([FromBody] CategoriaViewModel model)
        {
            Categoria categoria = new Categoria();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (model.ImageContent != null && model.ImageContent != "")
                {
                    string nombreImg = Tools.GenerarNombre(model.ImageName);
                    Tools.SaveImages(model.ImageContent, model.ImageName, images_path);
                    Tools.RedimensionAndSaveImages(model.ImageContent, nombreImg, images_categoria_path_mini, 173, 132);

                    categoria.ImageContent = "";
                    categoria.Imagen = nombreImg;
                    categoria.ImageMimeType = model.ImageMimeType;
                }
              
               
                categoria.Nombre = model.Nombre;
                categoria.CantAutoRenovables = model.CantAutoRenovables;
                List<CategoriaEtiqueta> lista = new List<CategoriaEtiqueta>();
                foreach (var item in model.Etiquetas)
                {
                    //Etiqueta et = _context.Etiqueta.First(f => f.EtiquetaId == item.etiqueta.EtiquetaId);Verificar conn deivis
                    Etiqueta et = _etiquetasrepository.Queryable().First(f => f.EtiquetaId == item.EtiquetaId);
                    et.CantUsada += 1;
                    _etiquetasrepository.Update(et);
                    CategoriaEtiqueta anet = new CategoriaEtiqueta();
                    anet.Etiqueta = et;
                    anet.EtiquetaId = et.EtiquetaId;
                    anet.Categoria = categoria;
                    lista.Add(anet);
                }
                categoria.CategoriaEtiqueta = lista;
                _categoriarepository.Create(categoria);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw;
            }

            return CreatedAtAction("GetCategoria", new { id = categoria.CategoriaId }, categoria);
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Super Administrador, Administrador")]
        public async Task<IActionResult> DeleteCategoria([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categoria = await _categoriarepository.Queryable().Include(x => x.CategoriaEtiqueta)
                    .ThenInclude(y => y.Etiqueta).Where(x=>x.CategoriaId==id).FirstAsync();
            CategoriaViewModel cat = _mapper.Map<CategoriaViewModel>(categoria);

            if (categoria == null)
            {
                return NotFound();
            }

            bool aux = false;
            foreach (var item in cat.Etiquetas)
            {
                if (_anuncioEtiquetarepository.Queryable().Any(x => x.EtiquetaId == item.EtiquetaId))
                {
                    aux = true;
                    break;

                }
            } 
            if (!aux)
            {
                _categoriaEtiquetarepository.Delete(_categoriaEtiquetarepository.Queryable().Where(x => x.CategoriaId == id).First());
                _categoriarepository.Delete(categoria);
                await _unitOfWork.SaveChangesAsync();

                return Ok(cat);
            }
            else
                return NotFound();

            

        }

        private bool CategoriaExists(int id)
        {
            return _categoriarepository.Queryable().Any(e => e.CategoriaId == id);
        }




        // GET: api/Categorias/Etiqueta/5
        [Route("Etiqueta/{id}")]
        [HttpGet]
        public IActionResult GetEtiquetasCategoria([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid || !CategoriaExists(id))
                {
                    return BadRequest(ModelState);
                }

                //var categoria = await _context.Categoria.FindAsync(id);
                List<EtiquetaViewModel> etiquetas = new List<EtiquetaViewModel>();
                Categoria categoria = _categoriarepository.Queryable().Include(x => x.CategoriaEtiqueta).First(x => x.CategoriaId == id);
                if (categoria.CategoriaEtiqueta.Count > 0)
                    foreach (var ce in categoria.CategoriaEtiqueta)
                    {
                        etiquetas.Add(_mapper.Map<EtiquetaViewModel>(_etiquetasrepository.Queryable().First(e => e.EtiquetaId == ce.EtiquetaId)));
                    }

                if (categoria == null)
                {
                    return NotFound();
                }

                return Ok(etiquetas.OrderByDescending(e => e.CantUsada));
            }
            catch (Exception)
            {

                throw;
            }

        }



    }
}