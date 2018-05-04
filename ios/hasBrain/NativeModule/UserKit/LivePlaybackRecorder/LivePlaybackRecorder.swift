//
//  LivePlaybackRecorder.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKit

@objc(LivePlaybackRecorder)
class LivePlaybackRecorder: NSObject {
    
    private var liveRecorder: LivePlaybackEventRecorder? = nil
    
    public static let sharedInstance = LivePlaybackRecorder()
    
    private override init() {
        super.init()
    }
    
    @objc public func startRecording(channel: String, epgs: [[String: Any]]) {
        let ePGs = epgs.map{ EPG.epgFromJson(json: $0)}
        liveRecorder = LivePlaybackEventRecorder(channel: channel, epgs: ePGs)
    }
    
    @objc public func recordPlayerState(_ state: String) {
        switch state {
        case PlayerState.Play.rawValue:
            liveRecorder?.recordPlayerState(.Play)
        case PlayerState.Pause.rawValue:
            liveRecorder?.recordPlayerState(.Pause)
        case PlayerState.Seek.rawValue:
            liveRecorder?.recordPlayerState(.Seek)
        case PlayerState.Buffer.rawValue:
            liveRecorder?.recordPlayerState(.Buffer)
        default:
            break
        }
    }
    
    @objc public func recordAudioBitrate(_ bitrate: NSNumber) {
        liveRecorder?.recordAudioBitrate(bitrate.intValue)
    }
    
    @objc public func recordVideoBitrate(_ bitrate: NSNumber, width: NSNumber, height: NSNumber) {
        liveRecorder?.recordVideoBitrate(bitrate.intValue, width: width.intValue, height: height.intValue)
    }
    
    @objc public func stopRecording() {
        liveRecorder?.stopRecording(error: nil)
        liveRecorder = nil
    }
}
