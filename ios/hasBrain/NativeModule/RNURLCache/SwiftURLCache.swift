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
    let urlCached = URLCache(memoryCapacity: Int(2e+7), diskCapacity: Int(2e+8), diskPath: nil)
    let urlSession = URLSession(configuration: URLSessionConfiguration.default)
    
    private override init() {
//        for _ in 0..<maximumParallelCache {
//            var webview: WKWebView?
//            DispatchQueue.main.sync {
//                webview = WKWebView(frame: .zero)
//            }
//            webviews.append(webview!)
//        }
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
            
            if let _ = URLCache.shared.cachedResponse(for: request) {
                print("Already cached \(urlStr)")
                return
            }
            if (self.currentCaching >= maximumParallelCache) {
                self.notCached.append(urlStr)
                return
            }
            self.currentCaching += 1
            let task = self.urlSession.dataTask(with: request, completionHandler: { (data, response, error) in
                print("Done cached \(urlStr)")
                if let _ = data, let _ = response {
                    self.urlCached.storeCachedResponse(CachedURLResponse(response: response!, data: data!) , for: request)
                    self.cachedQueue.async {
                        self.currentCaching -= 1
                        if let _ = self.notCached.first {
                            let lastUrl = self.notCached.removeFirst()
                            self.cacheURL(lastUrl)
                        }
                    }
                }
            })
            task.resume()
        }
    }
}
