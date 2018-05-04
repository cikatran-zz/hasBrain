//
//  Swift+Extension.swift
//  hasBrain
//
//  Created by Chuong Huynh on 4/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

extension String {
    public func asJSONObj() -> JSONObj? {
        
        if let data = self.data(using: .utf8) {
            do {
                return try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
            } catch {
                print(error.localizedDescription)
            }
        }
        return nil
    }
}
