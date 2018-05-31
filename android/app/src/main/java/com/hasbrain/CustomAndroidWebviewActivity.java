package com.hasbrain;

import android.app.Activity;
import android.content.ContentValues;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import static android.webkit.WebView.RENDERER_PRIORITY_IMPORTANT;

public class CustomAndroidWebviewActivity extends AppCompatActivity {

    String TAG = "CustomAndroidWebviewActivity";
    ResumeWebviewClient webViewClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_PROGRESS);
        setContentView(R.layout.activity_custom_android_webview);

        WebView webview = (WebView) findViewById(R.id.webview);
//        final Activity activity = this;
//        webview.setWebChromeClient(new WebChromeClient() {
//            public void onProgressChanged(WebView view, int progress) {
//                // Activities and WebViews measure progress with different scales.
//                // The progress meter will automatically disappear when we reach 100%
//                activity.setProgress(progress * 1000);
//            }
//        });

        float scrollPosition = 0.052536488f;

//
        webViewClient = new ResumeWebviewClient(scrollPosition, webview, this);
        webview.setWebViewClient(webViewClient);

//        webview.setWebViewClient(new WebViewClient() {
//            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
//                Toast.makeText(activity, "Oh no! " + description, Toast.LENGTH_SHORT).show();
//            }
//        });

        WebSettings settings = webview.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setLoadWithOverviewMode(true);
        settings.setSaveFormData(false);
        settings.setUseWideViewPort(true);
        settings.setSavePassword(false);
        settings.setSupportZoom(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setDomStorageEnabled(true);
        webview.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        webview.setScrollbarFadingEnabled(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            webview.setRendererPriorityPolicy(RENDERER_PRIORITY_IMPORTANT, true);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            webview.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            webview.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }

        String url = getIntent().getStringExtra("url");

        //        Readability4J readability4J = new Readability4J(url, html);
//        net.dankito.readability4j.Article article = readability4J.parse();
//
//        String url = "https://example.com/article.html";


//        HandlerThread handlerThread = new HandlerThread("URLConnection");
//        handlerThread.start();
//        Handler mainHandler = new Handler(handlerThread.getLooper());
//        Runnable myRunnable = new Runnable() {
//            @Override
//            public void run() {
//                try {
//                    long tStart = System.currentTimeMillis();
//                    Readability readability = new Readability(new URL(url), 10000) {
//                        @Override
//                        protected void dbg(String msg) {
//                            Log.d("url", msg);
//
//                        }
//
//                        @Override
//                        protected void dbg(String msg, Throwable t) {
//                            Log.e("url", msg, t);
//                        }
//                    };
//                    long tEnd = System.currentTimeMillis();
//                    long tDelta = tEnd - tStart;
//                    Log.e("webview download", String.valueOf(tDelta));
//                    readability.init();
//                    String cleanHtml = readability.outerHtml();
//                    runOnUiThread(new Runnable() {
//                        @Override
//                        public void run() {
//                            long tEnd = System.currentTimeMillis();
//                            long tDelta = tEnd - tStart;
//                            Log.d("webview timer", String.valueOf(tDelta));
//                            webview.loadDataWithBaseURL(null, cleanHtml, "text/html", "UTF-8", null);
//
//                            long tEnd1 = System.currentTimeMillis();
//                            long tDelta1 = tEnd1 - tEnd;
//                            Log.d("webview load", String.valueOf(tDelta1));
//
//                        }
//                    });
//
//                } catch (Exception err) {
//                    err.printStackTrace();
//                }
//            }
//        };
//        mainHandler.post(myRunnable);


//        webview.loadUrl("https://hackernoon.com/es8-was-released-and-here-are-its-main-new-features-ee9c394adf66?gi=f49e19b4d74e");
//
//        try {
//            long tStart = System.currentTimeMillis();
//            StringBuilder buf = new StringBuilder();
//            InputStream json = null;
//            json = getAssets().open("temp.html");
//            BufferedReader in =
//                    new BufferedReader(new InputStreamReader(json, "UTF-8"));
//            String str;
//
//            while ((str = in.readLine()) != null) {
//                buf.append(str);
//            }
//
//            in.close();
//            long tEnd = System.currentTimeMillis();
//            long tDelta = tEnd - tStart;
//            double elapsedSeconds = tDelta / 1.0;
//            Log.e("webview start", String.valueOf(elapsedSeconds));
//            webview.loadDataWithBaseURL("", buf.toString(), "text/html", "UTF-8", null);
////            webview.loadData(buf.toString(), "text/html; charset=UTF-8", null);
//            long tEnd1 = System.currentTimeMillis();
//            long tDelta1 = tEnd1 - tEnd;
//            Log.d("webview load", String.valueOf(tDelta1));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        long tStart = System.currentTimeMillis();
        webview.loadUrl(url);
        long tEnd = System.currentTimeMillis();
        long tDelta = tEnd - tStart;
        double elapsedSeconds = tDelta / 1.0;
        Log.e("webview start", String.valueOf(elapsedSeconds));
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();

    }

    @Override
    protected void onPause() {
        saveScrollPosition();
        super.onPause();
    }

    public void saveScrollPosition() {
        Float scrollRatio = webViewClient.getScrollRatio();

        if (scrollRatio != null) {
            Log.d("current-progress", scrollRatio.toString());
//            save scrollRatio
        }
    }
}
