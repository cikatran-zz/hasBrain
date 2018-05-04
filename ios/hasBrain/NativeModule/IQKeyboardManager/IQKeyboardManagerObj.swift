//
//  IQKeyboardManagerObj.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/23/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import IQKeyboardManagerSwift

@objc(IQKeyboardManagerObj)
class IQKeyboardManagerObj: NSObject {
    @objc public static func enable() {
        IQKeyboardManager.sharedManager().enable = true
    }
}
