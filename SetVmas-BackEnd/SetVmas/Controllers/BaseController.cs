using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SetVmasDomain.Models;
using SetVmasDomain.Repository;
using Microsoft.EntityFrameworkCore;

namespace SetVmas.Controllers
{
    public abstract class BaseController : Controller
    {
        public IUnitOfWork _unitOfWork;
        private readonly Repository<VariableConfiguracion> _configrepository;
        private readonly Repository<Usuario> _usuariorepository;

        protected BaseController(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
            _configrepository = unitOfWork.VariableConfiguracionRepository;
            _usuariorepository = _unitOfWork.UsuarioRepository;
        }

        public string getFromMail()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "Correo_Origen").Valor;
        }

        public string getHost()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "Host_Mail").Valor;
        }

        public string getPortMail()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "Port_Mail").Valor;
        }

        public string getUserMail()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "User_Mail").Valor;
        }

        public string getPassMail()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "Pass_Mail").Valor;
        }
         public string getSecurityMail()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "Security_Mail").Valor;
        }

        public string getPrivacyNote()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "Nota_Privac").Valor;
        }

        public string getRem()
        {
            return _configrepository.Queryable().First(a => a.NombreCodigo == "Nombre_Remitente").Valor;
        }

        public Usuario CurrentUser()
        {
            string correo = User.Claims.ToArray()[0].Value;

            Usuario usuario = _usuariorepository.Queryable().Include(x => x.ClasesUsuarios).Where(x => (x.Correo == correo)).First();

            return usuario;
        }
    }
}