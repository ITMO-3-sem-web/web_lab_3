package ru.arina.maxim.services;
public class AreaChecker {

    private AreaChecker(){}
    public static boolean isInArea(int x, double y, int r){
        return firstQuarter(x,y,r) || thirdQuarter(x,y,r) || fourthQuarter(x,y,r);
    }

    public static boolean firstQuarter(int x, double y, int r){
        return x >= 0 && y >= 0 && x <= r && y <= r;
    }

    public static boolean thirdQuarter(int x, double y, int r){
        return x <= 0 && y <= 0 &&  x*x + y*y <= r*r;
    }

    public static boolean fourthQuarter(int x, double y, int r){
        return x >= 0 && y <= 0 && y >= (1.0*x / 2) - (1.0*r / 2);
    }
}
