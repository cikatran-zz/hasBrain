//
//  Notification.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/17/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKit

class Notification: Equatable {
    
    var title: String
    var body: String
    var isRead: Bool
    
    static func == (lhs: Notification, rhs: Notification) -> Bool {
        return lhs.title == rhs.title && lhs.body == rhs.body
    }
    
    init(title: String, body: String, isRead: Bool = false) {
        self.body = body
        self.title = title
        self.isRead = isRead
    }
    
    init(jsonObj: JSONObj) {
        self.title = (jsonObj["title"] as? String) ?? ""
        self.body = (jsonObj["body"] as? String) ?? ""
        self.isRead = (jsonObj["isRead"] as? Bool) ?? false
    }
    
    public func toJson() -> [String: Any] {
        return [
            "title": title as Any,
            "body": body as Any,
            "isRead": isRead as Any
        ]
    }
    
    public static func updateNotification(noti: Notification, successBlock: @escaping ()->Void, errorBlock: @escaping (Any)->Void) {
        UserKit.mainInstance().profile.getProperty("notification", successBlock: { (notifications) in
            
            let list =  asJsonArr(asJsonObj(asJsonObj(notifications)["notification"])["data"])
            var isAdded = false
            var newList = list.map { element  -> Notification in
                let notification = Notification(jsonObj: asJsonObj(element))
                if (notification == noti) {
                    isAdded = true
                    return noti
                }
                return notification
            }
            if (!isAdded) {
                newList.insert(noti, at: 0)
            }
            UIApplication.shared.applicationIconBadgeNumber = (newList.filter{ $0.isRead == false}).count
            UserKitModule.sharedInstance.storeProperty(key: "notification", value: ["data": newList.map{ $0.toJson()} as Any], successBlock: {success in
                successBlock()
            }, errorBlock: {error in
                errorBlock(error!)
            })
        }) { (error) in
            errorBlock(error)
        }
    }
    
    public static func updateNotifications(notis: [Notification], successBlock: @escaping ()->Void, errorBlock: @escaping (Any)->Void) {
        UserKit.mainInstance().profile.getProperty("notification", successBlock: { (notifications) in
            
            let list =  asJsonArr(asJsonObj(asJsonObj(notifications)["notification"])["data"])
            var checkedNotis: [Bool] = notis.map{ item in return false }
            var newList = list.map { element  -> Notification in
                let notification = Notification(jsonObj: asJsonObj(element))
                for i in 0..<checkedNotis.count {
                    if (checkedNotis[i] == false) {
                        if (notis[i] == notification) {
                            checkedNotis[i] = true
                            return notis[i]
                        }
                    }
                }
                return notification
            }
            
            for i in 0..<checkedNotis.count {
                if (checkedNotis[i] == false) {
                    newList.insert(notis[i], at: 0)
                }
            }
            UIApplication.shared.applicationIconBadgeNumber = (newList.filter{ $0.isRead == false}).count
            UserKitModule.sharedInstance.storeProperty(key: "notification", value: ["data": newList.map{ $0.toJson()} as Any], successBlock: {success in
                successBlock()
            }, errorBlock: {error in
                errorBlock(error!)
            })
        }) { (error) in
            errorBlock(error)
        }
    }
}
