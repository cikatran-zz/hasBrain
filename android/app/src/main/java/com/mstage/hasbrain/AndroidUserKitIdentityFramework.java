package com.mstage.hasbrain;

import android.annotation.SuppressLint;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.Gson;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
import userkit.sdk.identity.UserKitIdentity;
import userkit.sdk.identity.exception.IdentityException;
import userkit.sdk.identity.model.AccountProfile;
import userkit.sdk.identity.model.ProfileProperties;

/**
 * Created by henry on 4/2/18.
 */
public class AndroidUserKitIdentityFramework extends ReactContextBaseJavaModule {
    public static final String REACT_MODULE = "RNUserKitIdentity";
    Gson gson = new Gson();

    public AndroidUserKitIdentityFramework(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void signOut() {
        UserKitIdentity.getInstance().getAccountManager().logout();
    }

    @ReactMethod
    public void getProfileInfo(Callback callback) {
        UserKitIdentity.getInstance().getAccountManager().getAccountProfiles()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountProfiles -> {
                    if (accountProfiles.size() == 0) {
                        WritableNativeArray array = new WritableNativeArray();
                        array.pushMap(new WritableNativeMap());
                        callback.invoke(null, array);
                    }
                    AccountProfile profile = accountProfiles.get(0);
                    WritableNativeMap map = new WritableNativeMap();
                    map.putString("name", profile.getName());
                    map.putString("email", profile.getAccountEmail());
                    if (profile.getProperties().get("age") == null) {
                        map.putNull("age");
                    } else {
                        map.putString("age", profile.getProperties().get("age").toString());
                    }
                    if (profile.getProperties().get("sex") == null) {
                        map.putNull("sex");
                    } else {
                        map.putString("sex", (String) profile.getProperties().get("sex"));
                    }
                    if (profile.getId() == null) {
                        map.putNull("id");
                    } else {
                        map.putString("id", profile.getId());
                    }
                    if (UserKitIdentity.getInstance().getAccountManager().getAccessToken() == null) {
                        map.putNull("authToken");
                    } else {
                        map.putString("authToken", UserKitIdentity.getInstance().getAccountManager().getAccessToken());
                    }

                    WritableNativeArray array = new WritableNativeArray();
                    array.pushMap(map);
                    callback.invoke(null, array);

                }, throwable -> callback.invoke(((IdentityException) throwable).toJsonString(), null));
    }


    @ReactMethod
    public void checkSignIn(Callback callback) {
        boolean isSignIn = UserKitIdentity.getInstance().getAccountManager().isLoggedIn();
        WritableNativeArray array = new WritableNativeArray();
        array.pushString("{\"is_sign_in\":" + isSignIn + "}");
        callback.invoke(null, array);
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void signUpWithEmail(String email, String password, ReadableMap properties, Callback callback) {
        UserKitIdentity.getInstance().signUp(email, password, new ProfileProperties(properties.toHashMap()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(gson.toJson(accountInfo));
                    callback.invoke(null, array);
                }, throwable -> callback.invoke(((IdentityException) throwable).toJsonString(), null));
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void signInWithEmail(String email, String password, Callback callback) {
        UserKitIdentity.getInstance().loginWithEmailAndPassword(email, password)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(gson.toJson(accountInfo));
                    callback.invoke(null, array);
                }, throwable -> callback.invoke(((IdentityException) throwable).toJsonString(), null));
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void signInWithFacebookAccount(String facebookAuthToken, Callback callback) {
        UserKitIdentity.getInstance().loginWithFacebookAccount(facebookAuthToken)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(gson.toJson(accountInfo));
                    callback.invoke(null, array);
                }, throwable -> callback.invoke(((IdentityException) throwable).toJsonString(), null));
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void signInWithGooglePlusAccount(String googlePlusToken, Callback callback) {
        UserKitIdentity.getInstance().loginWithGooglePlusAccount(googlePlusToken)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    WritableNativeArray array = new WritableNativeArray();
                    array.pushString(gson.toJson(accountInfo));
                    callback.invoke(null, array);
                }, throwable -> callback.invoke(((IdentityException) throwable).toJsonString(), null));
    }

}
