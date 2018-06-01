package com.mstage.hasbrain;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by henry on 6/1/18.
 */
public class ReactWebviewManager  extends SimpleViewManager<CustomWebview>{
    public static final String REACT_CLASS = "RNTCustomWebview";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CustomWebview createViewInstance(ThemedReactContext reactContext) {
        return new CustomWebview(reactContext);
    }

    @ReactProp(name = "open")
    public void open(CustomWebview view, String url){
        view.loadUrl(url);
    }

    @ReactProp(name = "continueReading")
    public void setContinueReading(CustomWebview view, ReadableMap continueReading){
        view.scrollToPosition(continueReading.toHashMap());
    }
}
