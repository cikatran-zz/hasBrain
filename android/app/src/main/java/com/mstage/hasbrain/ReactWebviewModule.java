package com.mstage.hasbrain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.mstage.hasbrain.notification.NotificationCenter;

public class ReactWebviewModule extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNCustomWebview";

    public ReactWebviewModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void reload() {
        NotificationCenter.shared.postNotification(getReactApplicationContext().getResources().getString(R.string.webview_reload));
    }

    @ReactMethod
    public void goBack() {
        NotificationCenter.shared.postNotification(getReactApplicationContext().getResources().getString(R.string.webview_goBack));
    }

    @ReactMethod
    public void goForward() {
        NotificationCenter.shared.postNotification(getReactApplicationContext().getResources().getString(R.string.webview_goForward));
    }

    @ReactMethod
    public void removeHighlight(String textId) {
        WritableNativeMap userinfo = new WritableNativeMap();
        userinfo.putString("id", textId);
        NotificationCenter.shared.postNotification("com.hasbrain.customwebview.removeHighlight", userinfo);
    }
}
