//
//  SpecificRequiredItem+Extension.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/14/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKit

public extension SpecificRequiredItem {
    
    /// Create Specific required item from video metadata
    ///
    /// - Parameter metadata: metadata dictionary
    /// - Returns: specific required item from metadata or nil
    public static func createItemFromMetaData(metadata: [String: Any]) -> SpecificRequiredItem? {
        guard let contentId = metadata["contentId"] as? String else { return nil }
        guard let showTitle = metadata["title"] as? String else { return nil }
        let type = (metadata["type"] as? String) ?? "standalone"
        let genres = (metadata["genres"] as? [String]) ?? []
        switch type {
        case "episode_season":
            let seasonNumber = (metadata["seasonIndex"] as? Int) ?? -1
            let episodeNumber = (metadata["episodeIndex"] as? Int) ?? -1
            let episodeTitle = (metadata["episodeTitle"] as? String) ?? showTitle
            return SpecificRequiredItem.ofEpisodeSeason(contentId: contentId, genres: genres, showTitle: showTitle, seasonNumber: seasonNumber, episodeNumber: episodeNumber, episodeTitle: episodeTitle)
        case "episode_non_season":
            let episodeNumber = (metadata["episodeIndex"] as? Int) ?? -1
            let episodeTitle = (metadata["episodeTitle"] as? String) ?? showTitle
            return SpecificRequiredItem.ofEpisodeNonSeason(contentId: contentId, genres: genres, showTitle: showTitle, episodeNumber: episodeNumber, episodeTitle: episodeTitle)
        case "series":
            return SpecificRequiredItem.ofSeries(contentId: contentId, genres: genres, showTitle: showTitle)
        default:
            return SpecificRequiredItem.ofStandalone(contentId: contentId, genres: genres, showTitle: showTitle)
        }
    }
}
