package com.mstage.hasbrain;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Picture;
import android.graphics.Point;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by henry on 5/28/18.
 */
@SuppressLint("LogNotTimber")
public class ResumeWebviewClient extends WebViewClient {
    private CustomWebview webView;
    private Context context;
    private State state;
    private Point resume = new Point(0, 0);

    private enum State {LOADING, LOADED, FINISHED}

    public ResumeWebviewClient(CustomWebview webView, Context context) {
        this.context = context;
        this.webView = webView;
        state = State.LOADING;
        webView.changeState(state.ordinal());
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
        context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        return true;
    }

    @Override
    public void onPageFinished(android.webkit.WebView view, String url) {
        state = State.LOADED;
        webView.changeState(state.ordinal());
        webView.sendOnNavigationChanged();
        webView.sendOnUrlChanged();
    }

    public void loadContinueReading(Point current, float scale) {
        webView.setPictureListener((view, picture) -> {
            if (webView != view) {
                return;
            }
            if (state == State.LOADED) {
                if (resume.x != 0 || resume.y != 0) {
                    webView.scrollTo(resume.x, resume.y);
                    webView.setScaleX(scale);
                    webView.setScaleY(scale);
                    state = State.FINISHED;
                    webView.sendOnUrlChanged();
                    webView.sendOnNavigationChanged();
                    webView.changeState(state.ordinal());
                }
                webView.setPictureListener(null);
            } else {
            }
        });


        if (state == State.LOADING) {
            resume = current;
        } else if (state == State.LOADED) {
            resume = current;
            webView.scrollTo(resume.x, resume.y);
            webView.setScaleX(scale);
            webView.setScaleY(scale);
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
}