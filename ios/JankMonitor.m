#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(JankMonitor, RCTEventEmitter)

RCT_EXTERN_METHOD(startJankMonitoring)
RCT_EXTERN_METHOD(stopJankMonitoring)
RCT_EXTERN_METHOD(simulateNativeJank:(nonnull NSNumber *)durationMs)

@end 