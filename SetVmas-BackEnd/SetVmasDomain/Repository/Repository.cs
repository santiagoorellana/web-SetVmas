using SetVmasDomain.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmasDomain.Repository
{
    public class Repository<TEntity> where TEntity : class
    {
        private readonly setDBContext context;
        private readonly DbSet<TEntity> dbSet;

        public Repository(setDBContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }
        public void Create(TEntity entity)
        {
            dbSet.Add(entity);
        }
        public void CreateRange(IEnumerable<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                Create(entity);
            }
        }
        public TEntity Find(params object[] keyValues)
        {
            return dbSet.Find(keyValues);
        }

        public async Task<TEntity> FindAsync(params object[] keyValues)
        {
            return await dbSet.FindAsync(keyValues);
        }
        public List<TEntity> List()
        {
            return dbSet.ToList();
        }

        public void Update(TEntity entity)
        {
            dbSet.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
        }
        public void Delete(TEntity entity)
        {
            if (context.Entry(entity).State == EntityState.Detached)
            {
                dbSet.Attach(entity);
            }
            dbSet.Remove(entity);
        }
        public async Task Delete(params object[] id)
        {
            TEntity entity = await this.FindAsync(id);
            if (entity != null)
            {
                this.Delete(entity);
            }
        }

        public void DeleteRange(IEnumerable<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                dbSet.Remove(entity);
            }
        }
        public IQueryable<TEntity> Queryable()
        {
            return dbSet;
        }

       
    }
}
