//
//  EPG+Extension.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKit

extension EPG {
    
    public static func epgFromJson(json: [String: Any]) -> EPG {
        let videoData = asJsonObj(json["videoData"])
        let genres = asJsonArr(videoData["genres"]).map{ (asJsonObj($0)["name"] as? String) ?? ""}
        let startTime = json["startTime"] as? Double ?? 0
        let endTime = json["endTime"] as? Double ?? 0
        
        return EPG(contentId: videoData["contentId"] as? String, title: videoData["title"] as? String, genres: genres, startTime: startTime, endTime: endTime)
    }
}
