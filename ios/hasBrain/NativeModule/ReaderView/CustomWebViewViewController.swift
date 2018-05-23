//
//  CustomWebViewViewController.swift
//  hasBrain
//
//  Created by Chuong Huynh on 5/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import WebKit

public class CustomWebViewViewController: UIViewController, WKNavigationDelegate {
    
    // MARK: - Components
    var webView: WKWebView!
    @IBOutlet weak var bottomBarHeight: NSLayoutConstraint!
    @IBOutlet weak var progressView: UIProgressView!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var prevButton: UIButton!
    
    // MARK: - Properties
    fileprivate var url: URL!
    fileprivate var header: String!
    fileprivate var onShareCallback: (()->Void)? = nil
    fileprivate var onDismissCallback: (()->Void)? = nil
    
    override public func viewDidLoad() {
        super.viewDidLoad()
        self.setupWebViewView()
        self.title = self.header
    }
    
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.title = self.header
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
    
    public func load(urlString: String, header: String, onShare: @escaping ()->Void, onDismissed: @escaping ()->Void, onBookmark: ()-> Void) {
        self.header = header
        if let url = URL(string: urlString) {
            self.url = url
            if (webView != nil) {
                webView.load(URLRequest(url: self.url))
            }
        }
        self.onShareCallback = onShare
        self.onDismissCallback = onDismissed
        
    }
}

extension CustomWebViewViewController {
    
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        
    }
    
    public func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        nextButton.isEnabled = webView.canGoForward
        prevButton.isEnabled = webView.canGoBack
    }
}

// MARK: - Actions
extension CustomWebViewViewController {
    
    @IBAction func backButtonTapped(_ sender: UIBarButtonItem) {
        
        self.dismiss(animated: true) {
            self.onDismissCallback?()
        }
    }
    
    @IBAction func bookmarkButtonTapped(_ sender: UIButton) {
        sender.isSelected = !sender.isSelected
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
