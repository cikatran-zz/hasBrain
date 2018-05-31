package com.mstage.hasbrain;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.support.annotation.Nullable;
import android.support.customtabs.CustomTabsIntent;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.mstage.hasbrain.lib.customwebview.CustomTabActivityHelper;

import static com.mstage.hasbrain.MainActivity.reactContext;
import static com.mstage.hasbrain.MainActivity.setReactContext;

/**
 * Created by henry on 5/17/18.
 */
public class CustomWebviewFramework extends ReactContextBaseJavaModule {

    public static final String REACT_MODULE = "RNCustomWebview";
    public static int RESULT_CODE = 100;

    public CustomWebviewFramework(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void open(String url, String title) {
        setReactContext(getReactApplicationContext());
        Intent intent = new Intent(getCurrentActivity(), CustomAndroidWebviewActivity.class);
        intent.putExtra("url", url);
        getCurrentActivity().startActivityForResult(intent, RESULT_CODE);
    }

    private PendingIntent createPendingIntent(int actionSourceId) {
        Intent actionIntent = new Intent(
                this.getReactApplicationContext(), ActionBroadcastReceiver.class);
        actionIntent.putExtra(ActionBroadcastReceiver.KEY_ACTION_SOURCE, actionSourceId);
        return PendingIntent.getBroadcast(getReactApplicationContext(), actionSourceId, actionIntent, 0);
    }

    static public class ActionBroadcastReceiver extends BroadcastReceiver {
        public static final String KEY_ACTION_SOURCE = "org.chromium.customtabsdemos.ACTION_SOURCE";
        public static final int ACTION_SCROLL = 1;
        public static final int ACTION_DISMISS = 2;
        public static final int ACTION_URL_CHANGE = 3;
        public static final int ACTION_BOOKMARK = 4;
        public static final int ACTION_SHARE = 5;
        public static final int ACTION_DONE_READING = 6;


        private void sendEvent(ReactContext reactContext,
                               String eventName,
                               @Nullable WritableMap params) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            Toast.makeText(context, "ABC", Toast.LENGTH_SHORT).show();
            int actionValue = intent.getIntExtra(KEY_ACTION_SOURCE, 0);
            switch (actionValue) {
                case ACTION_SCROLL: {
                    break;
                }
                case ACTION_DISMISS: {
                    break;
                }
                case ACTION_URL_CHANGE: {
                    break;
                }
                case ACTION_BOOKMARK: {
                    WritableMap params = Arguments.createMap();
                    params.putBoolean("bookmarked", true);
                    sendEvent(reactContext, "onBookmark", params);
                    break;
                }
                case ACTION_SHARE: {
                    sendEvent(reactContext, "onShare", null);
                    break;
                }
                case ACTION_DONE_READING: {
                    break;
                }
                default: {
                    break;
                }
            }


        }

    }
}
