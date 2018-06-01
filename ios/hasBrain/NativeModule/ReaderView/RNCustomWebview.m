//
//  RNCustomWebview.m
//  hasBrain
//
//  Created by Chuong Huynh on 5/18/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNCustomWebview.h"
#import <UIKit/UIKit.h>
#import <SafariServices/SafariServices.h>

@implementation RNCustomWebview

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onShare", @"onDismiss", @"onBookmark", @"onUrlChange", @"onScroll", @"onScroll", @"onDoneReading", @"onLoading", @"onHighlighted"];
}

RCT_EXPORT_METHOD(open: (NSString *)urlString
                  header: (NSString *)header) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *currentWindow = [[[UIApplication sharedApplication] delegate] window];
        
        NSURL *url = [[NSURL alloc] initWithString:urlString];
        if (url != NULL) {
            UINavigationController * vc = (UINavigationController *)[UIStoryboard storyboardWithName:@"ReaderView" bundle:nil].instantiateInitialViewController;
            if (vc != NULL) {
                self.currentWebView = (CustomWebViewViewController *)vc.viewControllers.firstObject;
                [self.currentWebView loadWithUrlString:urlString
                                                header:header
                                               onShare:^{
                                                   [self sendEventWithName:@"onShare" body:@{}];
                                               } onDismissed:^{
                                                   [self sendEventWithName:@"onDismiss" body:@{}];
                                               } onBookmark:^(BOOL isBookmarked) {
                                                   [self sendEventWithName:@"onBookmark" body:@{@"bookmarked": [[NSNumber alloc] initWithBool:isBookmarked] }];
                                               } onUrlChange:^(NSString *old, NSString *new) {
                                                   [self sendEventWithName:@"onUrlChange" body:@{@"old": old, @"new": new}];
                                               } onScroll:^(NSNumber *x, NSNumber *y) {
                                                   [self sendEventWithName:@"onScroll" body:@{@"x": x, @"y": y}];
                                               } onDoneReading:^{
                                                   [self sendEventWithName:@"onDoneReading" body:@{}];
                                               } onLoadingChange:^(BOOL loading) {
                                                   [self sendEventWithName:@"onLoading" body:@{@"loading": [[NSNumber alloc] initWithBool:loading]}];
                                               } onHighlighted:^(NSString * highlightedText) {
                                                   [self sendEventWithName:@"onHighlighted" body:@{@"text":highlightedText}];
                                               }];
                CATransition *transition = [[CATransition alloc] init];
                transition.duration = 0.35;
                transition.type = kCATransitionPush;
                transition.subtype = kCATransitionFromRight;
                [transition setTimingFunction:[CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut]];
                [currentWindow.layer addAnimation:transition forKey:kCATransition];
                [currentWindow.rootViewController presentViewController:vc animated:NO completion:nil];
            }
        }
    });
}

RCT_EXPORT_METHOD(setHeader: (NSString *)header) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.currentWebView setTitle:header];
    });
}

RCT_EXPORT_METHOD(scrollToPosition: (NSNumber * __nonnull)x y:(NSNumber * __nonnull)y) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.currentWebView scrollToX:x y:y];
    });
}

RCT_EXPORT_METHOD(bookmark: (NSNumber * __nonnull)isBookmarked) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.currentWebView bookmark:isBookmarked];
    });
}

@end
