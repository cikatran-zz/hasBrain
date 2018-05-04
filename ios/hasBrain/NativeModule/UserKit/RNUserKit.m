//
//  RNUserKit.m
//  hasBrain
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNUserKit.h"
#import "hasBrain-Swift.h"

@implementation RNUserKit

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setDeviceType: (NSString *)type) {
    [[UserKitModule sharedInstance] setDeviceTypeWithType:type];
}

RCT_EXPORT_METHOD(time: (NSString *)event) {
    [[UserKitModule sharedInstance] timeWithEvent:event];
}

RCT_EXPORT_METHOD(track: (NSString *)name properties: (NSDictionary *)properties) {
    [[UserKitModule sharedInstance] trackWithEvent:name properties:properties];
}

RCT_EXPORT_METHOD(storeProperty: (NSString *)key
                  value: (NSDictionary *)value
                  callback: (RCTResponseSenderBlock)callback) {
    [[UserKitModule sharedInstance] storePropertyWithKey:key
                                                   value:value
                                            successBlock:^(NSString * result) {
                                                callback(@[[NSNull null], @[result]]);
                                            } errorBlock:^(NSString * error) {
                                                callback(@[error, [NSNull null]]);
                                            }];
}

RCT_EXPORT_METHOD(getProperty: (NSString *)key
                  callback: (RCTResponseSenderBlock)callback) {
    [[UserKitModule sharedInstance] getPropertyWithKey:key
                                          successBlock:^(NSString * result) {
                                              callback(@[[NSNull null], @[result]]);
                                          } errorBlock:^(NSString * error) {
                                              callback(@[error, [NSNull null]]);
                                          }];
}

@end
