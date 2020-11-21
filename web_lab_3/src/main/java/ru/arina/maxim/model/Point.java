package ru.arina.maxim.model;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Table(name="points")
@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
//@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Point implements Serializable {


    public Point() {
    }

    public Point(int x, Double y, int r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }


    public Point(int x, Double y, int r, String result) {
        this(x, y, r);
        this.result = result;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    @Column(nullable = false)
    private int x;

    @Column(nullable = false)
    private Double y;

    @Column(nullable = false)
    private int r;

    @Column(nullable = false)
    private String result;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public int getR() {
        return r;
    }

    public void setR(int r) {
        this.r = r;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}

