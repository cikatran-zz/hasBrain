package com.mstage.hasbrain;

import android.content.Context;
import android.graphics.Point;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.v7.view.menu.MenuPresenter;
import android.util.AttributeSet;
import android.util.Log;
import android.view.ActionMode;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewParent;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.PopupWindow;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.zxing.common.StringUtils;

import java.util.Map;

/**
 * Created by henry on 6/1/18.
 */
public class CustomWebview extends WebView {
    ResumeWebviewClient webViewClient;
    Point resume = new Point();

    ReactContext reactContext;
    private ActionMode.Callback mActionActionModeCallback;

    boolean isLoading = false;
    double currentProgress = 0.0;

    String highlightJS = "function selectedText() {\n" +
            "        var range = window.getSelection().getRangeAt(0);\n" +
            "        var result = window.getSelection().toString();\n" +
            "        span = document.createElement('span');\n" +
            "        span.style.backgroundColor = \"yellow\";\n" +
            "        span.appendChild(range.extractContents());\n" +
            "        range.insertNode(span);\n" +
            "        return result;\n" +
            "    }";

    public CustomWebview(ReactContext context) {
        super(context, null);
        reactContext = context;
    }

    public CustomWebview(Context context, AttributeSet attrs) {
        super(context, attrs);
        initSetting();

        this.setWebChromeClient(new WebChromeClient(){
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                currentProgress = ((double)newProgress)/100;
                sendOnLoadingChanged();
            }
        });

        webViewClient = new ResumeWebviewClient(this, context);
        setWebViewClient(webViewClient);
    }

    public void changeState(int state) {
        if (state == 0) {
            isLoading = true;
        } else {
            isLoading = false;
        }
        sendOnLoadingChanged();
        if (state == 2) {
            this.evaluateJavascript(highlightJS, new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }
    }

    @Override
    public ActionMode startActionModeForChild(View originalView, ActionMode.Callback callback) {
        return super.startActionModeForChild(originalView, callback);
    }

    @Override
    public ActionMode startActionMode(ActionMode.Callback callback) {
        ViewParent parent = getParent();
        if (parent == null) {
            return null;
        }

        mActionActionModeCallback = new CustomActionModeCallback();
        return parent.startActionModeForChild(this, mActionActionModeCallback);
    }

    public void sendOnLoadingChanged() {
        WritableMap event = Arguments.createMap();
        event.putDouble("progress",currentProgress);
        event.putBoolean("isLoading", isLoading);
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "loadingChanged",
                event);
    }

    public void sendOnNavigationChanged() {
        WritableMap event = Arguments.createMap();
        event.putBoolean("canGoBack",this.canGoBack());
        event.putBoolean("canGoForward", this.canGoForward());
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "navigationChanged",
                event);
    }

    public void sendOnUrlChanged() {

        WritableMap event = Arguments.createMap();
        event.putString("url",this.getUrl());
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "urlChanged",
                event);
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
        webViewClient.loadContinueReading(resume, (float)current.get("scale"));
    }

    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {
        int height = (int) Math.floor(this.getContentHeight() * this.getScale());
        int webViewHeight = this.getMeasuredHeight();
        if(this.getScrollY() + webViewHeight >= height){
            WritableMap event = Arguments.createMap();
            event.putDouble("x", webViewClient.getScrollPosition().x);
            event.putDouble("y", webViewClient.getScrollPosition().y);
            event.putDouble("scale", this.getScale());
            ReactContext reactContext = (ReactContext)getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "scrollEnd",
                    event);
        }
        super.onScrollChanged(l, t, oldl, oldt);

    }

    public void saveScrollPosition() {
        Point scrollRatio = webViewClient.getScrollPosition();

        if (scrollRatio != null) {
            Log.d("current-progress", scrollRatio.toString());
//            save scrollRatio
        }
    }

    class CustomActionModeCallback implements ActionMode.Callback {

        @Override
        public boolean onCreateActionMode(ActionMode mode, Menu menu) {
            menu.add("Highlight")
                    .setEnabled(true)
                    .setVisible(true)
                    .setOnMenuItemClickListener(item -> {
                        evaluateJavascript("selectedText()", value -> {
                            if (value != null) {
                                Log.d("WEBVIEW", value);
                            }
                        });
                        return true;
                    });
            return true;
        }

        @Override
        public boolean onPrepareActionMode(ActionMode mode, Menu menu) {
            return false;
        }

        @Override
        public boolean onActionItemClicked(ActionMode mode, MenuItem item) {
            return false;
        }

        @Override
        public void onDestroyActionMode(ActionMode mode) {
            clearFocus();
        }
    }
}
