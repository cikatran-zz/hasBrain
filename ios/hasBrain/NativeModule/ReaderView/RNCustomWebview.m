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
#import <NotificationCenter/NotificationCenter.h>

@implementation RNCustomWebview

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[];
}

RCT_EXPORT_METHOD(reload) {
    [NSNotificationCenter.defaultCenter postNotificationName:@"com.hasbrain.customwebview.reload" object:NULL]
}

@end
