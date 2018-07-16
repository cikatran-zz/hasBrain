package com.mstage.hasbrain;

import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.zxing.common.StringUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by henry on 6/1/18.
 */
public class ReactWebviewManager extends SimpleViewManager<CustomWebview> {
    public static final String REACT_CLASS = "RNCustomWebview";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CustomWebview createViewInstance(ThemedReactContext reactContext) {
        return new CustomWebview(reactContext);
    }

    public static String convertStreamToString(InputStream is) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        reader.close();
        return sb.toString();
    }

    public static String getStringFromFile(File filePath) throws Exception {
        FileInputStream fin = new FileInputStream(filePath);
        String ret = convertStreamToString(fin);
        //Make sure you close all streams.
        fin.close();
        return ret;
    }

    @ReactProp(name = "source")
    public void setUrl(CustomWebview view, String url) {

        if (!TextUtils.isEmpty(url) && !url.equals("about:blank")) {
            File webPageFile = new File(view.getContext().getCacheDir(), "webpage/" + url.hashCode() + ".html");
            File webPageFolder = new File(view.getContext().getCacheDir(), "webpage/" + url.hashCode());
            if (webPageFile.exists()) {
                try {
                    String webpage = getStringFromFile(webPageFile);
                    URL temp = new URL(url);
                    String baseUrl = temp.getProtocol() + "://" + temp.getHost();
                    view.loadDataWithBaseURL(baseUrl, webpage, "text/html", "utf-8", null);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                view.loadUrl(url);
            }
            (view.webViewClient).updateFolder(webPageFolder);
        }


    }

    @ReactProp(name = "topInset")
    public void setTopInset(CustomWebview view, Integer topInsect) {
        view.setTopInset(topInsect);
    }

    @ReactProp(name = "initPosition")
    public void setInitPosition(CustomWebview view, ReadableMap initPosition) {
        view.scrollToPosition(initPosition.toHashMap());
    }

    @ReactProp(name = "highlights")
    public void setHighlights(CustomWebview view, ReadableArray highlights) {
        if (highlights != null) {
            ArrayList stringParsedList = new ArrayList();
            for (int i = 0; i < highlights.size(); i++) {
                stringParsedList.add(highlights.getString(i));
            }
            view.setHighlights(stringParsedList);
        }
        else view.setHighlights(null);
    }



    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        HashMap<String, Map> map = new HashMap<>();
        map.put("highlight", MapBuilder.of("registrationName", "onHighlight"));
        map.put("urlChanged", MapBuilder.of("registrationName", "onUrlChanged"));
        map.put("loadingChanged", MapBuilder.of("registrationName", "onLoadingChanged"));
        map.put("navigationChanged", MapBuilder.of("registrationName", "onNavigationChanged"));
        map.put("scrollEnd", MapBuilder.of("registrationName", "onScrollEnd"));
        map.put("onScroll", MapBuilder.of("registrationName", "onScroll"));
        map.put("onScrollEndDragging", MapBuilder.of("registrationName", "onScrollEndDragging"));
        map.put("removeHighlight", MapBuilder.of("registrationName", "onHighlightRemove"));
        return map;
    }


}
