//
//  UserKitModule.swift
//  hasBrain
//
//  Created by Chuong Huynh on 3/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserKit

@objc(UserKitModule)
class UserKitModule: NSObject {
    
    public static let sharedInstance = UserKitModule()
    private var module: UserKitInstance! = nil
    
    private override init() {
        super.init()
    }
    
    @objc public func initialize(token: String) {
        UserKit.initialize(token: token)
        module = UserKit.mainInstance()
        if UIDevice.current.model.starts(with: "iPhone") {
            module.deviceType = DeviceType.Phone.rawValue
        } else {
            module.deviceType = DeviceType.Tablet.rawValue
        }
        
    }
    
    @objc public func setDeviceType(type: String) {
        module.deviceType = type
    }
    
    @objc public func time(event: String) {
        module.time(event: event)
    }
    
    @objc public func track(event: String, properties: [String: Any]) {
        module.track(event: event, properties: properties)
    }
    
    @objc public func addDeviceToken(_ token: Data) {
        module.deviceToken = token
    }
    
    @objc public func incrementProperty(_ properties: [String: Any], successBlock: @escaping (String?) -> Void, errorBlock: @escaping (String?)->Void) {
        module.profile.increment(properties: properties, successBlock: { (results) in
            if let resultsDict = results as? [String: Any] {
                successBlock(asJSONString(resultsDict))
            } else {
                errorBlock(asJSONString(["message": "Unknown error"]))
            }
        }) { (error) in
            if let errorM = error as? ErrorModel {
                errorBlock(errorM.toString())
            } else {
                errorBlock(error as? String)
            }
        }
    }
    
    @objc public func appendProperty(_ properties: [String: Any], successBlock: @escaping (String?) -> Void, errorBlock: @escaping (String?)->Void) {
        module.profile.append(properties: properties, successBlock: { (results) in
            if let resultsDict = results as? [String: Any] {
                successBlock(asJSONString(resultsDict))
            } else {
                errorBlock(asJSONString(["message": "Unknown error"]))
            }
        }) { (error) in
            if let errorM = error as? ErrorModel {
                errorBlock(errorM.toString())
            } else {
                errorBlock(error as? String)
            }
        }
    }
    
    @objc public func storeProperty(properties: [String: Any], successBlock: @escaping ([String: Any]) -> Void, errorBlock: @escaping (String?)->Void) {
        module.profile.set(properties: properties, successBlock: { (results) in
            if let resultsDict = results as? [String: Any] {
                successBlock(resultsDict)
            } else {
                errorBlock(asJSONString(["message": "Unknown error"]))
            }
        }) { (error) in
            if let errorM = error as? ErrorModel {
                errorBlock(errorM.toString())
            } else {
                errorBlock(error as? String)
            }
        }
    }
    
    @objc public func storeProperties(properties: String, successBlock: @escaping ([String: Any]) -> Void, errorBlock: @escaping (String?)->Void) {
        self.storeProperty(properties: asJsonObj(properties), successBlock: { (results) in
            successBlock(results)
        }) { (error) in
             errorBlock(error)
        }
    }
    
    
    
    @objc public func getProperty(key: String, successBlock: @escaping ([String: Any]?) -> Void, errorBlock: @escaping (String?)->Void) {
        module.profile.getProperty(key, successBlock: { (results) in
            if let resultsDict = results as? [String: Any] {
                successBlock(resultsDict)
            } else {
                errorBlock(asJSONString(["message": "Unknown error"]))
            }
        }) { (error) in
            if let errorM = error as? ErrorModel {
                errorBlock(errorM.toString())
            } else {
                errorBlock(error as? String)
            }
        }
    }
}
