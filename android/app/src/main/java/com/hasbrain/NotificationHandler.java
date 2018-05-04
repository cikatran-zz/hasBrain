package com.hasbrain;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
import userkit.sdk.UserKit;
import userkit.sdk.livechat.ChatMessage;
import userkit.sdk.notification.NotificationListenerService;

public class NotificationHandler extends NotificationListenerService {
    public static final String KEY_TITLE = "title";


    @Override
    public void onNotificationReceived(String from, Bundle data) {
        String message = data.getString(KEY_MESSAGE);
        String title = data.getString(KEY_TITLE);
        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);

        /* This line allow the SDK capture notification opened events */
        pendingIntent = addStatusHandler(pendingIntent, data);

        int notifyId = 1004;
        NotificationCompat.Builder builder;

        String id = "default";

        HashMap<String, Object> temp = new HashMap<>();
        temp.put(KEY_TITLE, title);
        temp.put(KEY_MESSAGE, message);
        temp.put("isRead", true);
        saveUserkitProps(temp);

        String notificationService = Context.NOTIFICATION_SERVICE;
        NotificationManager notificationManager = (NotificationManager) getSystemService(notificationService);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String name = "Userkit notification";
            String description = "Userkit notification";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel mChannel = null;
            if (notificationManager != null) {
                mChannel = notificationManager.getNotificationChannel(id);
            }
            if (mChannel == null) {
                mChannel = new NotificationChannel(id, name, importance);
                mChannel.setDescription(description);
                mChannel.enableVibration(true);
                mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
                notificationManager.createNotificationChannel(mChannel);
            }
        }
        builder = new NotificationCompat.Builder(this, id)
                .setContentTitle(getString(R.string.app_name))
                .setContentText(message)
                .setAutoCancel(true)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent);
        Notification notification = builder.build();
        notificationManager.notify(notifyId, notification);
    }

    @Override
    public void onNewChatMessageReceived(List<ChatMessage> unreadMessages) {

    }

    @SuppressLint("CheckResult")
    public void saveUserkitProps(HashMap object) {
        UserKit.getInstance().getProfileManager().getProperty("notification", HashMap.class)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(value -> {
                    if (value.isPresent()) {
                        ArrayList<Object> dataParse = (ArrayList<Object>) ((HashMap) value.get()).get("data");
                        if (!dataParse.contains(object)) {
                            dataParse.add(0, object);
                            HashMap<String, Object> data = new HashMap<>();
                            data.put("data", dataParse);
                            UserKit.getInstance().getProfileManager().set("notification", data);
                        }
                    } else {
                        ArrayList<Object> dataParse = new ArrayList<>();
                        dataParse.add(0, object);
                        HashMap<String, Object> data = new HashMap<>();
                        data.put("data", dataParse);
                        UserKit.getInstance().getProfileManager().set("notification", data);
                    }

                });
    }
}