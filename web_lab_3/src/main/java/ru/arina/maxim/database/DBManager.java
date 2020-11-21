package ru.arina.maxim.database;

import ru.arina.maxim.model.Point;

import javax.persistence.EntityManager;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import java.io.Serializable;
import java.util.List;


@ManagedBean(name = "dao")
@ApplicationScoped
public class DBManager implements Serializable {
    @PersistenceContext(unitName = "points")
    private EntityManager em;

    //    private static final String PERSISTENCE_UNIT_NAME = "points";
//    {
//        factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);
//    }

    public void addPoint(Point point) {
//        EntityManager em = factory.createEntityManager();
        em.getTransaction().begin();
        em.persist(point);
        em.getTransaction().commit();
        em.close();
    }


    public void removePoint(Point point) {
//        EntityManager em = factory.createEntityManager();
        em.getTransaction().begin();
        em.remove(point);
        em.getTransaction().commit();
        em.close();
    }


    public List<Point> getAllPoints() {
//        EntityManager em = factory.createEntityManager();
        em.getTransaction().begin();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Point> query = cb.createQuery(Point.class);
        query.select(query.from(Point.class));
//        em.getTransaction().commit();
        em.close();
        return em.createQuery(query).getResultList();
    }
}