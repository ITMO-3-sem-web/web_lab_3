package ru.arina.maxim.beans;

import ru.arina.maxim.database.DBManager;
import ru.arina.maxim.model.Point;
import ru.arina.maxim.services.AreaChecker;
import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import java.io.Serializable;
import java.util.List;


@ManagedBean(name = "pointBean")
@ApplicationScoped
public class PointBean implements Serializable {

    private int xFromForm;

    private double yFromForm;

    private boolean[] rFromForm = new boolean[5];

    private int xFromHiddenForm;

    private double yFromHiddenForm;

    private int rFromHiddenForm;

    private int x;

    private double y;

    private int r;

    private List<Point> allPoints;

    @ManagedProperty("#{dao}")
    private DBManager dbManager;


    public PointBean() {
        init();
    }

    public void init() {
        allPoints = dbManager.getAllPoints();
    }


    public void handleClearTable() {

        System.out.println("************************************");
        System.out.println("x = " + xFromForm);
        System.out.println("y = " + yFromForm);
        System.out.println("r = " + rFromHiddenForm);
    }

    public void handleSubmitHiddenForm() {

        x = xFromHiddenForm;
        y = yFromHiddenForm;
        r = rFromHiddenForm;

        addPoint(x, y, r);

        System.out.println("*****************SUBmit*******************");

        System.out.println("Handles HIDDEN form");

        System.out.println("x = " + x);
        System.out.println("y = " + y);
        System.out.println("r = " + r);

    }

    public void handleSubmitForm() {

        Integer tmpR = null;

        for (int i = 0; i < rFromForm.length; i ++ ) {
            if ( rFromForm[i] ) {
                tmpR = i + 1;
                break;
            }
        }

        if ( tmpR == null )
            throw new IllegalArgumentException("R not set. Validator has missed incorrect R.");

        r = tmpR;
        x = xFromForm;
        y = yFromForm;

        addPoint(x, y, r);
        // todo Server add point method

        System.out.println("*****************SUBmit*******************");
        System.out.println("Handles USUAL form");

        System.out.println("x = " + x);
        System.out.println("y = " + y);
        System.out.println("r = " + r);
    }


    public void handleClearForm() {
        System.out.println("Clears form");
        xFromForm = 0;
        yFromForm = 0;
        rFromForm = new boolean[]{false, false, false, false, false};
    }






    public void clearTable() {
        for (Point p : dbManager.getAllPoints()) {
            dbManager.removePoint(p);
        }
        allPoints.clear();
    }






    public void addPoint(int x, double y, int r) {
        Point currentPoint = new Point(
                x,
                y,
                r,
                AreaChecker.isInArea(x, y, r)?"YES":"NO"
        );

        allPoints.add(currentPoint);
        dbManager.addPoint(currentPoint);

    }




    public int getxFromForm() {
        return xFromForm;
    }

    public void setxFromForm(int xFromForm) {
        this.xFromForm = xFromForm;
    }

    public double getyFromForm() {
        return yFromForm;
    }

    public void setyFromForm(double yFromForm) {
        this.yFromForm = yFromForm;
    }

    public boolean[] getrFromForm() {
        return rFromForm;
    }

    public void setrFromForm(boolean[] rFromForm) {
        this.rFromForm = rFromForm;
    }

    public int getxFromHiddenForm() {
        return xFromHiddenForm;
    }

    public void setxFromHiddenForm(int xFromHiddenForm) {
        this.xFromHiddenForm = xFromHiddenForm;
    }

    public double getyFromHiddenForm() {
        return yFromHiddenForm;
    }

    public void setyFromHiddenForm(double yFromHiddenForm) {
        this.yFromHiddenForm = yFromHiddenForm;
    }

    public int getrFromHiddenForm() {
        return rFromHiddenForm;
    }

    public void setrFromHiddenForm(int rFromHiddenForm) {
        this.rFromHiddenForm = rFromHiddenForm;
    }

    public List<Point> getAllPoints() {
        return allPoints;
    }

    public void setAllPoints(List<Point> allPoints) {
        this.allPoints = allPoints;
    }
}