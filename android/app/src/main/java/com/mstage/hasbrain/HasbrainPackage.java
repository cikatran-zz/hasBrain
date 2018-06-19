package com.mstage.hasbrain;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by henry on 5/4/18.
 */
public class HasbrainPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {

        List<NativeModule> modules = new ArrayList<>();
        modules.add(new AndroidUserKitFramework(reactContext));
        modules.add(new AndroidUserKitIdentityFramework(reactContext));
        modules.add(new ReactWebviewModule(reactContext));
        modules.add(new CacheModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> managerList = new ArrayList<>();
        managerList.add(new ReactWebviewManager());
        return managerList;
    }
}
