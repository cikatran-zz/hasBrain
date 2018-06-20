package com.mstage.hasbrain.cache;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.StrictMode;
import android.util.Log;

import com.mstage.hasbrain.MyOkhttpModule;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Entities;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.processors.PublishProcessor;
import io.reactivex.schedulers.Schedulers;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by henry on 6/19/18.
 */
public class WebpageCache {

    Context mContext;

    private Options options = new Options();

    public Options getOptions() {
        return this.options;
    }

    private List<String> filesToGrab = new ArrayList<String>();
    PublishProcessor<String> filesSubject = PublishProcessor.create();
    //    private List<String> framesToGrab = new ArrayList<String>();
    private List<String> cssToGrab = new ArrayList<String>();
    PublishProcessor<String> cssSubject = PublishProcessor.create();

    private final Pattern fileNameReplacementPattern = Pattern.compile("[^a-zA-Z0-9-_\\.]");
    private List<String> listGrabExt = new ArrayList<>(Arrays.asList("js", "woff", "ttf", "eot", "css", "ico")); //take out this  "png", "jpg",
    private List<String> cacheImageList = new ArrayList<>(Arrays.asList("png", "jpg", "ico"));
    String TAG = "WEBPAGECACHE";

    @SuppressLint("CheckResult")
    public void getPageURL(String url, String basePath) {
        File webPageFile = new File(basePath, String.valueOf(url.hashCode() + ".html"));
        File webPageFolder = new File(basePath, String.valueOf(url.hashCode()));
        if (!webPageFile.exists()) {
            if (webPageFolder.exists() || webPageFolder.mkdir()) {
                cssSubject.onBackpressureBuffer(1).subscribe(item -> {
                    downloadCssAndParse(item, webPageFolder.getAbsolutePath());
                }, err -> {
                    Log.d(TAG, err.toString());
                });
                filesSubject.onBackpressureBuffer(1).subscribe(item -> {
                    downloadFile(item, webPageFolder.getAbsolutePath());
                }, err -> {
                    Log.d(TAG, err.toString());
                });
            } else {
                Log.d(TAG, "Can't create folder");
            }
            try {
                URL temp = new URL(url);
                String baseUrl = temp.getProtocol() + "://" + temp.getHost();
                getCacheURL(url, baseUrl, webPageFile).subscribeOn(Schedulers.io()).subscribe(item -> {

                }, error -> {
                    Log.d(TAG, error.getMessage());
                });

            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
    }

    @SuppressLint("CheckResult")
    public Observable<Response> getCacheURL(String url, String baseUrl, File basePath) {
        return getData(url)
                .doOnNext(response -> {
                    String htmlRaw = response.body().string();
                    String parseHtml = parseHtmlForLinks(htmlRaw, baseUrl);
                    saveStringToFile(htmlRaw, basePath);
                });
    }

    private void saveByteToFile(byte[] ToSave, File outputFile) throws IOException {

        if (outputFile.exists()) {
            return;
        }

        outputFile.createNewFile();

        FileOutputStream fos = new FileOutputStream(outputFile);
        fos.write(ToSave);

        fos.flush();
        fos.close();
    }

    private void saveStringToFile(String ToSave, File outputFile) throws IOException {

        if (outputFile.exists()) {
            return;
        }

        outputFile.createNewFile();

        FileOutputStream fos = new FileOutputStream(outputFile);
        fos.write(ToSave.getBytes());

        fos.flush();
        fos.close();
    }

    public String getFileExt(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
    }

    @SuppressLint("CheckResult")
    private void downloadFile(final String url, final String outputDir) {
        String fileExt = getFileExt(url);
        if (listGrabExt.contains(fileExt)) {
            String filename = getFileName(url);
            File outputFile = new File(outputDir, filename);
            getData(url).subscribeOn(Schedulers.io())
                    .subscribe(response -> {
                        if (cacheImageList.contains(fileExt)) {
                            saveByteToFile(response.body().bytes(), outputFile);
                        } else {
                            String file = response.body().string();
                            saveStringToFile(file, outputFile);
                        }
                    }, error -> {
                        Log.d(TAG, error.getMessage());
                    });
        } else {
            Log.d("not get this file", url);
        }
    }

    @SuppressLint("CheckResult")
    private void downloadCssAndParse(final String url, final String outputDir) {

        String filename = getFileName(url);
        File outputFile = new File(outputDir, filename);
        getData(url).subscribeOn(Schedulers.io())
                .subscribe(response -> {
                    String cssContent = response.body().string();
                    try {
                        String parseCssContent = parseCssForLinks(cssContent, url);
                    } catch (Exception e) {
                        Log.d(TAG, e.toString());
                    }
                    saveStringToFile(cssContent, outputFile);
                }, error -> {
                    Log.d(TAG, error.getMessage());
                });
    }

    public static Observable<Response> getData(String url) {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        final Request request = new Request.Builder()
                .url(url)
                .get()
//                .addHeader("cache-control", "no-cache")
                .build();

        return Observable.create(new ObservableOnSubscribe<Response>() {
            @Override
            public void subscribe(ObservableEmitter<Response> emitter) {
                try {
                    Response response = MyOkhttpModule.getInstance().getmOkHttpClient().newCall(request).execute();
                    emitter.onNext(response);
                    emitter.onComplete();
                } catch (IOException e) {
                    e.printStackTrace();
                    emitter.onError(e);
                }
            }
        });
    }

    private String parseHtmlForLinks(String htmlToParse, String baseUrl) {
        //get all links from this webpage and add them to LinksToVisit ArrayList
        Document document = Jsoup.parse(htmlToParse, baseUrl);
        document.outputSettings().escapeMode(Entities.EscapeMode.extended);
        String urlToGrab;
        Elements links;

        if (getOptions().saveFrames()) {
            links = document.select("frame[src]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:src");
//                addLinkToList(urlToGrab, framesToGrab);
                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
            }

            links = document.select("iframe[src]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:src");
//                addLinkToList(urlToGrab, framesToGrab);

                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
            }
        }

        if (getOptions().saveOther()) {
            // Get all the links
            links = document.select("link[href]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:href");

                //if it is css, parse it later to extract urls (images referenced from "background" attributes for example)
                if (link.attr("rel").equals("stylesheet")) {
                    cssToGrab.add(link.attr("abs:href"));
                } else {
                    addLinkToList(urlToGrab, filesToGrab, filesSubject);
                }

                String replacedURL = getFileName(urlToGrab);
                link.attr("href", replacedURL);
            }

            //get links in embedded css also, and modify the links to point to local files
            links = document.select("style[type=text/css]");
            for (Element link : links) {
                String cssToParse = link.data();
                String parsedCss = parseCssForLinks(cssToParse, baseUrl);
                if (link.dataNodes().size() != 0) {
                    link.dataNodes().get(0).setWholeData(parsedCss);
                }
            }

            //get input types with an image type
            links = document.select("input[type=image]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:src");
                addLinkToList(urlToGrab, filesToGrab, filesSubject);
                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
            }

            //get everything which has a background attribute
            links = document.select("[background]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:src");
                addLinkToList(urlToGrab, filesToGrab, filesSubject);
                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
            }

            links = document.select("[style]");
            for (Element link : links) {
                String cssToParse = link.attr("style");
                String parsedCss = parseCssForLinks(cssToParse, baseUrl);
                link.attr("style", parsedCss);
            }

        }

        if (getOptions().saveScripts()) {
            links = document.select("script[src]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:src");
                addLinkToList(urlToGrab, filesToGrab, filesSubject);
                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
            }
        }

        if (getOptions().saveImages()) {
            links = document.select("img[src]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:src");
                addLinkToList(urlToGrab, filesToGrab, filesSubject);

                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
                link.removeAttr("srcset");
            }

            links = document.select("img[data-canonical-src]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:data-canonical-src");
                addLinkToList(urlToGrab, filesToGrab, filesSubject);

                String replacedURL = getFileName(urlToGrab);
                link.attr("data-canonical-src", replacedURL);
                link.removeAttr("srcset");
            }
        }

        if (getOptions().saveVideo()) {
            //video src is sometimes in a child element
            links = document.select("video:not([src])");
            for (Element link : links.select("[src]")) {
                urlToGrab = link.attr("abs:src");
                addLinkToList(urlToGrab, filesToGrab, filesSubject);

                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
            }

            links = document.select("video[src]");
            for (Element link : links) {
                urlToGrab = link.attr("abs:src");
                addLinkToList(urlToGrab, filesToGrab, filesSubject);

                String replacedURL = getFileName(urlToGrab);
                link.attr("src", replacedURL);
            }
        }

        if (getOptions().makeLinksAbsolute()) {
            //make links absolute, so they are not broken
            links = document.select("a[href]");
            for (Element link : links) {
                String absUrl = link.attr("abs:href");
                link.attr("href", absUrl);
            }
        }
        return document.outerHtml();
    }

    private String parseCssForLinks(String cssToParse, String baseUrl) {
        String patternString = "url(\\s*\\(\\s*['\"]*\\s*)(.*?)\\s*['\"]*\\s*\\)";

        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(cssToParse);
        //find everything inside url(" ... ")
        while (matcher.find()) {
            if (matcher.group().replaceAll(patternString, "$2").contains("/")) {
                cssToParse = cssToParse.replace(matcher.group().replaceAll(patternString, "$2"), getFileName(matcher.group().replaceAll(patternString, "$2")));

            }
            addLinkToList(matcher.group().replaceAll(patternString, "$2").trim(), baseUrl, filesToGrab, filesSubject);
        }

        // find css linked with @import  -  needs testing
        //todo: test this to see if it actually works
        String importString = "@(import\\s*['\"])()([^ '\"]*)";
        pattern = Pattern.compile(importString);
        matcher = pattern.matcher(cssToParse);
        matcher.reset();

        while (matcher.find()) {
            if (matcher.group().replaceAll(patternString, "$2").contains("/")) {
                cssToParse = cssToParse.replace(matcher.group().replaceAll(patternString, "$2"), getFileName(matcher.group().replaceAll(patternString, "$2")));
            }
            addLinkToList(matcher.group().replaceAll(patternString, "$2").trim(), baseUrl, cssToGrab, cssSubject);
        }
        return cssToParse;
    }


    private boolean isLinkValid(String url) {
        if (url == null || url.length() == 0) {
            return false;
        } else if (!url.startsWith("http")) {
            return false;
        } else {
            return true;
        }
    }

    private void addLinkToList(String link, List<String> list, PublishProcessor<String> publishSubject) {
        if (!isLinkValid(link) || list.contains(link)) {
            return;
        } else {
            try {
                list.add(link);
                publishSubject.onNext(link);
            } catch (Exception e) {
                Log.d(TAG, e.toString());
            }
        }
    }

    private void addLinkToList(String link, String baseUrl, List<String> list, PublishProcessor<String> publishSubject) {
        if (link.startsWith("data:image")) {
            return;
        }
        try {
            URL u = new URL(new URL(baseUrl), link);
            link = u.toString();
        } catch (MalformedURLException e) {
            return;
        }

        if (!isLinkValid(link) || list.contains(link)) {
            return;
        } else {
            try {
                list.add(link);
                publishSubject.onNext(link);
            } catch (Exception e) {
                Log.d(TAG, e.toString());
            }
        }
    }

    private String getFileName(String url) {

        String filename = url.substring(url.lastIndexOf('/') + 1);

        if (filename.trim().length() == 0) {
            filename = String.valueOf(url.hashCode());
        }

        if (filename.contains("?")) {
            filename = filename.substring(0, filename.indexOf("?")) + filename.substring(filename.indexOf("?") + 1).hashCode();
        }

        filename = fileNameReplacementPattern.matcher(filename).replaceAll("_");
        filename = filename.substring(0, Math.min(200, filename.length()));
        ;

        return filename;
    }

    public WebpageCache(Context context) {
        mContext = context;
    }
}

class Options {
    private boolean makeLinksAbsolute = false;

    private boolean saveImages = true;
    private boolean saveFrames = true;
    private boolean saveOther = true;
    private boolean saveScripts = true;
    private boolean saveVideo = false;

    private String userAgent = " ";

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(final String userAgent) {
        this.userAgent = userAgent;
    }

    public boolean makeLinksAbsolute() {
        return makeLinksAbsolute;
    }

    public void makeLinksAbsolute(final boolean makeLinksAbsolute) {
        this.makeLinksAbsolute = makeLinksAbsolute;
    }

    public boolean saveImages() {
        return saveImages;
    }

    public void saveImages(final boolean saveImages) {
        this.saveImages = saveImages;
    }

    public boolean saveFrames() {
        return saveFrames;
    }

    public void saveFrames(final boolean saveFrames) {
        this.saveFrames = saveFrames;
    }

    public boolean saveScripts() {
        return saveScripts;
    }

    public void saveScripts(final boolean saveScripts) {
        this.saveScripts = saveScripts;
    }

    public boolean saveOther() {
        return saveOther;
    }

    public void saveOther(final boolean saveOther) {
        this.saveOther = saveOther;
    }

    public boolean saveVideo() {
        return saveVideo;
    }

    public void saveVideo(final boolean saveVideo) {
        this.saveVideo = saveVideo;
    }
}