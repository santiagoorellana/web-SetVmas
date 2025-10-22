using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
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
    public class BannersController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly Repository<Banners> _bannersrepository;
        private readonly string images_path;
        private readonly string images_path_mini;
        private readonly IHostingEnvironment env;


        public BannersController(IMapper mapper, IUnitOfWork unitofwork, IHostingEnvironment env) : base(unitofwork)
        {
            _mapper = mapper;
            _unitOfWork = unitofwork;       
            _bannersrepository = _unitOfWork.BannersRepository;
            images_path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\banners");
            images_path_mini = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\banners\\mini");
            this.env = env;
        }


        // GET: api/Banners
        [Authorize(Roles = "Super Administrador, Administrador")]
        [HttpGet]
        public IEnumerable<BannerViewModel> GetBanners()
        {
            var model = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().OrderByDescending(x => x.FechaCreacion));

            return model;
        }


        // GET: api/Banners/Tipo/5
        [HttpGet]
        [Route("Tipo/{tipo}")]
        public IEnumerable<BannerViewModel> GetBannersTipo([FromRoute] string tipo)
        {
            var banners = new List<BannerViewModel>();

            //if (tipo == "Inferior")
            //    banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x=>x.Anuncio).OrderByDescending(x => x.FechaCreacion).Where(x => x.Tipo == "Inferior" && x.IsActivo==true));
            //else if (tipo == "Superior escritorio")
            //    banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x => x.Anuncio).OrderByDescending(x => x.FechaCreacion).Where(x => x.Tipo == "Superior escritorio" && x.IsActivo == true));
            //else if (tipo == "Superior movil")
            //    banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x => x.Anuncio).OrderByDescending(x => x.FechaCreacion).Where(x => x.Tipo == "Superior movil" && x.IsActivo == true));
            //else
            //    banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x => x.Anuncio).OrderByDescending(x => x.FechaCreacion).Where(x => x.Tipo != "Inferior" && x.IsActivo == true));

            if (tipo == "Inferior")
                banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x => x.Anuncio).OrderBy(x => Guid.NewGuid()).Take(20).Where(x => x.Tipo == "Inferior" && x.IsActivo == true));
            else if (tipo == "Superior escritorio")
                banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x => x.Anuncio).Where(x => x.Tipo == "Superior escritorio" && x.IsActivo == true));
            else if (tipo == "Superior movil")
                banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x => x.Anuncio).Where(x => x.Tipo == "Superior movil" && x.IsActivo == true));
            else
                banners = _mapper.Map<List<BannerViewModel>>(_bannersrepository.Queryable().Include(x => x.Anuncio).Where(x => x.Tipo != "Inferior" && x.IsActivo == true));

       

            return banners;
        }

        // GET: api/Banners/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBanner([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var banner = await _bannersrepository.FindAsync(id);

            if (banner == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<BannerViewModel>(banner));
        }

        // PUT: api/Banners/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBanner([FromRoute] int id, [FromBody] Banners banner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != banner.BannerId)
            {
                return BadRequest();
            }

            _bannersrepository.Update(banner);

            try
            {
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BannerExists(id))
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

        // POST: api/Banners
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostBanner([FromBody] Banners banner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Tools.SaveImages(banner.ImageContent, banner.ImageName, images_path);
            Tools.RedimensionAndSaveImages(banner.ImageContent, banner.ImageName, images_path_mini, 166, 322);
            banner.ImageContent = "";
            _bannersrepository.Create(banner);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction("GetBanner", new { id = banner.BannerId }, banner);
        }

        // DELETE: api/Banners/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var banner = await _bannersrepository.FindAsync(id);
            if (banner == null)
            {
                return NotFound();
            }

            _bannersrepository.Delete(banner);
            await _unitOfWork.SaveChangesAsync();

            return Ok(_mapper.Map<BannerViewModel>(banner));
        }

        private bool BannerExists(int id)
        {
            return _bannersrepository.Queryable().Any(e => e.BannerId == id);
        }

        // GET: api/Banners/5
        [HttpGet]
        [Route("url")]
        public async Task<IActionResult> GetUrl()
        {
            var p = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\anuncios\\8991_digital_strawberry_6.jpg");
            var path = env.WebRootFileProvider.GetFileInfo("anuncios/8991_digital_strawberry_6.jpg")?.PhysicalPath;
            var image = System.IO.File.OpenRead(p);
            return File(image, "image/jpg");
        }

        [HttpGet]
        [Route("url2")]
        public string GetUrl2()
        {
            var p = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\anuncios\\8991_digital_strawberry_6.jpg");
           // var path = env.WebRootFileProvider.GetFileInfo("anuncios/8991_digital_strawberry_6.jpg")?.PhysicalPath;
            var image = System.IO.File.OpenRead(p);
            //return File(image, "image/jpg");
            return p;
        }

    }
}