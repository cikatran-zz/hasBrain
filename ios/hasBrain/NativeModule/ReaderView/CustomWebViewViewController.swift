//
//  CustomWebViewViewController.swift
//  hasBrain
//
//  Created by Chuong Huynh on 5/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import WebKit

public class CustomWebViewViewController: UIViewController {
    
    // MARK: - Components
    var webView: WKWebView!
    @IBOutlet weak var bottomBarHeight: NSLayoutConstraint!
    @IBOutlet weak var progressView: UIProgressView!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var prevButton: UIButton!
    @IBOutlet weak var bookmarkButton: UIButton!
    
    // MARK: - Properties
    fileprivate var url: URL!
    fileprivate var onShareCallback: (()->Void)? = nil
    fileprivate var onDismissCallback: (()->Void)? = nil
    fileprivate var onUrlChangeCallback: ((String, String)-> Void)? = nil
    fileprivate var onScrollCallback: ((NSNumber, NSNumber)->Void)? = nil
    fileprivate var onDoneReadingCallback: (()->Void)? = nil
    fileprivate var onBookmarkCallback: ((Bool)->Void)? = nil
    fileprivate var onLoadingChangeCallback: ((Bool)->Void)? = nil
    fileprivate var isRedirect = false
    fileprivate var lastPosition: NSNumber!
    fileprivate var initBookmarked: Bool = false
    
    override public func viewDidLoad() {
        super.viewDidLoad()
        self.setupWebViewView()
        self.bookmarkButton.isSelected = initBookmarked
        
        UIMenuController.shared.menuItems = [UIMenuItem(title: "Highlight", action: #selector(recommend))]
        UIMenuController.shared.update()
    }
    
    func recommend() {
        let selected = UIPasteboard.general.string
        print(selected)
    }
    
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
    }
    
    private func setupWebViewView() {
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.translatesAutoresizingMaskIntoConstraints = false
        if (self.url != nil && webView.url == nil) {
            webView.load(URLRequest(url: self.url))
        }
        self.view.insertSubview(webView, at: 0)
        webView.navigationDelegate = self
        webView.scrollView.delegate = self
        
        if #available(iOS 11, *) {
            let guide = self.view.safeAreaLayoutGuide
            NSLayoutConstraint.activate([
                webView.topAnchor.constraintEqualToSystemSpacingBelow(guide.topAnchor, multiplier: 1.0),
                    guide.bottomAnchor.constraint(equalTo: webView.bottomAnchor, constant: bottomBarHeight.constant)
            ])
            NSLayoutConstraint.activate([
                webView.leadingAnchor.constraint(equalTo: guide.leadingAnchor),
                webView.trailingAnchor.constraint(equalTo: guide.trailingAnchor)
                ])
        } else {
            NSLayoutConstraint.activate([
                webView.topAnchor.constraint(equalTo: self.view.topAnchor, constant: 0),
                bottomLayoutGuide.topAnchor.constraint(equalTo: webView.bottomAnchor, constant: getBottomMargin() + bottomBarHeight.constant)
            ])
            NSLayoutConstraint.activate([
                webView.leadingAnchor.constraint(equalTo: self.view.leadingAnchor),
                webView.trailingAnchor.constraint(equalTo: self.view.trailingAnchor)
            ])
        }
        
        webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
    }
    
    override public func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if (keyPath == "estimatedProgress") {
            progressView.isHidden = webView.estimatedProgress == 1
            progressView.setProgress(Float(webView.estimatedProgress), animated: false)
        }
    }
    
    
}

public extension CustomWebViewViewController {
    
    public func load(urlString: String, header: String, onShare: @escaping ()->Void, onDismissed: @escaping ()->Void, onBookmark: @escaping(Bool)-> Void, onUrlChange: @escaping (String, String)-> Void, onScroll: @escaping (NSNumber, NSNumber)-> Void, onDoneReading: @escaping ()->Void, onLoadingChange: @escaping (Bool)->Void) {
        self.title = header
        if let url = URL(string: urlString) {
            self.url = url
            if (webView != nil) {
                webView.load(URLRequest(url: self.url))
            }
        }
        self.onShareCallback = onShare
        self.onDismissCallback = onDismissed
        self.onUrlChangeCallback = onUrlChange
        self.onScrollCallback = onScroll
        self.onDoneReadingCallback = onDoneReading
        self.onBookmarkCallback = onBookmark
        self.onLoadingChangeCallback = onLoadingChange
    }
    
    public func scrollTo(x: NSNumber, y: NSNumber) {
        lastPosition = y
        if (!webView.isLoading) {
            webView.scrollView.setContentOffset(CGPoint(x: 0, y: CGFloat(y.doubleValue) ), animated: true)
            lastPosition = -1
        }
    }
    
    public func bookmark(_ isBookmarked: NSNumber) {
        if (self.bookmarkButton != nil) {
            self.bookmarkButton.isSelected = isBookmarked.boolValue
        } else {
            self.initBookmarked = isBookmarked.boolValue
        }
    }
}

extension CustomWebViewViewController: WKNavigationDelegate {
    
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        nextButton.isEnabled = webView.canGoForward
        prevButton.isEnabled = webView.canGoBack
        
        if isRedirect == false {
            if let _ = webView.url {
                self.onUrlChangeCallback?(self.url.absoluteString, webView.url!.absoluteString)
                self.url = webView.url!
            }
        }
        isRedirect = false
        
        if (lastPosition != -1) {
            webView.scrollView.setContentOffset(CGPoint(x: 0, y: CGFloat(lastPosition.doubleValue) ), animated: true)
            lastPosition = -1
        }
        onLoadingChangeCallback?(false)
    }
    
    public func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        
        nextButton.isEnabled = webView.canGoForward
        prevButton.isEnabled = webView.canGoBack
        onLoadingChangeCallback?(true)
    }
    
    public func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {
        
        isRedirect = true
    }
}

extension CustomWebViewViewController: UIScrollViewDelegate {
    public func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        let x = Double(scrollView.contentOffset.x)
        let y = Double(scrollView.contentOffset.y)
        
        if (scrollView.contentOffset.y + scrollView.frame.size.height + 50 >= scrollView.contentSize.height) {
            self.onDoneReadingCallback?()
        } else {
            self.onScrollCallback?(NSNumber(value: x), NSNumber(value: y))
        }
    }
}

// MARK: - Actions
extension CustomWebViewViewController {
    
    @IBAction func backButtonTapped(_ sender: UIBarButtonItem) {
        let transition = CATransition()
        transition.duration = 0.35
        transition.type = kCATransitionPush
        transition.subtype = kCATransitionFromLeft
        transition.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut)
        self.view.window!.layer.add(transition, forKey: kCATransition)
        self.dismiss(animated: false) {
            self.onDismissCallback?()
        }
    }
    
    @IBAction func bookmarkButtonTapped(_ sender: UIButton) {
        sender.isSelected = !sender.isSelected
        self.onBookmarkCallback?(sender.isSelected)
    }
    
    @IBAction func shareButtonTapped(_ sender: UIButton) {
        onShareCallback?()
    }
    
    @IBAction func prevButtonTapped(_ sender: UIButton) {
        webView.goBack()
    }
    
    @IBAction func nextButtonTapped(_ sender: UIButton) {
        webView.goForward()
    }
}
