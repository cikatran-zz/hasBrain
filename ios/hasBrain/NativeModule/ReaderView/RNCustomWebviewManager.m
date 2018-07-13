//
//  RNCustomWebviewManager.m
//  hasBrain
//
//  Created by Chuong Huynh on 6/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNCustomWebviewManager.h"
#import "hasBrain-Swift.h"

@implementation RNCustomWebviewManager

RCT_EXPORT_MODULE()
- (UIView *)view {
    return [[CustomWebView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(source, NSString)
RCT_EXPORT_VIEW_PROPERTY(topInset, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(highlights, NSArray)
RCT_EXPORT_VIEW_PROPERTY(initPosition, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(onHighlight, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onUrlChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNavigationChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScrollEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScroll, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScrollEndDragging, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onHighlightRemove, RCTDirectEventBlock)

@end
