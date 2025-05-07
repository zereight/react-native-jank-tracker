package com.janktracker

import android.view.Choreographer
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class JankMonitorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val choreographer = Choreographer.getInstance()
    private var lastFrameTimeNanos: Long = 0
    private var isMonitoring = false

    private val frameCallback = object : Choreographer.FrameCallback {
        override fun doFrame(frameTimeNanos: Long) {
            if (!isMonitoring) return
            if (lastFrameTimeNanos != 0L) {
                val diffMs = (frameTimeNanos - lastFrameTimeNanos) / 1_000_000
                if (diffMs > 16) {
                    sendJankEvent(diffMs)
                }
            }
            lastFrameTimeNanos = frameTimeNanos
            choreographer.postFrameCallback(this)
        }
    }

    @ReactMethod
    fun startJankMonitoring() {
        if (!isMonitoring) {
            isMonitoring = true
            lastFrameTimeNanos = 0
            choreographer.postFrameCallback(frameCallback)
        }
    }

    @ReactMethod
    fun stopJankMonitoring() {
        isMonitoring = false
    }

    @ReactMethod
    fun simulateNativeJank(durationMs: Int) {
        val mainHandler = android.os.Handler(android.os.Looper.getMainLooper())
        mainHandler.post {
            val startTime = System.nanoTime()
            while ((System.nanoTime() - startTime) / 1_000_000 < durationMs) {
                // 메인 스레드 블로킹
            }
        }
    }

    private fun sendJankEvent(durationMs: Long) {
        val params = Arguments.createMap()
        params.putString("source", "native")
        params.putString("platform", "android")
        params.putDouble("duration", durationMs.toDouble())
        params.putDouble("timestamp", System.currentTimeMillis().toDouble())
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NativeJankDetected", params)
    }

    override fun getName() = "JankMonitor"
} 