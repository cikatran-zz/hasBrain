//
//  RNURLCache.m
//  hasBrain
//
//  Created by Chuong Huynh on 6/19/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNURLCache.h"

@implementation RNURLCache

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(cacheUrls: (NSArray<NSString *> *) urls) {
    for (int i = 0; i< [urls count]; i++) {
        //[[SwiftURLCache shared] cacheURL:[urls objectAtIndex:i]];
    }
}

@end
