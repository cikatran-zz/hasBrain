//
//  WatchingHistory.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/14/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKit

@objc(WatchingHistory)
public class WatchingHistory: NSObject {
    
    let queue = DispatchQueue(label: "com.onapp.watchingHistory")
    
    public static let sharedInstance = WatchingHistory()
    private override init() {
        super.init()
    }
    
    public func remove(id: String, completion: ((Any)-> Void)?,  errorBlock: ((Any)-> Void)?) {
        queue.async {
            let semaphore = DispatchSemaphore(value: 0)
            UserKit.mainInstance().profile.arrayRemove(UserKitKeys.ContinueWatching.rawValue, propertiesKey: UserKitKeys.Id.rawValue, dbOperatorType: .equal, propertiesValue: id, successBlock: { (result) in
                
                semaphore.signal()
                completion?(result)
            }) { (error) in
                semaphore.signal()
                errorBlock?(error)
            }
            semaphore.wait()
        }
    }
    
    public func getConsumedLength(id: String, completion: @escaping (Double) -> Void) {
        queue.async {
            UserKit.mainInstance().profile.getProperty(UserKitKeys.ContinueWatching.rawValue, successBlock: { (result) in
                if let result = (result as? [String: Any])?[UserKitKeys.ContinueWatching.rawValue] as? [AnyObject] {
                    for i in 0..<result.count {
                        let movie = result[i]
                        if let movieJSON = movie as? [String: Any], let movieId = movieJSON[UserKitKeys.Id.rawValue] as? String {
                            if movieId == id {
                                if let position = movieJSON[UserKitKeys.StopPosition.rawValue] as? Double {
                                    completion(position)
                                    return
                                }
                                
                            }
                        }
                    }
                }
                completion(0)
            }, failBlock: { _ in
                completion(0)
            })
        }
    }
    
    public func updateWatchingHistory(id: String, properties: [String: Any], completion: ((Any)-> Void)?, errorBlock: ((Any)-> Void)?) {
        queue.async {
            let semaphore = DispatchSemaphore(value: 0)
            UserKit.mainInstance().profile.arrayRemove(UserKitKeys.ContinueWatching.rawValue, propertiesKey: UserKitKeys.Id.rawValue, dbOperatorType: .equal, propertiesValue: id, successBlock: { (result) in
                
                UserKit.mainInstance().profile.append(properties: properties, successBlock: { (result) in
                    semaphore.signal()
                    completion?(result)
                }, failBlock: { (error) in
                    semaphore.signal()
                    errorBlock?(error)
                })
            }) { (error) in
                semaphore.signal()
                errorBlock?(error)
            }
            semaphore.wait()
        }
    }
    
    public func getWatchingHistory(completion: @escaping ([Any]) -> Void, errorBlock: ((Any)-> Void)?) {
        queue.async {
            UserKit.mainInstance().profile.getProperty(UserKitKeys.ContinueWatching.rawValue, successBlock: { (videoList) in
                
                let list =  asJsonArr(asJsonObj(videoList)[UserKitKeys.ContinueWatching.rawValue])
                var reversedList = [Any]()
                for arrayIndex in stride(from: list.count - 1, through: 0, by: -1) {
                    reversedList.append(list[arrayIndex])
                }
                completion(reversedList)
            }) { (error) in
                errorBlock?(error)
            }
        }
    }
}
