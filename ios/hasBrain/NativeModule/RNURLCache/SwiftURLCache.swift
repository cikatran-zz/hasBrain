//
//  RNURLCache.swift
//  hasBrain
//
//  Created by Chuong Huynh on 6/19/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import WebKit

let maximumParallelCache = 5

@objc(SwiftURLCache)
class SwiftURLCache: NSObject, WKNavigationDelegate {
    public static let shared = SwiftURLCache()
    private var notCached = [String]()
    let cachedQueue = DispatchQueue(label: "com.hasbrain.urlcache")
    var currentCaching = 0
    var webviews = [WKWebView]()
    
    private override init() {
        for _ in 0..<maximumParallelCache {
            var webview: WKWebView?
            DispatchQueue.main.sync {
                webview = WKWebView(frame: .zero)
            }
            webviews.append(webview!)
        }
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        self.cachedQueue.async {
            self.currentCaching -= 1
            if let _ = self.notCached.first {
                let lastUrl = self.notCached.removeFirst()
                DispatchQueue.main.async {
                    let request = URLRequest(url: URL(string: lastUrl)!, cachePolicy: URLRequest.CachePolicy.returnCacheDataElseLoad)
                    webView.load(request)
                }
            }
        }
    }
    
    public func cacheURL(_ urlStr: String) {
        guard let url = URL(string: urlStr) else {return}
        
        let request = URLRequest(url: url, cachePolicy: URLRequest.CachePolicy.returnCacheDataElseLoad)
        cachedQueue.async {
            if (self.currentCaching >= maximumParallelCache) {
                self.notCached.append(urlStr)
                return
            }
            self.currentCaching += 1
            for i in 0..<maximumParallelCache {
                DispatchQueue.main.async {
                    if (!self.webviews[i].isLoading) {
                        self.webviews[i].navigationDelegate = self
                        DispatchQueue.main.async {
                            self.webviews[i].load(request)
                        }
                        
                    }
                }
            }
        }
    }
}
