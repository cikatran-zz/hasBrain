package com.mstage.hasbrain;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by henry on 6/1/18.
 */
public class ReactWebviewManager  extends SimpleViewManager<CustomWebview>{
    public static final String REACT_CLASS = "RNCustomWebview";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CustomWebview createViewInstance(ThemedReactContext reactContext) {
        return new CustomWebview(reactContext);
    }

    @ReactProp(name = "source")
    public void setUrl(CustomWebview view, String url){
        view.loadUrl(url);
    }

    @ReactProp(name = "initPosition")
    public void setInitPosition(CustomWebview view, ReadableMap initPosition){
        view.scrollToPosition(initPosition.toHashMap());
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        HashMap<String,Map> map = new HashMap<>();
        map.put("highlight",MapBuilder.of("registrationName","onHighlight"));
        map.put("urlChanged",MapBuilder.of("registrationName","onUrlChanged"));
        map.put("loadingChanged",MapBuilder.of("registrationName","onLoadingChanged"));
        map.put("navigationChanged", MapBuilder.of("registrationName","onNavigationChanged"));
        map.put("scrollEnd", MapBuilder.of("registrationName","onScrollEnd"));
        return map;
    }
}
