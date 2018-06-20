package com.mstage.hasbrain;

import android.content.Context;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.Cache;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;

/**
 * Created by henry on 4/10/18.
 */
public class MyOkhttpModule {
    static String HASBRAIN_CACHE_DIR = "hasbrain_http_cache";
    static long DEFAULT_CACHE_SIZE = 30 * 1024 * 1024L; // 30MB
    static long DEFAULT_READ_TIMEOUT_MILLIS = 20 * 1000L; // 20s
    static long DEFAULT_WRITE_TIMEOUT_MILLIS = 20 * 1000L; // 20s
    static long DEFAULT_CONNECT_TIMEOUT_MILLIS = 15 * 1000L; // 15s
    static int MAX_RETRY_TIME = 2;
    private static OkHttpClient mOkHttpClient;
    private static MyOkhttpModule instance;

    MyOkhttpModule(Context context) {
        mOkHttpClient = new OkHttpClient.Builder()
                .connectTimeout(DEFAULT_CONNECT_TIMEOUT_MILLIS, TimeUnit.MILLISECONDS)
                .readTimeout(DEFAULT_READ_TIMEOUT_MILLIS, TimeUnit.MILLISECONDS)
                .writeTimeout(DEFAULT_WRITE_TIMEOUT_MILLIS, TimeUnit.MILLISECONDS)
                .followRedirects(true)
                .cache(new Cache(new File(context.getCacheDir(), HASBRAIN_CACHE_DIR), DEFAULT_CACHE_SIZE))
                .retryOnConnectionFailure(true)
                .addInterceptor(new Interceptor() {
                    @Override
                    public Response intercept(Chain chain) throws IOException {
                        Request originalRequest = chain.request();
                        Response response = chain.proceed(originalRequest);

                        int tryCount = 0;
                        while (!response.isSuccessful() && tryCount < MAX_RETRY_TIME) {
                            tryCount++;
                            response = chain.proceed(originalRequest);
                        }
                        return response;
                    }
                })
                .addNetworkInterceptor(new HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
                .build();
    }

    public static void init(Context context) {
        instance = new MyOkhttpModule(context);
    }

    public static MyOkhttpModule getInstance() {
        return instance;
    }

    public OkHttpClient getmOkHttpClient() {
        return mOkHttpClient;
    }
}
