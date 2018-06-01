//
//  RNUserKitIdentity.m
//  hasBrain
//
//  Created by Chuong Huynh on 4/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNUserKitIdentity.h"
#import "hasBrain-Swift.h"

@implementation RNUserKitIdentity

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signOut) {
    [[UserKitIdentityModule sharedInstance] signOut];
}

RCT_EXPORT_METHOD(signUpWithEmail: (NSString *)email
                  password: (NSString *)password
                  customProperties: (NSDictionary *)customProperties
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signUpWithEmail:email
                                                   password:password
                                           customProperties:customProperties
                                               successBlock:^(NSString* authenModel) {
                                                   NSMutableArray *result = [[NSMutableArray alloc] init];
                                                   if (authenModel == nil) {
                                                       [result addObject:[NSNull null]];
                                                   } else {
                                                       [result addObject:authenModel];
                                                   }
                                                   callback(@[[NSNull null], result]);
                                               } errorBlock:^(NSString* error) {
                                                   NSMutableString *result = [[NSMutableString alloc] init];
                                                   if (error == nil) {
                                                       [result setString: @"{\"error_message\": \"Unknown error\"}"];
                                                   } else {
                                                       [result setString:error];
                                                   }
                                                   callback(@[result, [NSNull null]]);
                                               }];
}

RCT_EXPORT_METHOD(signInWithFacebookAccount:(NSString *)facebookAuthToken
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signInWithFacebookAccount:facebookAuthToken
                                                        successBlock:^(NSString* authenModel) {
                                                            NSMutableArray *result = [[NSMutableArray alloc] init];
                                                            if (authenModel == nil) {
                                                                [result addObject:[NSNull null]];
                                                            } else {
                                                                [result addObject:authenModel];
                                                            }
                                                            callback(@[[NSNull null], result]);
                                                        } errorBlock:^(NSString* error) {
                                                            NSMutableString *result = [[NSMutableString alloc] init];
                                                            if (error == nil) {
                                                                [result setString: @"{\"error_message\": \"Unknown error\"}"];
                                                            } else {
                                                                [result setString:error];
                                                            }
                                                        
                                                            callback(@[result, [NSNull null]]);
                                                        }];
}

RCT_EXPORT_METHOD(signInWithGooglePlusAccount: (NSString *)googlePlusToken callback: (RCTResponseSenderBlock) callback) {
    [[UserKitIdentityModule sharedInstance] signInWithGooglePlusAccount:googlePlusToken
                                                           successBlock:^(NSString * authenModel) {
                                                               NSMutableArray *result = [[NSMutableArray alloc] init];
                                                               if (authenModel == nil) {
                                                                   [result addObject:[NSNull null]];
                                                               } else {
                                                                   [result addObject:authenModel];
                                                               }
                                                               callback(@[[NSNull null], result]);
                                                           } errorBlock:^(NSString * error) {
                                                               NSMutableString *result = [[NSMutableString alloc] init];
                                                               if (error == nil) {
                                                                   [result setString: @"{\"error_message\": \"Unknown error\"}"];
                                                               } else {
                                                                   [result setString:error];
                                                               }
                                                               
                                                               callback(@[result, [NSNull null]]);
                                                           }];
}

RCT_EXPORT_METHOD(signInWithEmail: (NSString *)email
                  password: (NSString *)password
                  callback: (RCTResponseSenderBlock)callback) {
    
    [[UserKitIdentityModule sharedInstance] signInWithEmail:email
                                                   password:password
                                               successBlock:^(NSString* authenModel) {
                                                   NSMutableArray *result = [[NSMutableArray alloc] init];
                                                   if (authenModel == nil) {
                                                       [result addObject:[NSNull null]];
                                                   } else {
                                                       [result addObject:authenModel];
                                                   }
                                                   callback(@[[NSNull null], result]);
                                               } errorBlock:^(NSString* error) {
                                                   NSMutableString *result = [[NSMutableString alloc] init];
                                                   if (error == nil) {
                                                       [result setString: @"{\"error_message\": \"Unknown error\"}"];
                                                   } else {
                                                       [result setString:error];
                                                   }
                                                   callback(@[result, [NSNull null]]);
                                               }];
}

RCT_EXPORT_METHOD(checkSignIn: (RCTResponseSenderBlock)callback) {
    callback(@[[NSNull null], @[[[UserKitIdentityModule sharedInstance] isLoggedIn]]]);
}

RCT_EXPORT_METHOD(getProfileInfo: (RCTResponseSenderBlock)callback) {
    callback(@[[NSNull null], @[[[UserKitIdentityModule sharedInstance] profileInfo]]]);
}

@end
