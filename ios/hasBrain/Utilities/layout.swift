//
//  layout.swift
//  hasBrain
//
//  Created by Chuong Huynh on 5/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import UIKit

func getTopMargin() -> CGFloat {
    
    if (UIScreen.main.bounds.width == 375 && UIScreen.main.bounds.height == 812) {
        return 44
    }
    return 24
}

func getBottomMargin() -> CGFloat {
    if (UIScreen.main.bounds.width == 375 && UIScreen.main.bounds.height == 812) {
        return 44
    }
    return 0
}
