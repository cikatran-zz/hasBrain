//
//  UserKitIdentityProfile+Extension.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKitIdentity
import SwiftyJSON

public extension UserKitIdentityProfile {
    
    public func toJson() -> JSON {
        
        var json = [
            "id": (self.id ?? "") as Any,
            "name": (self.name ?? "") as Any,
            "account_id": (self.accountId ?? "") as Any,
            "account_email": (self.accountEmail ?? "") as Any,
            "avatar": (self.avatar ?? []).flatMap{ $0.toJson() } as Any,
            "createdAt": (self.createdAt ?? "") as Any
        ]
        self.customProperties?.forEach{ (key, value) in
            json[key] = String(describing: value)
        }
        
        return JSON(json)
    }
}
