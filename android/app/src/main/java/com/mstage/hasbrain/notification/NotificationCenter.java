package com.mstage.hasbrain.notification;

import com.mstage.hasbrain.CustomWebview;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NotificationCenter {

    static public NotificationCenter shared = new NotificationCenter();
    private Map<String, List<NotificationObserver>> observers = new HashMap<>();

    private NotificationCenter() {}

    public void addObserver(NotificationObserver observer, String name) {
        List<NotificationObserver> observersOfName = observers.get(name);
        if (observersOfName == null) {
            observersOfName = new ArrayList<>();
        }
        observersOfName.add(observer);
        observers.put(name, observersOfName);
    }

    public void removeObserver(NotificationObserver observer, String name) {
        List<NotificationObserver> observersOfName = observers.get(name);
        if (observersOfName == null) {
            return;
        }
        if (observersOfName.indexOf(observer) != -1) {
            observersOfName.remove(observer);
        };
        observers.put(name, observersOfName);
    }

    public void postNotification(String name) {
        List<NotificationObserver> observersOfName = observers.get(name);
        if (observersOfName == null) {
            return;
        }
        for(int i = 0; i< observersOfName.size(); i++) {
            observersOfName.get(i).receiveNotification(name);
        }
    }
}
