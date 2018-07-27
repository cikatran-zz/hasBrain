//
//  UserKitIdentityModule.swift
//  hasBrain
//
//  Created by Chuong Huynh on 3/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import UserKitIdentity

@objc(UserKitIdentityModule)
class UserKitIdentityModule: NSObject {
    
    public static let sharedInstance = UserKitIdentityModule()
    
    private var module: UserKitIdentityInstance! = nil
    
    private override init() {
        super.init()
    }
    
    @objc func initialize(token: String) {
        UserKitIdentity.initialize(token: token)
         module = UserKitIdentity.mainInstance()
        #if DEBUG
            module.loggingEnabled = true
        #endif
    }
    
    @objc func signOut() {
        module.signOut()
    }
    
    @objc func signUp(email: String, password: String, customProperties: [String: Any], successBlock: @escaping (String?) -> Void, errorBlock: @escaping (String?)->Void) {
        module.signUp(email, password: password, customProperties: customProperties, successBlock: { (authenModel) in
            successBlock(authenModel?.toString())
        }) { (error) in
            errorBlock(error?.toString())
        }
    }
    
    @objc func signInWithFacebookAccount(_ facebookAuthToken: String, successBlock:  @escaping (String?) -> Void, errorBlock: @escaping (String?)->Void) {
        module.loginWithFacebookAccount(facebookAuthToken, successBlock: { (authenModel) in
            successBlock(authenModel?.toString())
        }) { (error) in
            errorBlock(error?.toString())
        }
    }
    
    @objc func signInWithEmail(_ email: String, password: String, successBlock: @escaping (String?) -> Void, errorBlock: @escaping (String?)->Void) {
        module.loginWithEmailPassword(email, password: password, successBlock: { (authenModel) in
            successBlock(authenModel?.toString())
        }) { (error) in
            errorBlock(error?.toString())
        }
    }
    
    @objc func signInWithGooglePlusAccount(_ googleToken: String, successBlock: @escaping (String?) -> Void, errorBlock: @escaping (String?)->Void) {
        module.loginWithGooglePlusAccount(googleToken, successBlock: { (authenModel) in
            successBlock(authenModel?.toString())
        }) { (error) in
            errorBlock(error?.toString())
        }
    }
    
    @objc func isLoggedIn() -> String {
      return asJSONString(["is_sign_in": NSNumber(value: module.accountManager.isLoggedIn())]) ?? ""
    }
    
    @objc func profileInfo() -> [String: Any] {
        let profile = module.loginProfiles.first
        let avatars: [String] = profile?.avatar?.map{$0.urlString ?? ""} ?? []
        let info = [
            "id": profile?.id ?? "" as Any,
            "authToken": module.authToken,
            "avatars": avatars as Any,
            "name": profile?.name ?? "" as Any,
            "email": profile?.customProperties?["_account_email"] ?? "" as Any,
            "age": profile?.customProperties?["age"] ?? "" as Any,
            "gender": profile?.customProperties?["gender"] ?? "" as Any,
            "firstName": profile?.customProperties?["firstName"] ?? "" as Any,
            "lastName": profile?.customProperties?["lastName"] ?? "" as Any,
        ]
        return info
    }
}
