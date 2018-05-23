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
    return @[@"onShare", @"onDismiss", @"onBookmark"];
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
                                               } onBookmark:^{
                                                   [self sendEventWithName:@"onBookmark" body:@{}];
                                               }];
                [currentWindow.rootViewController presentViewController:vc animated:YES completion:nil];
            }
        }
    });
}



@end
