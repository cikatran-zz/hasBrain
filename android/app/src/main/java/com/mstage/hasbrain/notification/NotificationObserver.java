package com.mstage.hasbrain.notification;

import com.facebook.react.bridge.WritableNativeMap;

public interface NotificationObserver {
    void receiveNotification(String name);
    void receiveNotification(String name, WritableNativeMap userInfo);
}
