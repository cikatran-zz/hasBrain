package com.mstage.hasbrain;

import android.annotation.TargetApi;
import android.app.Notification;
import android.content.Context;
import android.graphics.Point;
import android.graphics.Rect;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.ActionMode;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.mstage.hasbrain.notification.NotificationCenter;
import com.mstage.hasbrain.notification.NotificationObserver;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import timber.log.Timber;

/**
 * Created by henry on 6/1/18.
 */
public class CustomWebview extends WebView implements NotificationObserver {
    public ResumeWebviewClient webViewClient;
    Point resume = new Point();
    private int topInset = 0;
    private boolean isScrolling = false;
    private Handler scrollStateHandler = new Handler();
    private int layoutHeight = 0;
    private ArrayList highlights;
    private Map<String, String> highlightedToId = new HashMap<>();

    ReactContext reactContext;
    private ActionMode.Callback mActionActionModeCallback;

    boolean isLoading = false;
    double currentProgress = 0.0;

    private class JavascriptInterface {

        @android.webkit.JavascriptInterface
        public void callback(String id) {
            if (!TextUtils.isEmpty(id) && highlightedToId.containsKey(id))
                sendRemoveHighlight(highlightedToId.get(id), id);
        }
    }

    String highlightJS = "javascript: (function selectedText(id) {\n" +
            "        var range = window.getSelection().getRangeAt(0);\n" +
            "        var result = window.getSelection().toString();\n" +
            "        if (result.length >= 10 && result.length <= 500 && result.indexOf('\\\\n') === -1) {\n" +
            "            span = document.createElement('span');\n" +
            "            span.style.backgroundColor = \"yellow\";\n" +
            "            span.appendChild(range.extractContents());\n" +
            "            span.setAttribute('id', id);\n" +
            "            span.onclick = function(event) { interface.callback(event.target.id) }\n" +
            "            range.insertNode(span);\n" +
            "            return result;\n" +
            "        }\n" +
            "        return \"_error\";\n" +
            "    })('";

    String showHighlightJS = "javascript: (function showHighlights(texts) {\n" +
            "        var innerHTML = document.body.innerHTML;\n" +
            "        for (var i = 0; i < texts.length; i++){\n" +
            "            var index = innerHTML.indexOf(texts[i]);\n" +
            "            if (index >= 0) {\n" +
            "                innerHTML = innerHTML.substring(0,index) + '<span style=\"background-color:yellow\" onclick=\"interface.callback(index)\">' + innerHTML.substring(index,index+texts[i].length) + \"</span>\" + innerHTML.substring(index + texts[i].length);\n" +
            "            }\n" +
            "        }\n" +
            "        document.body.innerHTML = innerHTML;\n" +
            "    }) ([";

    String removeHighlighJS = "javascript: (function removeHighlight(id) {\n" +
            "       document.getElementById(id.toString()).style=null; \n" +
            "    }) ('";

    String paddingContentJs = "document.getElementsByTagName(\"body\")[0].style.paddingTop = \'" + topInset + "}px\';";
    String marginHeaderJs = "document.getElementsByTagName(\"header\")[0].style.marginTop = \'" + topInset + "px\';";

    Runnable setStateNotScrolling = new Runnable() {
        @Override
        public void run() {
            isScrolling = false;
        }
    };

    public CustomWebview(ReactContext context) {
        super(context);
        reactContext = context;
        initSetting();
        this.addJavascriptInterface(new JavascriptInterface(), "interface");
    }

    public CustomWebview(Context context, AttributeSet attrs) {
        super(context, attrs);
        initSetting();
        this.addJavascriptInterface(new JavascriptInterface(), "interface");
    }


    @Override
    protected void finalize() throws Throwable {
        NotificationCenter.shared.removeObserver(this, getResources().getString(R.string.webview_reload));
        NotificationCenter.shared.removeObserver(this, getResources().getString(R.string.webview_goBack));
        NotificationCenter.shared.removeObserver(this, getResources().getString(R.string.webview_goForward));
        super.finalize();
    }

    public void changeState(int state) {
        if (state == 0) {
            isLoading = true;
        } else {
            isLoading = false;

        }
        sendOnLoadingChanged();
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
        event.putDouble("progress", currentProgress);
        event.putBoolean("isLoading", !(currentProgress == 0) && !(currentProgress == 1));
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "loadingChanged",
                event);
    }

    public void sendOnNavigationChanged() {
        WritableMap event = Arguments.createMap();
        event.putBoolean("canGoBack", this.canGoBack());
        event.putBoolean("canGoForward", this.canGoForward());
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "navigationChanged",
                event);
    }

    public void sendOnUrlChanged() {
        String url = this.getUrl();
        if (!TextUtils.isEmpty(url) && !url.equals("about:blank")) {
            WritableMap event = Arguments.createMap();
            event.putString("url", url);
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "urlChanged",
                    event);
        }
    }

    public void sendOnHighlight(String text) {
        WritableMap event = Arguments.createMap();
        event.putString("text", text);
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "highlight",
                event);
    }

    public void sendRemoveHighlight(String highlightText, String textId) {
        WritableMap event = Arguments.createMap();
        event.putString("text", highlightText);
        event.putString("id", textId);
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "removeHighlight",
                event);
    }

    public void initSetting() {

        ViewTreeObserver vto = this.getViewTreeObserver();
        vto.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                    getViewTreeObserver().removeGlobalOnLayoutListener(this);
                } else {
                    getViewTreeObserver().removeOnGlobalLayoutListener(this);
                }
                layoutHeight = getMeasuredHeight();
            }
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        this.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                currentProgress = ((double) newProgress) / 100;
                Log.d("CURRENT_PROGRESS", String.format("%f", currentProgress));
                sendOnLoadingChanged();
            }
        });
        if (webViewClient == null) {
            webViewClient = new ResumeWebviewClient(this, getContext());
            webViewClient.setTopInset(topInset);
            setWebViewClient(webViewClient);
        }

        NotificationCenter.shared.addObserver(this, getResources().getString(R.string.webview_reload));
        NotificationCenter.shared.addObserver(this, getResources().getString(R.string.webview_goBack));
        NotificationCenter.shared.addObserver(this, getResources().getString(R.string.webview_goForward));
        NotificationCenter.shared.addObserver(this, getResources().getString(R.string.webview_removeHighlight));
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
        if (current.get("x") == null || current.get("y") == null || current.get("scale") == null) {
            return;
        }
        resume = new Point(((Double) current.get("x")).intValue(), ((Double) current.get("y")).intValue());
        if (webViewClient == null) {
            webViewClient = new ResumeWebviewClient(this, getContext());
        }
        webViewClient.loadContinueReading(resume, ((Double) current.get("scale")).floatValue());
    }

    @Override
    public boolean onTouchEvent(MotionEvent e) {
        if (e.getAction() == MotionEvent.ACTION_UP && isScrolling) {
            WritableMap event = Arguments.createMap();
            event.putDouble("x", this.getScrollX());
            event.putDouble("y", this.getScrollY());
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "onScrollEndDragging",
                    event);
        }

        return super.onTouchEvent(e);
    }

    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {
        if (!isScrolling) {
            isScrolling = true;
            scrollStateHandler.removeCallbacks(setStateNotScrolling);
        } else {
            scrollStateHandler.postDelayed(setStateNotScrolling, 200);
        }
        try {
            WritableMap event = Arguments.createMap();
            event.putDouble("x", this.getScrollX());
            event.putDouble("y", this.getScrollY());
            event.putDouble("scale", this.getScaleY());
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "scrollEnd",
                    event);

            WritableMap eventOnScroll = Arguments.createMap();
            eventOnScroll.putDouble("x", this.getScrollX());
            eventOnScroll.putDouble("y", this.getScrollY());
            eventOnScroll.putInt("layoutHeight", this.layoutHeight);
            eventOnScroll.putInt("contentHeight", this.computeVerticalScrollRange());
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    "onScroll",
                    eventOnScroll
            );
        } catch (Exception e) {
            Log.d("WEBVIEW", e.getMessage());
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

    @Override
    public void receiveNotification(String name) {
        if (name.equals(getResources().getString(R.string.webview_reload))) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    reload();
                }
            });
        } else if (name.equals(getResources().getString(R.string.webview_goBack))) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    goBack();
                }
            });
        } else if (name.equals(getResources().getString(R.string.webview_goForward))) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    goForward();
                }
            });
        }
    }

    @Override
    public void receiveNotification(String name, WritableNativeMap userInfo) {
        if (name.equals(getResources().getString(R.string.webview_removeHighlight))) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    executeRemoveHighlight(userInfo.getString("id"));
                }
            });
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

            menu.add(Menu.NONE, 0, 1, "Highlight")
                    .setEnabled(true)
                    .setVisible(true)
                    .setOnMenuItemClickListener(item -> {
                        executeHighlight();
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
            if (mOriginalCallback instanceof ActionMode.Callback2) {
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

            menu.add(Menu.NONE, 0, 1, "Highlight")
                    .setEnabled(true)
                    .setVisible(true)
                    .setOnMenuItemClickListener(item -> {
                        executeHighlight();
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

    public void executeHighlight() {
        String id = UUID.randomUUID().toString();
        evaluateJavascript(highlightJS + id + "')", value -> {
            Log.v("executeHighlight", highlightJS + id + ") " + value);
            if (value != null) {
                String text = value.substring(1, value.length() - 1).trim();
                if (isValidHighlight(text)) {
                    String newText = text.trim();
                    sendOnHighlight(text);
                    highlightedToId.put(id, newText);
                } else {
                    WritableMap event = Arguments.createMap();
                    event.putInt("error", 301);
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                            getId(),
                            "highlight",
                            event);
                }
            }
        });
    }

    public void showHightlight(ArrayList highlightedTexts) {
        for (int i = 0; i < highlightedTexts.size(); i++) {
            String id = UUID.randomUUID().toString();
            String text = highlightedTexts.get(i).toString().trim();
            highlightedToId.put(id, text);
        }

        StringBuilder string = new StringBuilder("");
        for (int i = 0; i < highlightedTexts.size(); i++) {
            string.append("\"").append(highlightedTexts.get(i).toString()).append("\"");
            if (i != highlightedTexts.size() - 1)
                string.append(",");
        }

        StringBuilder idsString = new StringBuilder("");
        for (int i = 0; i < highlightedTexts.size(); i++) {
            idsString.append("\"").append(getKey(highlightedTexts.get(i).toString())).append("\"");
            if (i != highlightedTexts.size() - 1)
                idsString.append(",");
        }

        String rendered = renderHighlight(string.toString(), idsString.toString());
        evaluateJavascript(rendered, value -> {
            Log.v("showHightlight", value + ' ' + idsString);
        });
    }

    public static MenuItem findByTitle(Menu menu, String regex) {
        for (int i = 0; i < menu.size(); ++i) {
            String title = menu.getItem(i).getTitle().toString();
            if (title.matches(regex))
                return menu.getItem(i);
        }
        return null;
    }

    public void setTopInset(int topInset) {
        this.topInset = topInset;
    }

    public void setHighlights(ArrayList highlights) {
        this.highlights = (ArrayList) highlights.clone();
    }

    public void executePaddingContent() {
        evaluateJavascript(" { " + paddingContentJs + marginHeaderJs + "  }", value -> {
        });
    }

    public ArrayList getHighlights() {
        return highlights;
    }

    public boolean isValidHighlight(String text) {
        return !text.equals("_error");
    }

    public void executeRemoveHighlight(String id) {
        highlightedToId.remove(id);
        evaluateJavascript(removeHighlighJS + id + "');", value -> {
            Log.v("executeRemoveHighlight", removeHighlighJS + id + "); " + value);
        });
    }

    public String renderHighlight(String list, String ids) {
        return  "javascript: (function showHighlights(texts, ids) {\n" +
                "        var innerHTML = document.body.innerHTML;\n" +
                "        for (var i = 0; i< texts.length; i++){" +
                "           var index = innerHTML.indexOf(texts[i]);\n" +
                "        if (document.getElementById(ids[i]) != null) {\n" +
                "           var old = document.getElementById(ids[i]);\n" +
                "           var newOne = document.createElement('span');\n" +
                "           newOne.innerHTML = texts[i];\n" +
                "           newOne.setAttribute('id', ids[i]);\n" +
                "           newOne.setAttribute('style', \"background-color:yellow\");\n" +
                "           newOne.onclick = function(event) { interface.callback(event.target.id) }\n" +
                "           old.parentNode.replaceChild(newOne, old);\n" +
                "            }" +
                "         else if (index >= 0) {\n" +
                "               innerHTML = innerHTML.substring(0,index) + '<span id=' + ids[i] + ' onclick=\"interface.callback(\\\'' + ids[i].toString() + '\\\')\" style=\"background-color:yellow\">' + innerHTML.substring(index,index + texts[i].length) + \"</span>\" + innerHTML.substring(index + texts[i].length);\n" +
                "           }\n" +
                "           document.body.innerHTML = innerHTML;\n" +
                "        }" +
                "        return true;" +
                "    }) ([" + list + "], [" + ids + "])";
    }

    private String getKey(String value){
        for(String key : highlightedToId.keySet()){
            if (highlightedToId.get(key).equals(value.trim())){
                return key; //return the first found
            }
        }
        return null;
    }
}
