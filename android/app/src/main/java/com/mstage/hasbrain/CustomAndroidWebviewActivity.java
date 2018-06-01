package com.mstage.hasbrain;

import android.content.Context;
import android.graphics.Point;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;

import static android.webkit.WebView.RENDERER_PRIORITY_IMPORTANT;

public class CustomAndroidWebviewActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_PROGRESS);
        setContentView(com.mstage.hasbrain.R.layout.activity_custom_android_webview);

//        webview = (WebView) findViewById(com.mstage.hasbrain.R.id.webview);
//        final Activity activity = this;
//        webview.setWebChromeClient(new WebChromeClient() {
//            public void onProgressChanged(WebView view, int progress) {
//                // Activities and WebViews measure progress with different scales.
//                // The progress meter will automatically disappear when we reach 100%
//                activity.setProgress(progress * 1000);
//            }
//        });


        String url = getIntent().getStringExtra("url");
        long tStart = System.currentTimeMillis();
//        webview.loadUrl(url);
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
//        Point scrollRatio = webViewClient.getScrollRatio();
//
//        if (scrollRatio != null) {
//            Log.d("current-progress", scrollRatio.toString());
//            save scrollRatio
//        }
    }
}
