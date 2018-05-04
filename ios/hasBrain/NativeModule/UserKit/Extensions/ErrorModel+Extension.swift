//
//  ErrorModel+Extension.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UserKit

extension ErrorModel {
    
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
