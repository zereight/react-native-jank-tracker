import Foundation
import React
import QuartzCore

@objc(JankMonitor)
class JankMonitor: RCTEventEmitter {
    private var displayLink: CADisplayLink?
    private var lastTimestamp: CFTimeInterval = 0
    private var isMonitoring = false

    @objc
    func startJankMonitoring() {
        if isMonitoring { return }
        isMonitoring = true
        lastTimestamp = 0
        DispatchQueue.main.async {
            self.displayLink = CADisplayLink(target: self, selector: #selector(self.frameUpdate))
            self.displayLink?.add(to: .main, forMode: .common)
        }
    }

    @objc
    func stopJankMonitoring() {
        isMonitoring = false
        DispatchQueue.main.async {
            self.displayLink?.invalidate()
            self.displayLink = nil
        }
    }

    @objc
    func frameUpdate(link: CADisplayLink) {
        if !isMonitoring { return }
        if lastTimestamp != 0 {
            let diff = (link.timestamp - lastTimestamp) * 1000
            if diff > 16.67 {
                sendJankEvent(duration: diff)
            }
        }
        lastTimestamp = link.timestamp
    }

    private func sendJankEvent(duration: Double) {
        sendEvent(withName: "NativeJankDetected", body: [
            "source": "native",
            "platform": "ios",
            "duration": duration,
            "timestamp": Date().timeIntervalSince1970 * 1000
        ])
    }

    @objc
    func simulateNativeJank(_ durationMs: NSNumber) {
        DispatchQueue.main.async {
            let startTime = CACurrentMediaTime()
            while CACurrentMediaTime() - startTime < durationMs.doubleValue / 1000.0 {
                // 메인 스레드 블로킹
            }
        }
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    override func supportedEvents() -> [String]! {
        return ["NativeJankDetected"]
    }
} 