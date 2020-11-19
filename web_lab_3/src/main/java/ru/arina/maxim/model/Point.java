package ru.arina.maxim.model;

import java.io.Serializable;

//@Table(name="points")
//@Entity
//@ToString
//@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Point implements Serializable {


    public Point() {
    }

    public Point(Double x, Double y, Double r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }


    public Point(Double x, Double y, Double r, boolean getsIntoArea) {
        this(x, y, r);
        this.getsIntoArea = getsIntoArea;
    }

//    @Id
//    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

//    @Column(nullable = false)
    private Double x;

//    @Column(nullable = false)
    private Double y;

//    @Column(nullable = false)
    private Double r;

//    @Column(nullable = false)
    private boolean getsIntoArea;


    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }

    public boolean isGetsIntoArea() {
        return getsIntoArea;
    }

    public void setGetsIntoArea(boolean getsIntoArea) {
        this.getsIntoArea = getsIntoArea;
    }


}

