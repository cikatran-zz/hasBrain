//
//  VODPlaybackRecorder.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKit

@objc(VODPlaybackRecorder)
class VODPlaybackRecorder: NSObject {
    
    private var playbackRecorder: OnDemandPlaybackEventRecorder? = nil
    
    public static let sharedInstance = VODPlaybackRecorder()
    
    private override init() {
        super.init()
    }
    
    @objc public func startRecording(item: [String: Any]) {
        
        if let specificItem = SpecificRequiredItem.createItemFromMetaData(metadata: item) {
            playbackRecorder = OnDemandPlaybackEventRecorder(specificRequiredItem: specificItem)
        }
    }
    
    @objc public func recordAudioBitrate(_ bitrate: NSNumber, playhead: NSNumber) {
        playbackRecorder?.recordAudioBitrate(bitrate.intValue, playhead: playhead.doubleValue)
    }
    
    @objc public func recordVideoBitrate(_ bitrate: NSNumber, width: NSNumber, height: NSNumber, playhead: NSNumber) {
        playbackRecorder?.recordVideoBitrate(bitrate.intValue, width: width.intValue, height: height.intValue, playhead: playhead.doubleValue)
    }
    
    @objc public func recordPlayerState(_ state: String, playhead: NSNumber) {
        switch state {
        case PlayerState.Play.rawValue:
            playbackRecorder?.recordPlayerState(.Play, playhead: playhead.doubleValue)
        case PlayerState.Pause.rawValue:
            playbackRecorder?.recordPlayerState(.Pause, playhead: playhead.doubleValue)
        case PlayerState.Seek.rawValue:
            playbackRecorder?.recordPlayerState(.Seek, playhead: playhead.doubleValue)
        case PlayerState.Buffer.rawValue:
            playbackRecorder?.recordPlayerState(.Buffer, playhead: playhead.doubleValue)
        default:
            break
        }
    }
    
    @objc public func stopRecording(playhead: NSNumber, videoLength: NSNumber) {
        playbackRecorder?.stopRecording(playhead: playhead.doubleValue, videoLength: videoLength.doubleValue, error: nil)
        playbackRecorder = nil
    }
    
}
