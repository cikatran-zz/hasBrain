//
//  Functions.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/14/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation


public typealias JSONArr = [Any]
public typealias JSONObj = [String: Any]

public func emptyJsonArr() -> JSONArr {
    return JSONArr()
}

public func emptyJsonObj() -> JSONObj {
    return JSONObj()
}

public func asJsonObj(_ any: Any?) -> JSONObj {
    
    guard let jsonObj = any as? JSONObj else {
        if let jsonString = any as? String, let jsonObj = jsonString.asJSONObj() {
            return jsonObj
        }
        return emptyJsonObj()
    }
    return jsonObj
}

public func asJsonArr(_ any: Any?) -> JSONArr {
    guard let jsonObj = any as? JSONArr else {
        return emptyJsonArr()
    }
    return jsonObj
}

func asJSONString(_ json: [String: Any]) -> String? {
    if (!JSONSerialization.isValidJSONObject(json)) {
        return nil
    }
    let jsonData = try? JSONSerialization.data(withJSONObject: json, options: [])
    if let _ = jsonData {
        return String(data: jsonData!, encoding: .utf8)
    }
    return nil
}
