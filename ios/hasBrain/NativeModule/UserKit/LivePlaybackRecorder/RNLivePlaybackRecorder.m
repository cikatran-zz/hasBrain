//
//  RNLivePlaybackRecorder.m
//  hasBrain
//
//  Created by Chuong Huynh on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNLivePlaybackRecorder.h"
#import "hasBrain-Swift.h"

@implementation RNLivePlaybackRecorder

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startRecording: (NSString *)channel epgs:(NSArray<NSDictionary *>*)epgs) {
    [[LivePlaybackRecorder sharedInstance] startRecordingWithChannel:channel epgs:epgs];
}

RCT_EXPORT_METHOD(recordAudioBitrate: (NSNumber *)bitrate) {
    [[LivePlaybackRecorder sharedInstance] recordAudioBitrate:bitrate];
}

RCT_EXPORT_METHOD(recordVideoBitrate: (NSNumber *)bitrate
                  width: (NSNumber *)width
                  height: (NSNumber *)height) {
    [[LivePlaybackRecorder sharedInstance] recordVideoBitrate:bitrate
                                                       width:width
                                                      height:height];
}

RCT_EXPORT_METHOD(recordPlayerState: (NSString *)state) {
    [[LivePlaybackRecorder sharedInstance] recordPlayerState:state];
}

RCT_EXPORT_METHOD(stopRecording) {
    [[LivePlaybackRecorder sharedInstance] stopRecording];
}

@end
