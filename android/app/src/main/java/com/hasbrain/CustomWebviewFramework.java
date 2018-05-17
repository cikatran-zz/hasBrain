package com.hasbrain;

import android.graphics.Color;
import android.net.Uri;
import android.support.customtabs.CustomTabsIntent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;
import com.hasbrain.lib.customwebview.CustomTabActivityHelper;
import com.hasbrain.lib.customwebview.helper.WebviewFallback;

import static com.hasbrain.lib.customwebview.MainActivity.getBitmapFromDrawable;

/**
 * Created by henry on 5/17/18.
 */
public class CustomWebviewFramework extends ReactContextBaseJavaModule {

    public static final String REACT_MODULE = "RNCustomWebview";
    private CustomTabActivityHelper mCustomTabActivityHelper;

    Gson gson = new Gson();

    public CustomWebviewFramework(ReactApplicationContext reactContext) {
        super(reactContext);
        mCustomTabActivityHelper = new CustomTabActivityHelper();

    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void init() {
        if (getCurrentActivity() != null)
            mCustomTabActivityHelper.bindCustomTabsService(getCurrentActivity());
    }

    @ReactMethod
    public void unDestroy() {
        if (getCurrentActivity() != null)
            mCustomTabActivityHelper.unbindCustomTabsService(getCurrentActivity());
    }

    @ReactMethod
    public void loadUrl(String url, Callback callback) {
        if (getCurrentActivity() != null) {
            CustomTabsIntent.Builder intentBuilder = new CustomTabsIntent.Builder();
            intentBuilder.setToolbarColor(Color.parseColor("#321321"));
            intentBuilder.setSecondaryToolbarColor(Color.parseColor("#564431"));
            intentBuilder.setCloseButtonIcon(getBitmapFromDrawable(getCurrentActivity(), com.hasbrain.lib.customwebview.R.drawable.ic_arrow_back_24dp));

            //action button
            //Generally you do not want to decode bitmaps in the UI thread. Decoding it in the
            //UI thread to keep the example short.
//            String actionLabel = getString(com.hasbrain.lib.customwebview.R.string.label_action);
//            Bitmap icon = BitmapFactory.decodeResource(getResources(),
//                    android.R.drawable.ic_menu_share);
//            PendingIntent pendingIntent =
//                    createPendingIntent(ActionBroadcastReceiver.ACTION_ACTION_BUTTON);
//            intentBuilder.setActionButton(icon, actionLabel, pendingIntent);

            //add menu
//            String menuItemTitle = getString(com.hasbrain.lib.customwebview.R.string.menu_item_title);
//            PendingIntent menuItemPendingIntent =
//                    createPendingIntent(ActionBroadcastReceiver.ACTION_MENU_ITEM);
//            intentBuilder.addMenuItem(menuItemTitle, menuItemPendingIntent);

            //share button on the menu
//            intentBuilder.addDefaultShareMenuItem();

            //share button float
            //Generally you do not want to decode bitmaps in the UI thread. Decoding it in the
            //UI thread to keep the example short.
//            String actionLabel = getString(com.hasbrain.lib.customwebview.R.string.label_action);
//            Bitmap icon = BitmapFactory.decodeResource(getResources(),
//                    android.R.drawable.ic_menu_share);
//            PendingIntent pendingIntent =
//                    createPendingIntent(ActionBroadcastReceiver.ACTION_TOOLBAR);
//            intentBuilder.addToolbarItem(TOOLBAR_ITEM_ID, icon, actionLabel, pendingIntent);

            //title on the header
//        intentBuilder.setShowTitle(mShowTitleCheckBox.isChecked());

            //hide bar when scroll
            intentBuilder.enableUrlBarHiding();

//        if (mCustomBackButtonCheckBox.isChecked()) {
//        }

            intentBuilder.setStartAnimations(getCurrentActivity(), com.hasbrain.lib.customwebview.R.anim.slide_in_right, com.hasbrain.lib.customwebview.R.anim.slide_out_left);
            intentBuilder.setExitAnimations(getCurrentActivity(), android.R.anim.slide_in_left,
                    android.R.anim.slide_out_right);

            CustomTabActivityHelper.openCustomTab(
                    getCurrentActivity(), intentBuilder.build(), Uri.parse(url), new WebviewFallback());
        }
    }
}
