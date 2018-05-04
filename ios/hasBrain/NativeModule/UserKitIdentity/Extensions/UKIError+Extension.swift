//
//  UKIError+Extension.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKitIdentity

public extension UKIError {
    public func toJson() -> [String: Any] {
        return [
            "message": (message ?? "") as Any,
            "http_code": (httpCode ?? -1) as Any,
            "error_code": (errorCode ?? -1) as Any
        ]
    }
    
    public func toString() -> String? {
       return asJSONString(self.toJson())
    }
}
