//
//  OANotificationCenter.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserNotifications
import UserKit

@objc(OANotificationCenter)
class OANotificationCenter: NSObject, UNUserNotificationCenterDelegate {
    
    public static let sharedInstance: OANotificationCenter = OANotificationCenter()
    
    private override init() {
        super.init()
    }
    
    @objc public func requestPermission(callback: @escaping () -> Void) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.badge, .sound, .alert], completionHandler: { granted, error in
            if granted {
                UNUserNotificationCenter.current().delegate = self
                UNUserNotificationCenter.current().getDeliveredNotifications(completionHandler: { (notifications) in
                    let notis = notifications.map{ noti -> Notification in
                        let userInfo = noti.request.content.userInfo
                        let titleArr = asJsonArr(userInfo["0"])
                        var title = ""
                        if (titleArr.count > 1) {
                            title = titleArr[1] as? String ?? ""
                        }
                        if (title == "") {
                            title = userInfo["title"] as? String ?? ""
                        }
                        return Notification(jsonObj: asJsonObj(["title": title as Any, "body": asJsonObj(userInfo["aps"])["alert"] as Any]) )
                    }
                    Notification.updateNotifications(notis: notis, successBlock: {}, errorBlock: { _ in });
                });
            }
            callback()
        })
    }
    
    @objc public func checkGranted(callback: @escaping (Bool) -> Void) {
        UNUserNotificationCenter.current().getNotificationSettings { (settings) in
            if settings.authorizationStatus == .authorized {
                callback(true)
            } else {
                callback(false)
            }
        }
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([UNNotificationPresentationOptions.alert, UNNotificationPresentationOptions.sound, UNNotificationPresentationOptions.badge])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        // TODO: - Handle notification
        let userInfo = response.notification.request.content.userInfo
        OANotificationCenter.sharedInstance.receiveNotification(userInfo: userInfo)
    }
    
    func receiveNotification(userInfo: [AnyHashable: Any]) {
        let titleArr = asJsonArr(userInfo["0"])
        var title = ""
        if (titleArr.count > 1) {
            title = titleArr[1] as? String ?? ""
        }
        if (title == "") {
            title = userInfo["title"] as? String ?? ""
        }
        let noti = Notification(jsonObj: ["title": title as Any, "body":asJsonObj(userInfo["aps"])["alert"] as Any])
        Notification.updateNotification(noti: noti, successBlock: {}, errorBlock: {_ in})
        UserKit.mainInstance().pushNotificationOpened(userInfo)
    }
    
    @objc func updateBadge(number: NSNumber) {
        UIApplication.shared.applicationIconBadgeNumber = Int(number)
    }
}


