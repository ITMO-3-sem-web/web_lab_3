package ru.arina.maxim.beans;

import ru.arina.maxim.model.Point;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import java.io.Serializable;
import java.util.List;


//@ManagedBean(name = "pointBean")
@ApplicationScoped
public class PointBean implements Serializable {

    private double x;

    private double y;

    private boolean[] r = new boolean[5];

    private List<Point> allPoints;

//    @ManagedProperty("#{dao}")
//    private DBManager dbManager;



//    public void init() {
//        allPoints = dbManager.getAllPoints();
//    }



//    public void clearTable() {
//        for (Point p : dbManager.getAllPoints()) {
//            dbManager.removePoint(p);
//        }
//
//        allPoints.clear();
//
//    }


    private double xx, yy, rr;

//    public String addPointSuper() {
//        addPoint(xx, yy, rr);
//        return "main";
//    }


//    public void addPoint(double x, double y, double r) {
//        Point currentPoint = new Point();
//        currentPoint.setX(x);
//        currentPoint.setR(r);
//        currentPoint.setY(y);
//        currentPoint.setGetsIntoArea(inAreaChecker.isInArea(x, y, r));
//        allPoints.add(currentPoint);
//        dbManager.addPoint(currentPoint);
//
//    }


//    public String addPointsFromFields() {
//        for (int j = 0; j < r.length; j++) {
//            if (!r[j]) continue;
//
//            addPoint(x, y, j + 1.0);
//        }
//        return "main";
//    }

    public String getRValue() {

        boolean rIsSelected = false;
        String ans;
        int i;
        for ( i = 0; i < r.length; i ++ ) {
            if ( r[i] ) {
                rIsSelected = true;
                break;
            }
        }

        if ( ! rIsSelected ) {
            ans = "R not SelecteD";
        } else {
            ans = String.valueOf( i + 1 );
        }

        System.out.println("getRValue() activ.. Value _ " + ans);

        return ans;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public boolean[] getR() {
        return r;
    }

    public void setR(boolean[] r) {
        this.r = r;
    }

    public List<Point> getAllPoints() {
        return allPoints;
    }

    public void setAllPoints(List<Point> allPoints) {
        this.allPoints = allPoints;
    }

//    public DBManager getDbManager() {
//        return dbManager;
//    }

//    public void setDbManager(DBManager dbManager) {
//        this.dbManager = dbManager;
//    }

    public double getXx() {
        return xx;
    }

    public void setXx(double xx) {
        this.xx = xx;
    }

    public double getYy() {
        return yy;
    }

    public void setYy(double yy) {
        this.yy = yy;
    }

    public double getRr() {
        return rr;
    }

    public void setRr(double rr) {
        this.rr = rr;
    }
}