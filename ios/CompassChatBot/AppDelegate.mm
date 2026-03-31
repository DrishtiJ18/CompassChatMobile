#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"

static void ClearKeychainIfNecessary() {
    // Check whether this is the first time the app is run
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    BOOL hasRunBefore = [userDefaults boolForKey:@"HAS_RUN_BEFORE"];
    
    if (!hasRunBefore) {
        // Set the value to indicate that the app has run before
        [userDefaults setBool:YES forKey:@"HAS_RUN_BEFORE"];
        [userDefaults synchronize]; // Ensure the change is saved immediately
        
        NSArray *secItemClasses = @[
            (__bridge id)kSecClassGenericPassword,
            (__bridge id)kSecClassInternetPassword,
            (__bridge id)kSecClassCertificate,
            (__bridge id)kSecClassKey,
            (__bridge id)kSecClassIdentity
        ];
        
        // Iterate through all Keychain item classes and delete all matching items
        for (id secItemClass in secItemClasses) {
            NSDictionary *query = @{(__bridge id)kSecClass: secItemClass};
            SecItemDelete((__bridge CFDictionaryRef)query);
        }
    }
}

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
     return YES;
   }
    // Your additional URL handling (if any)
    return [RCTLinkingManager application:application openURL:url options:options];
 }

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   // Clear Keychain items if necessary
  ClearKeychainIfNecessary();
  self.moduleName = @"CompassChatBot";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  BOOL ret = [super application:application didFinishLaunchingWithOptions:launchOptions];
  if (ret == YES)
  { 
    [RNSplashScreen show];
  }
  return ret;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
