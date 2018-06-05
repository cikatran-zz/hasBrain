package com.mstage.hasbrain;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Point;
import android.graphics.Rect;
import android.os.Build;
import android.util.AttributeSet;
import android.util.Log;
import android.view.ActionMode;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

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
    public ActionMode startActionMode(ActionMode.Callback callback) {
        ActionMode.Callback wrapper = new CustomActionModeCallback(callback);
        return super.startActionMode(wrapper);
    }

    @TargetApi(Build.VERSION_CODES.M)
    @Override
    public ActionMode startActionMode(ActionMode.Callback callback, int type) {

        mActionActionModeCallback = new CustomActionModeCallbackAbove23(callback);
        return super.startActionMode(mActionActionModeCallback, ActionMode.TYPE_FLOATING);
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

        private final ActionMode.Callback mOriginalCallback;

        public CustomActionModeCallback(ActionMode.Callback mOriginalCallback) {
            this.mOriginalCallback = mOriginalCallback;
        }

        @Override
        public boolean onCreateActionMode(ActionMode mode, Menu menu) {
            boolean result = mOriginalCallback.onCreateActionMode(mode, menu);
            menu.add("Highlight")
                    .setEnabled(true)
                    .setVisible(true)
                    .setOnMenuItemClickListener(item -> {
                        evaluateJavascript("selectedText()", value -> {
                            if (value != null) {
                                Log.d("WEBVIEW", value);
                            }
                        });
                        return result;
                    });
            return result;
        }

        @Override
        public boolean onPrepareActionMode(ActionMode mode, Menu menu) {
            return mOriginalCallback.onPrepareActionMode(mode, menu);
        }

        @Override
        public boolean onActionItemClicked(ActionMode mode, MenuItem item) {
            return mOriginalCallback.onActionItemClicked(mode, item);
        }

        @Override
        public void onDestroyActionMode(ActionMode mode) {
            mOriginalCallback.onDestroyActionMode(mode);
        }
    }

    @TargetApi(Build.VERSION_CODES.M)
    class CustomActionModeCallbackAbove23 extends ActionMode.Callback2 {

        private final ActionMode.Callback mOriginalCallback;


        public CustomActionModeCallbackAbove23(ActionMode.Callback mOriginalCallback) {
            this.mOriginalCallback = mOriginalCallback;
        }

        @Override
        public void onGetContentRect(ActionMode mode, View view, Rect outRect) {
            if(mOriginalCallback instanceof ActionMode.Callback2) {
                ((ActionMode.Callback2) mOriginalCallback).onGetContentRect(mode, view, outRect);
            } else {
                super.onGetContentRect(mode, view, outRect);
            }
        }

        @Override
        public boolean onCreateActionMode(ActionMode mode, Menu menu) {
            return mOriginalCallback.onCreateActionMode(mode, menu);
        }

        @Override
        public boolean onPrepareActionMode(ActionMode mode, Menu menu) {
            boolean result = mOriginalCallback.onPrepareActionMode(mode, menu);

            menu.add("Highlight")
                    .setEnabled(true)
                    .setVisible(true)
                    .setOnMenuItemClickListener(item -> {
                        evaluateJavascript("selectedText()", value -> {
                            if (value != null) {
                                Log.d("WEBVIEW", value);
                            }
                        });
                        return result;
                    });
            return result;
        }

        @Override
        public boolean onActionItemClicked(ActionMode mode, MenuItem item) {
            return mOriginalCallback.onActionItemClicked(mode, item);
        }

        @Override
        public void onDestroyActionMode(ActionMode mode) {
            mOriginalCallback.onDestroyActionMode(mode);
        }
    }

    public static MenuItem findByTitle(Menu menu, String regex) {
        for(int i = 0; i < menu.size(); ++i) {
            String title = menu.getItem(i).getTitle().toString();
            if(title.matches(regex))
                return menu.getItem(i);
        }
        return null;
    }
}
