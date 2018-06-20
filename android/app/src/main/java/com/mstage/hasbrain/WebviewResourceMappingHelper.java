package com.mstage.hasbrain;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebResourceResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class WebviewResourceMappingHelper {
    private static WebviewResourceMappingHelper instance;
    private List<LocalAssetMapModel> localAssetMapModelList;
    private List<String> overridableExtensions = new ArrayList<>(Arrays.asList("js", "css", "png", "jpg", "woff", "ttf", "eot", "ico"));

    private WebviewResourceMappingHelper() {

    }

    public static WebviewResourceMappingHelper getInstance() {
        if (instance == null) {
            instance = new WebviewResourceMappingHelper();
        }
        return instance;
    }

    public String getLocalPath(String url) {
        if (TextUtils.isEmpty(url)) {
            return "";
        }

        getFileName(url);
//        if(localAssetMapModelList == null){
//            localAssetMapModelList = getLocalAssetList();
//        }

//        if(CollectionUtils.isNotEmpty(localAssetMapModelList)){
//            for(LocalAssetMapModel localAssetMapModel : localAssetMapModelList){
//                if(localAssetMapModel.url.equals(url)){
//                    return localAssetMapModel.asset_url;
//                }
//            }
//        }


        return "";
    }

    public String getFileName(String url) {

        String filename = url.substring(url.lastIndexOf('/') + 1);

        if (filename.trim().length() == 0) {
            filename = String.valueOf(url.hashCode());
        }

        if (filename.contains("?")) {
            filename = filename.substring(0, filename.indexOf("?")) + filename.substring(filename.indexOf("?") + 1).hashCode();
        }

        Pattern fileNameReplacementPattern = Pattern.compile("[^a-zA-Z0-9-_\\.]");

        filename = fileNameReplacementPattern.matcher(filename).replaceAll("_");
        filename = filename.substring(0, Math.min(200, filename.length()));
        ;

        return filename;
    }

    public String getLocalFilePath(String url) {
        String localFilePath = "";
        String fileNameForUrl = getLocalFileNameForUrl(url);
        if (!TextUtils.isEmpty(fileNameForUrl) && fileExists(fileNameForUrl)) {
            localFilePath = getFileFullPath(fileNameForUrl);
        }
        return localFilePath;
    }

    public String getLocalFileNameForUrl(String url) {
        String localFileName = "";
        String[] parts = url.split("/");
        if (parts.length > 0) {
            localFileName = parts[parts.length - 1];
        }
        return localFileName;
    }

    private boolean fileExists(String fileName) {
//        String path = Application.getInstance()
//                .getFilesDir() + "/cart/" + fileName;
//        return new File(path).exists();
        return true;
    }

    private String getFileFullPath(String relativePath) {
//        return Application.getInstance().getFilesDir() + "/cart/" + relativePath;
        return "";
    }

    private List<LocalAssetMapModel> getLocalAssetList() {
        List<LocalAssetMapModel> localAssetMapModelList = new ArrayList<>();
        String pageData = null;
//        try {
//            pageData = ResourceAccessHelper.getJsonData(Application.getCurrentInstance(), "web-assets/map.json");
//        } catch (IOException e) {
//        }
        if (pageData != null) {
            Type listType = new TypeToken<ArrayList<LocalAssetMapModel>>() {
            }.getType();
            localAssetMapModelList = new Gson().fromJson(pageData, listType);
        }

        pageData = null;
//        try {
//            pageData = ResourceAccessHelper.getJsonData(Application.getCurrentInstance(), "web-assets/fonts-map.json");
//        } catch (IOException e) {
//        }
        if (pageData != null) {
            Type listType = new TypeToken<ArrayList<LocalAssetMapModel>>() {
            }.getType();
            List<LocalAssetMapModel> fontsMap = new Gson().fromJson(pageData, listType);
            localAssetMapModelList.addAll(fontsMap);
        }
        return localAssetMapModelList;
    }

    public List<String> getOverridableExtensions() {
        return overridableExtensions;
    }

    public String getFileExt(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
    }

    public String getMimeType(String fileExtension) {
        String mimeType = "";
        switch (fileExtension) {
            case "css":
                mimeType = "text/css";
                break;
            case "js":
                mimeType = "text/javascript";
                break;
            case "png":
                mimeType = "image/png";
                break;
            case "jpg":
                mimeType = "image/jpeg";
                break;
            case "ico":
                mimeType = "image/x-icon";
                break;
            case "woff":
            case "ttf":
            case "eot":
                mimeType = "application/x-font-opentype";
                break;
        }
        return mimeType;
    }

    public static String convertStreamToString(InputStream is) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        reader.close();
        return sb.toString();
    }

    public static String getStringFromFile(File filePath) throws Exception {
        FileInputStream fin = new FileInputStream(filePath);
        String ret = convertStreamToString(fin);
        //Make sure you close all streams.
        fin.close();
        return ret;
    }

    public static WebResourceResponse getWebResourceResponseFromFile(String fileName, File folder, String mimeType, String encoding) throws FileNotFoundException {
        File outputFile = new File(folder, fileName);

        if(outputFile.exists()){
            FileInputStream fileInputStream = new FileInputStream(outputFile);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                int statusCode = 200;
                String reasonPhase = "OK";
                Map<String, String> responseHeaders = new HashMap<String, String>();
                responseHeaders.put("Access-Control-Allow-Origin", "*");
                return new WebResourceResponse(mimeType, encoding, statusCode, reasonPhase, responseHeaders, fileInputStream);
            }
            return new WebResourceResponse(mimeType, encoding, fileInputStream);
        }
        else {
            return null;
        }
    }

    private class LocalAssetMapModel {
        String url;
        String asset_url;
    }
}
