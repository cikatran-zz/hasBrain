package com.hasbrain;

import android.app.Application;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.codepush.react.CodePush;
import com.BV.LinearGradient.LinearGradientPackage;
import com.BV.LinearGradient.LinearGradientPackage;
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
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new SvgPackage(),
            new LinearGradientPackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
                    new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new LinearGradientPackage(),
                    new LinearGradientPackage(),
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
//        if (BuildConfig.BUILD_TYPE == "release") {
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNWFkODU4MjRiM2NlYzM0MTUzMDRhZWI2IiwiaWF0IjoxNTI0MTI5MTI2fQ.4HywQhdO-7LEEYcwrAsybLqBArgzHbD0sy2yScU2Rjk";
//        } else {
//            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNTllMDNhYWEwYmY1Y2MxNTIwODJkY2E4In0.qgCtZ9FA7bPUCRpG4HR8ql0cF1tPssgzaJkMFjkac9U";
//        }
        UserKit.init(this, token, "366865783618");
        UserKitIdentity.init(this, token);
    }
}
