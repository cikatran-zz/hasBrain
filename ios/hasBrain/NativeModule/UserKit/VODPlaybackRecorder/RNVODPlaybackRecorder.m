//
//  RNVODPlaybackRecorder.m
//  hasBrain
//
//  Created by Chuong Huynh on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNVODPlaybackRecorder.h"
#import "hasBrain-Swift.h"

@implementation RNVODPlaybackRecorder

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startRecording: (NSDictionary *)item) {
    [[VODPlaybackRecorder sharedInstance] startRecordingWithItem:item];
}

RCT_EXPORT_METHOD(recordAudioBitrate: (NSNumber *)bitrate
                  playhead: (NSNumber *)playhead) {
    [[VODPlaybackRecorder sharedInstance] recordAudioBitrate:bitrate playhead:playhead];
}

RCT_EXPORT_METHOD(recordVideoBitrate: (NSNumber *)bitrate
                  width: (NSNumber *)width
                  height: (NSNumber *)height
                  playhead: (NSNumber *)playhead) {
    [[VODPlaybackRecorder sharedInstance] recordVideoBitrate:bitrate
                                                       width:width
                                                      height:height
                                                    playhead:playhead];
}

RCT_EXPORT_METHOD(recordPlayerState: (NSString *)state playhead: (NSNumber *)playhead) {
    [[VODPlaybackRecorder sharedInstance] recordPlayerState:state
                                                   playhead:playhead];
}

RCT_EXPORT_METHOD(stopRecording: (NSNumber *) playhead videoLength: (NSNumber *)videoLength) {
    [[VODPlaybackRecorder sharedInstance] stopRecordingWithPlayhead:playhead videoLength:videoLength];
}

@end
