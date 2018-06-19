package com.mstage.hasbrain;

import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.mstage.hasbrain.cache.WebpageCache;

import org.reactivestreams.Subscriber;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.ObservableSource;
import io.reactivex.ObservableTransformer;
import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Function;

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

    public class FlattenTransform1<T> implements ObservableTransformer<Iterable<T>, T> {
        @Override
        public ObservableSource<T> apply(Observable<Iterable<T>> source) {
            return source.flatMap((Function<Iterable<T>, Observable<T>>) Observable::fromIterable);
        }

    }

    @ReactMethod
    public void cacheWebPage(ReadableArray list) {
        makeFolder(basePath);
        ArrayList temp = list.toArrayList();

        Observable<String> listObservables = Observable.create(emitter -> {
            for (int i = 0; i < temp.size(); i++) {
                if (temp.get(i) != null) {
                    if (!TextUtils.isEmpty(temp.get(i).toString())) {
                        emitter.onNext(temp.get(i).toString());
                    }
                }
            }

            emitter.onComplete();
        });

        listObservables
                .buffer(3)
                .subscribe(new Observer<List<String>>() {
                    @Override
                    public void onSubscribe(Disposable d) {

                    }

                    @Override
                    public void onNext(List<String> objects) {
                        for (int i = 0; i < objects.size(); i++) {
                            (new WebpageCache(getReactApplicationContext())).getPageURL(objects.get(i), basePath);
                        }
                    }

                    @Override
                    public void onError(Throwable e) {
                        Log.i("rxjava", "onError");
                    }

                    @Override
                    public void onComplete() {
                        Log.i("rxjava", "onCompleted");
                    }

                });

    }

    private void makeFolder(String path) {
        File folder = new File(path);
        folder.mkdirs();
    }
}
