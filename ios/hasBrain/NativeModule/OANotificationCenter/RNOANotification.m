//
//  RNNotificationCenter.m
//  hasBrain
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNOANotification.h"
#import "hasBrain-Swift.h"

@implementation RNOANotification

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestPermission) {
    [[OANotificationCenter sharedInstance] requestPermissionWithCallback:^{
        
    }];
}

RCT_EXPORT_METHOD(updateBadge: (NSNumber * __nonnull)  number) {
    [OANotificationCenter.sharedInstance updateBadgeWithNumber: number];
}

@end
