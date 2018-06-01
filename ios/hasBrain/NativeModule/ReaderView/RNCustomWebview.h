//
//  RNCustomWebview.h
//  hasBrain
//
//  Created by Chuong Huynh on 5/18/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "hasBrain-Swift.h"

@interface RNCustomWebview : RCTEventEmitter<RCTBridgeModule>

@property (nonatomic, weak) CustomWebViewViewController *currentWebView;

@end
