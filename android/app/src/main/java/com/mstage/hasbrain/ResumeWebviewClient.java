package com.mstage.hasbrain;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.graphics.Point;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.zxing.common.StringUtils;
import com.mstage.hasbrain.cache.WebpageCache;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by henry on 5/28/18.
 */
@SuppressLint("LogNotTimber")
public class ResumeWebviewClient extends WebViewClient {
    private CustomWebview webView;
    private Context context;
    private State state;
    private Point resume = new Point(0, 0);
    private float scaleResume = 1f;
    private int topInset = 0;

    private enum State {LOADING, LOADED, FINISHED}

    File folder;

    public void updateFolder(File folder) {
        this.folder = folder;
    }

    public ResumeWebviewClient(CustomWebview webView, Context context) {
        this.context = context;
        this.webView = webView;
        state = State.LOADING;
        webView.changeState(state.ordinal());
        webView.setPictureListener((view, picture) -> {
            if (webView != view) {
                return;
            }
            if (state == State.LOADED) {
                if (resume.x != 0 || resume.y != 0) {
                    webView.scrollTo(resume.x, resume.y);
                    webView.setScaleX(scaleResume);
                    webView.setScaleY(scaleResume);
                    state = State.FINISHED;
                    webView.sendOnNavigationChanged();
                    webView.changeState(state.ordinal());
                }
                webView.setPictureListener(null);
            }
        });
    }

    @Override
    public void onLoadResource(WebView view, String url) {
        if (state == State.LOADING) {
//            Log.i(TAG, "showing loading view...");
            webView.sendOnNavigationChanged();
        }
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
//        context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        view.loadUrl(url);
        state = State.LOADING;
        webView.sendOnNavigationChanged();
        return true;
    }

    String TAG = "RESUMEWEBVIEWCLIENT";

    @Nullable
    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            String resourceUrl = request.getUrl().toString();
            String fileExtension = WebpageCache.getFileExt(resourceUrl);
            if (WebviewResourceMappingHelper.getInstance().getOverridableExtensions().contains(fileExtension)) {
                String encoding = "UTF-8";
                String fileName = WebviewResourceMappingHelper.getInstance().getFileName(resourceUrl);
                if (!TextUtils.isEmpty(fileName)) {
                    String mimeType = WebviewResourceMappingHelper.getInstance().getMimeType(fileExtension);
                    if (!TextUtils.isEmpty(mimeType)) {
                        try {
                            Log.e(TAG, fileName);
                            WebResourceResponse temp = WebviewResourceMappingHelper.getWebResourceResponseFromFile(fileName, folder, mimeType, encoding);
                            if (temp != null) {
                                return temp;
                            } else {
                                return super.shouldInterceptRequest(view, request);
                            }
                        } catch (IOException e) {
                            return super.shouldInterceptRequest(view, request);
                        }
                    }
                }
            }
            if (fileExtension.endsWith("jpg")) {
//                try {
//                    InputStream inputStream = ImageUtils.readFromCacheSync(resourceUrl);
//                    if (inputStream != null) {
//                        return new WebResourceResponse("image/jpg", "UTF-8", inputStream);
//                    }
//                } catch (Exception e) {
//                    return super.shouldInterceptRequest(view, request);
//                }
            }
            return super.shouldInterceptRequest(view, request);

        }
        return super.shouldInterceptRequest(view, request);
    }


    @Override
    public void onPageFinished(android.webkit.WebView view, String url) {
        if (url.equals("about:blank")) {
            return;
        }
        state = State.LOADED;
        webView.changeState(state.ordinal());
        webView.sendOnNavigationChanged();
        webView.sendOnUrlChanged();
        view.evaluateJavascript(" { document.getElementsByTagName(\"body\")[0].style.paddingTop = \'" + topInset + "}px\'; document.getElementsByTagName(\"header\")[0].style.marginTop = \'" + topInset + "px\'; }", value -> {
        });
        if (webView.getHighlights() != null)
            webView.showHightlight(webView.getHighlights());
    }

    public void loadContinueReading(Point current, float scale) {
        if (state == State.LOADING) {
            resume = current;
            scaleResume = scale;
        } else if (state == State.LOADED) {
            resume = current;
            scaleResume = scale;
            webView.scrollTo(resume.x, resume.y);
            webView.setScaleX(scaleResume);
            webView.setScaleY(scaleResume);
            state = State.FINISHED;
            webView.sendOnUrlChanged();
            webView.sendOnNavigationChanged();
            webView.changeState(state.ordinal());
        }
    }

    public Point getScrollPosition() {
        if (state != State.FINISHED) {
            return null;
        }
        webView.computeScroll();

//        int height = webView.getContentHeight();
//        float scale = webView.getScale();
//        Float ratio = (float) scrollPositionY / (scale * height);
//        Log.d(TAG, "scroll ratio of view " + webView + " is " + ratio);
        return new Point(webView.getScrollX(), webView.getScrollY());
    }

    public void setTopInset(int topInset) {
        this.topInset = topInset;
    }
}


