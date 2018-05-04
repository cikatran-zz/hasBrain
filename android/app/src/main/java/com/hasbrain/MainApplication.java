package com.hasbrain;

import android.app.Application;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import userkit.sdk.UserKit;
import userkit.sdk.identity.UserKitIdentity;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new HasbrainPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        MultiDex.install(this);
        SoLoader.init(this, /* native exopackage */ false);
        String token = "";
        if (BuildConfig.BUILD_TYPE == "release") {
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNWFjMmVhZmVkMGY0NGY0NzRmYWUwMzM3IiwiaWF0IjoxNTIyNzMxNTIyfQ.QquSfGGQNc0PCZppc0deIqIYQaYUh5J0R76bl0ayKjI";
        } else {
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNWFjMmVhZmVkMGY0NGY0NzRmYWUwMzM3IiwiaWF0IjoxNTIyNzIzNTgyfQ.wJcjiZKkm9A4El8Hxr5QcsIExuDh8EOrrr40vNUp7IA";
        }
        UserKit.init(this, token, "366865783618");
        UserKitIdentity.init(this, token);
    }
}
