//
//  CustomWebView.swift
//  hasBrain
//
//  Created by Chuong Huynh on 6/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import WebKit
import NotificationCenter

var webViewContext = 0

class CustomWebView: WKWebView {
    
    // MARK: - Private props
    fileprivate let highlightedJs: String = """
    function selectedText() {
        var range = window.getSelection().getRangeAt(0);
        var result = window.getSelection().toString();
        span = document.createElement('span');
        span.style.backgroundColor = "yellow";
        span.appendChild(range.extractContents());
        range.insertNode(span);
        return result;
    }
    """
    fileprivate var isRedirect = false
    
    // MARK: - Public props
    
    public var source: String = "" {
        didSet {
            if let _url = URL(string: source) {
                
                let request = URLRequest(url: _url, cachePolicy: URLRequest.CachePolicy.returnCacheDataElseLoad)
                let cachedUrl = URLCache.shared.cachedResponse(for: request)
                if cachedUrl == nil {
                    SwiftURLCache.shared.cacheURL(source)
                    print("Not load \(source)")
                    self.load(URLRequest(url: _url, cachePolicy: URLRequest.CachePolicy.returnCacheDataElseLoad) )
                } else {
                    print("Load from cache \(source)")
                    self.load(cachedUrl!.data, mimeType: cachedUrl!.response.mimeType ?? "text/html", characterEncodingName: cachedUrl!.response.textEncodingName ?? "UTF-8", baseURL: cachedUrl!.response.url!.baseURL ?? cachedUrl!.response.url!)
                }
            }
            
        }
    }
    public var initPosition: [String: Any] = [:] {
        didSet {
            scrollToLastPosition()
        }
    }
    public var topInset: NSNumber = 112 {
        didSet {
            self.scrollView.contentInset = UIEdgeInsetsMake(112, 0, 0, 0)
        }
    }
    public var onHighlight: RCTDirectEventBlock = { event in }
    public var onUrlChanged: RCTDirectEventBlock = { event in }
    public var onLoadingChanged: RCTDirectEventBlock = { event in }
    public var onNavigationChanged: RCTDirectEventBlock = {event in }
    public var onScrollEnd: RCTDirectEventBlock = { event in }
    
    // MARK: - Override props
    
    override init(frame: CGRect, configuration: WKWebViewConfiguration) {
        super.init(frame: frame, configuration: configuration)
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    convenience init() {
        self.init(frame: .zero, configuration: WKWebViewConfiguration())
    }
    
    deinit {
        self.removeObserver(self, forKeyPath: "canGoBack")
        self.removeObserver(self, forKeyPath: "canGoForward")
        self.removeObserver(self, forKeyPath: "estimatedProgress")
        self.removeObserver(self, forKeyPath: "loading")
        
        NotificationCenter.default.removeObserver(self)
    }
    
    func commonInit() {
        UIMenuController.shared.menuItems = [UIMenuItem(title: "Highlight", action: #selector(highlight))]
        UIMenuController.shared.update()
        self.allowsBackForwardNavigationGestures = false
        self.navigationDelegate = self
        self.scrollView.delegate = self
//        self.scrollView.showsHorizontalScrollIndicator = false
//        self.scrollView.showsVerticalScrollIndicator = false
//        self.scrollView.contentInset = UIEdgeInsetsMake(112, 0, 0, 0)
        self.addObserver(self, forKeyPath: "canGoBack", options: .new, context: &webViewContext)
        self.addObserver(self, forKeyPath: "canGoForward", options: .new, context: &webViewContext)
        self.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: &webViewContext)
        self.addObserver(self, forKeyPath: "loading", options: .new, context: &webViewContext)
        
        NotificationCenter.default.addObserver(self, selector: #selector(reloadWebview), name: NSNotification.Name("com.hasbrain.customwebview.reload"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(goBackWebview), name: NSNotification.Name("com.hasbrain.customwebview.goback"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(goForwardWebview), name: NSNotification.Name("com.hasbrain.customwebview.goforward"), object: nil)
    }
    
    func highlight() {
        self.evaluateJavaScript("selectedText()") { (result, error) in
            if let highlightedText = result as? String {
                self.onHighlight(["text":highlightedText])
            }
        }
    }
    
    func reloadWebview() {
        DispatchQueue.main.async {
            self.reload()
        }
    }
    
    func goBackWebview() {
        DispatchQueue.main.async {
            self.goBack()
        }
    }
    
    func goForwardWebview() {
        DispatchQueue.main.async {
            self.goForward()
        }
    }
    
    func scrollToLastPosition() {
        if (isLoading) {
            return
        }
        if let x = initPosition["x"] as? Double, let y = initPosition["y"] as? Double {
            let scale = initPosition["scale"] as? Double ?? 1.0
            if (x == 0 && y == 0) {
                initPosition = [:]
                return
            }
            self.scrollView.setContentOffset(CGPoint(x: x, y: y), animated: true)
            self.contentScaleFactor = CGFloat(scale)
        }
    }
    
}

extension CustomWebView {
    
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        guard let change = change else {
            return
        }
        
        if context != &webViewContext {
            super.observeValue(forKeyPath: keyPath, of: object, change: change, context: context)
            return
        }
        
        if keyPath == "canGoBack" {
            if let newValue = (change[NSKeyValueChangeKey.newKey] as AnyObject).boolValue {
                onNavigationChanged(["canGoBack": newValue, "canGoForward": self.canGoForward])
            }
        }
        
        if keyPath == "canGoForward" {
            if let newValue = (change[NSKeyValueChangeKey.newKey] as AnyObject).boolValue {
                onNavigationChanged(["canGoBack": self.canGoBack, "canGoForward": newValue])
            }
        }
        
        if keyPath == "estimatedProgress" {
            if let newValue = (change[NSKeyValueChangeKey.newKey] as AnyObject).floatValue {
                DispatchQueue.main.async {
                    self.onLoadingChanged(["progress": newValue, "isLoading": self.isLoading])
                }
                
            }
        }
        
        if keyPath == "loading" {
            if let newValue = (change[NSKeyValueChangeKey.newKey] as AnyObject).boolValue {
                DispatchQueue.main.async {
                    self.onLoadingChanged(["progress": self.estimatedProgress, "isLoading": newValue])
                }
            }
        }
    }
}

extension CustomWebView: WKNavigationDelegate {
    
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript(highlightedJs, completionHandler: nil)
        if isRedirect == false {
            if let _ = webView.url {
                self.onUrlChanged(["url": webView.url!.absoluteString])
            }
        }
        isRedirect = false
        scrollToLastPosition()
    }
    
    public func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {
        
        isRedirect = true
    }
}

extension CustomWebView: UIScrollViewDelegate {
    
    public func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        let x = Double(scrollView.contentOffset.x)
        let y = Double(scrollView.contentOffset.y)
        onScrollEnd(["x": x, "y": y, "scale": Double(self.contentScaleFactor)])
    }
}
