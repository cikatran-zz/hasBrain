package com.hasbrain;

import android.app.Activity;
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

import java.io.DataInputStream;
import java.io.InputStream;
import java.net.URL;

import static android.webkit.WebView.RENDERER_PRIORITY_IMPORTANT;

public class CustomAndroidWebviewActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_PROGRESS);
        setContentView(R.layout.activity_custom_android_webview);

        WebView webview = (WebView) findViewById(R.id.webview);
        final Activity activity = this;
        webview.setWebChromeClient(new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {
                // Activities and WebViews measure progress with different scales.
                // The progress meter will automatically disappear when we reach 100%
                activity.setProgress(progress * 1000);
            }
        });
        webview.setWebViewClient(new WebViewClient() {
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Toast.makeText(activity, "Oh no! " + description, Toast.LENGTH_SHORT).show();
            }
        });

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

//
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
//                    double elapsedSeconds = tDelta / 1000.0;
//                    Log.e("webview download", String.valueOf(elapsedSeconds));
//                    readability.init();
//                    String cleanHtml = readability.outerHtml();
//                    runOnUiThread(new Runnable() {
//                        @Override
//                        public void run() {
//                            long tEnd = System.currentTimeMillis();
//                            long tDelta = tEnd - tStart;
//                            double elapsedSeconds = tDelta / 1000.0;
//                            Log.d("webview timer", String.valueOf(elapsedSeconds));
//                            webview.loadDataWithBaseURL(null, cleanHtml, "text/html", "UTF-8", null);
//                        }
//                    });
//
//                } catch (Exception err) {
//                    err.printStackTrace();
//                }
//            }
//        };
//        mainHandler.post(myRunnable);
        webview.loadUrl("https://hackernoon.com/es8-was-released-and-here-are-its-main-new-features-ee9c394adf66?gi=f49e19b4d74e");
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();

    }
}
