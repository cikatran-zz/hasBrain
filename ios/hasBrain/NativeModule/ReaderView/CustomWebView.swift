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
    fileprivate let _highlightedJs: String = """
    function selectedText(id) {
        var range = window.getSelection().getRangeAt(0);
        var result = window.getSelection().toString();
        if (result.length >= 10 && result.length <= 500 && result.indexOf('\\n') === -1) {
            span = document.createElement('span');
            span.style.backgroundColor = "yellow";
            span.id = id;
            span.appendChild(range.extractContents());
            span.addEventListener("click", function(e) {
                window.alert(id);
            }, false);
            range.insertNode(span);
            return result;
        }
        return "_error"
    }
    """
    
    fileprivate let createHighlight = """
    function getHighlighter() {
      if (!window.minhhienHighlighter) {
        window.minhhienHighlighter = new window.HighlightHelper();
      }
      return window.minhhienHighlighter
    }

    function createHighlight() {
      const highlightHelper = getHighlighter();

      selection = document.getSelection()
      isBackwards = highlightHelper.rangeUtil.isSelectionBackwards(selection)
      focusRect = highlightHelper.rangeUtil.selectionFocusRect(selection)
      if (!focusRect) {
        return
      }
      if (!selection.rangeCount || selection.getRangeAt(0).collapsed) {
        highlightHelper.selectedRanges = []
      } else {
        highlightHelper.selectedRanges = [selection.getRangeAt(0)];
      }
      highlightHelper.createHighlight().then(result => {
        if (result.length) {
          const anchor = result[0];
          if (anchor && anchor.target && anchor.target.selector) {
            const textQuoteSelector = anchor.target.selector.find(({ type }) => type === "TextQuoteSelector");
            if (textQuoteSelector) {
                window.alert({
                    core: textQuoteSelector.exact,
                    prev: textQuoteSelector.prefix,
                    next: textQuoteSelector.suffix,
                    serialized: JSON.stringify(anchor.target.selector)
                })
            }
          }
        }
      });
      
    }
    createHighlight()
    """
    
    func renderHighlights(data: String) -> String {
        return """
        function getHighlighter() {
            if (!window.minhhienHighlighter) {
                window.minhhienHighlighter = new window.HighlightHelper();
            }
            return window.minhhienHighlighter
        }
        function showHighlights() {
            var highlightData = \(data)
            highlightData = highlightData.highlights
            const targets = highlightData.map(({ core, prev, next, serialized }) => ({
                source: "\(self.source)",
                selector: JSON.parse(serialized)
            }));
            if (targets.length) {
                const highlightHelper = getHighlighter();
                highlightHelper.restoreHighlightFromTargets(targets);
            }
        }
        showHighlights();
        """
    }
    
    fileprivate var isRedirect = false
    
    // MARK: - Public props
    
    public var source: String = "" {
        didSet {
            if let _url = URL(string: source), _url != self.url {
                //self.load(URLRequest(url: URL(string:"about:blank")!))
                //let request = URLRequest(url: _url, cachePolicy: URLRequest.CachePolicy.returnCacheDataElseLoad)
                //let cachedUrl = URLCache.shared.cachedResponse(for: request)
                //if cachedUrl == nil {
                    //SwiftURLCache.shared.cacheURL(source)
                    //print("Not load \(source)")
                    self.load(URLRequest(url: _url, cachePolicy: URLRequest.CachePolicy.returnCacheDataElseLoad) )
                //} else {
                    print("Load from cache \(source)")
                    //self.load(cachedUrl!.data, mimeType: cachedUrl!.response.mimeType ?? "text/html", characterEncodingName: cachedUrl!.response.textEncodingName ?? "UTF-8", baseURL: cachedUrl!.response.url!.baseURL ?? cachedUrl!.response.url!)
                //}
            }
            
        }
    }
    public var initPosition: [String: Any] = [:] {
        didSet {
            scrollToLastPosition()
        }
    }
    public var topInset: NSNumber = 0 {
        didSet {
            self.scrollView.contentInset = UIEdgeInsetsMake(CGFloat(topInset.floatValue), 0, 0, 0)
        }
    }
    public var highlightData: String = "" {
        didSet {
            showHighlights()
        }
    }
    public var onHighlight: RCTDirectEventBlock = { event in }
    public var onUrlChanged: RCTDirectEventBlock = { event in }
    public var onLoadingChanged: RCTDirectEventBlock = { event in }
    public var onNavigationChanged: RCTDirectEventBlock = {event in }
    public var onScrollEnd: RCTDirectEventBlock = { event in }
    public var onScroll: RCTDirectEventBlock = { event in }
    public var onScrollEndDragging: RCTDirectEventBlock = { event in }
    public var onHighlightRemove: RCTDirectEventBlock = {event in }
    
    var highlightedText2Id = [String: String]()
    
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
        
        self.addObserver(self, forKeyPath: "canGoBack", options: .new, context: &webViewContext)
        self.addObserver(self, forKeyPath: "canGoForward", options: .new, context: &webViewContext)
        self.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: &webViewContext)
        self.addObserver(self, forKeyPath: "loading", options: .new, context: &webViewContext)
        
        NotificationCenter.default.addObserver(self, selector: #selector(reloadWebview), name: NSNotification.Name("com.hasbrain.customwebview.reload"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(goBackWebview), name: NSNotification.Name("com.hasbrain.customwebview.goback"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(goForwardWebview), name: NSNotification.Name("com.hasbrain.customwebview.goforward"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(removeHighlight(_:)), name: NSNotification.Name("com.hasbrain.customwebview.removeHighlight"), object: nil)
        
        // Add message handler
        self.configuration.userContentController.addUserScript(WKUserScript(
            source: "window.alert = function(message){window.webkit.messageHandlers.messageBox.postMessage({message:message});};",
            injectionTime: WKUserScriptInjectionTime.atDocumentStart,
            forMainFrameOnly: true))
        if let path = Bundle.main.path(forResource: "HighlightHelper", ofType: "js") {
            self.configuration.userContentController.addUserScript(WKUserScript(source: (try? String(contentsOfFile: path)) ?? "", injectionTime: .atDocumentEnd, forMainFrameOnly: true))
        }
        self.configuration.userContentController.add(self, name: "messageBox")
    }
    
    func highlight() {
        self.evaluateJavaScript(createHighlight) { (result, error) in
            if (error != nil) {
                print(error)
            }
        }
        
//        let id = "highlight_" + UUID().uuidString.replacingOccurrences(of: "-", with: "_")
//        self.evaluateJavaScript("selectedText(\"\(id)\")") { (result, error) in
//            if let highlightedText = result as? String {
//                let newText = highlightedText.trimmingCharacters(in: .whitespacesAndNewlines)
//                if (newText == "_error") {
//                    self.onHighlight(["error": NSNumber(value: 301) ])
//                    return
//                }
//                self.highlightedText2Id[id] = newText
//                self.onHighlight(["text":newText])
//            }else {
//                print("Error", error)
//            }
//        }
    }
    
    func insertCSSString(into webView: WKWebView) {
        let cssString = "highlight-hasbrain { background-color: yellow;}"
        let jsString = "var style = document.createElement('style'); style.innerHTML = '\(cssString)'; document.head.appendChild(style);"
        webView.evaluateJavaScript(jsString, completionHandler: nil)
    }
    
    func showHighlights() {
        self.evaluateJavaScript(self.renderHighlights(data: self.highlightData)) { (result, error) in
            if ((error) != nil) {
                print(error)
            }
        }
    }
    
    func removeHighlight(_ notification: NSNotification) {
        if let id = notification.userInfo?["id"] as? String {
            let js = "document.getElementById(\"\(id)\").style = null"
            DispatchQueue.main.async {
                self.evaluateJavaScript(js){ (result, error) in
                    print(error)
                }
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

extension CustomWebView: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "messageBox" {
            if let sentData = message.body as? Dictionary<String, String> {
                
                if let textId = sentData["message"] as? String, let highlightText = highlightedText2Id[textId] as? String {
                    onHighlightRemove(["text": highlightText, "id": textId])
                }
            } else if let sentData = message.body as? Dictionary<String, Any> {
                if let highlightData = sentData["message"] as? [String:String] {
                    onHighlight(highlightData)
                }
            }
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
        showHighlights()
        insertCSSString(into: webView)
        if isRedirect == false {
            if let _url = webView.url {
                self.onUrlChanged(["url": _url.absoluteString])
                self.onNavigationChanged(["canGoBack": self.canGoBack, "canGoForward": self.canGoForward])
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
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let x = Double(scrollView.contentOffset.x)
        let y = Double(scrollView.contentOffset.y)
        onScroll(["x":x, "y": y, "layoutHeight": Double(self.frame.height), "contentHeight": Double(scrollView.contentSize.height)])
    }
    
    func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {
        let x = Double(scrollView.contentOffset.x)
        let y = Double(scrollView.contentOffset.y)
        onScrollEndDragging(["x": x, "y": y, "scale": Double(self.contentScaleFactor)])
    }
}
