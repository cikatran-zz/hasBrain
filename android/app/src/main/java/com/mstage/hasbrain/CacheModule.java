package com.mstage.hasbrain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.mstage.hasbrain.cache.WebpageCache;

import java.io.File;
import java.util.ArrayList;

/**
 * Created by henry on 6/19/18.
 */
public class CacheModule extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNCache";
    String basePath;

    public CacheModule(ReactApplicationContext reactContext) {
        super(reactContext);
        basePath = reactContext.getCacheDir() + "/webpage/";
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void cacheWebPage(ReadableArray list) {
        makeFolder(basePath);
        ArrayList temp = list.toArrayList();
//        for (int i = 0; i < temp.size(); i++) {
            (new WebpageCache(getReactApplicationContext())).getPageURL(temp.get(5).toString(), basePath);
//        }
    }

    private void makeFolder(String path) {
        File folder = new File(path);
        folder.mkdirs();
    }
}
