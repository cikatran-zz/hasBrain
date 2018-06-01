package com.mstage.hasbrain;

import android.content.Context;
import android.graphics.Point;
import android.os.Build;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;

/**
 * Created by henry on 6/1/18.
 */
public class CustomWebview extends WebView {
    ResumeWebviewClient webViewClient;
    Point resume = new Point();

    ReactContext reactContext;

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public CustomWebview(Context context, ReactContext rContext) {
        super(context, null);
        reactContext = rContext;
    }

    public CustomWebview(Context context, AttributeSet attrs) {
        super(context, attrs);
        initSetting();

        webViewClient = new ResumeWebviewClient(this, context);
        setWebViewClient(webViewClient);
    }

    public void changeState(int state) {
        WritableMap params = Arguments.createMap();
        params.putInt("loading", state);
        sendEvent(reactContext, "onLoading", params);
    }

    public void initSetting() {
        WebSettings settings = this.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setLoadWithOverviewMode(true);
        settings.setSaveFormData(false);
        settings.setUseWideViewPort(true);
        settings.setSavePassword(false);
        settings.setSupportZoom(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setDomStorageEnabled(true);
        setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        setScrollbarFadingEnabled(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            setRendererPriorityPolicy(RENDERER_PRIORITY_IMPORTANT, true);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
    }

    public void scrollToPosition(Map<String, Object> current) {
        resume = new Point((int) current.get("x"), (int) current.get("y"));
        if (webViewClient == null) {
            webViewClient = new ResumeWebviewClient(this, getContext());
        }
        webViewClient.loadContinueReading(resume);
    }

    public void saveScrollPosition() {
        Point scrollRatio = webViewClient.getScrollPosition();

        if (scrollRatio != null) {
            Log.d("current-progress", scrollRatio.toString());
//            save scrollRatio
        }
    }

//    public CustomWebview(Context context, AttributeSet attrs, int defStyleAttr) {
//        super(context, attrs, defStyleAttr);
//    }
//
//    public CustomWebview(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
//        super(context, attrs, defStyleAttr, defStyleRes);
//    }
//
//    public CustomWebview(Context context, AttributeSet attrs, int defStyleAttr, boolean privateBrowsing) {
//        super(context, attrs, defStyleAttr, privateBrowsing);
//    }
}
