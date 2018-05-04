//
//  RNWatchingHistory.m
//  hasBrain
//
//  Created by Chuong Huynh on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNWatchingHistory.h"
#import "hasBrain-Swift.h"

@implementation RNWatchingHistory

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(remove: (NSString *)contentId callback: (RCTResponseSenderBlock)callback) {
    [[WatchingHistory sharedInstance] removeWithId:contentId completion:^(id _Nonnull result) {
        callback(@[[NSNull null], @"success"]);
    } errorBlock:^(id _Nonnull error) {
        callback(@[@"error", [NSNull null]]);
    }];
}

RCT_EXPORT_METHOD(getConsumedLength: (NSString *)contentId callback: (RCTResponseSenderBlock)callback) {
    [[WatchingHistory sharedInstance] getConsumedLengthWithId:contentId completion:^(double length) {
        callback(@[[[NSNumber alloc] initWithDouble:length]]);
    }];
}

RCT_EXPORT_METHOD(updateWatchingHistory: (NSString *) contentid properties: (NSDictionary *)properties callback: (RCTResponseSenderBlock)callback) {
    [[WatchingHistory sharedInstance] updateWatchingHistoryWithId:contentid
                                                       properties:properties
                                                       completion:^(id _Nonnull result) {
                                                           callback(@[[NSNull null], @"success"]);
                                                       } errorBlock:^(id _Nonnull error) {
                                                           callback(@[@"error", [NSNull null]]);
                                                       }];
}

RCT_EXPORT_METHOD(getWatchingHistory: (RCTResponseSenderBlock)callback) {
    [[WatchingHistory sharedInstance] getWatchingHistoryWithCompletion:^(NSArray * _Nonnull contents) {
        callback(@[[NSNull null], contents]);
    } errorBlock:^(id _Nonnull error) {
        callback(@[@"error", [NSNull null]]);
    }];
}

@end
