# Android APK Standalone Build Guide — Embedded Local AI

This document details the exact architecture and build process to package **Corporate Life AI** as an Android APK (`.apk` / `.aab`) with **in-process embedded llama.cpp** and the **LFM2.5-2.6B-Q4_K_M.gguf model**.

---

## 1. Architectural Blueprint

```
CorporateLifeAI.apk
 ├── Webview UI Layer (React 19 Vite bundle loaded via Capacitor / Webview)
 ├── Android JNI Bridge (AndroidLlamaBridge.kt)
 ├── Native Shared Library: libllama.so (arm64-v8a compiled with NDK & NEON)
 └── Bundled Asset: assets/models/LFM2.5-2.6B-Q4_K_M.gguf
```

### Key Standalone Principles
- **No Background HTTP Server**: In-process JNI call via `window.AndroidLlamaBridge.generateReply(jsonString)`.
- **Zero Internet Connection Required**: The game works completely offline in airplane mode.
- **Hardware Acceleration**: Uses ARM NEON SIMD instructions and Qualcomm/Mali OpenCL/Vulkan compute.
- **Memory Footprint**: LFM2.5 Q4_K_M requires ~1.85 GB RAM, running comfortably on Android devices with 6 GB+ RAM.

---

## 2. JNI Bridge Specification (`AndroidLlamaBridge.kt`)

```kotlin
package com.corporatelife.ai

import android.content.Context
import android.webkit.JavascriptInterface
import org.json.JSONObject

class AndroidLlamaBridge(private val context: Context) {

    init {
        System.loadLibrary("llama")
        initModel("models/LFM2.5-2.6B-Q4_K_M.gguf")
    }

    private external fun initModel(assetPath: String): Boolean
    private external fun nativeInfer(prompt: String, maxTokens: Int, temperature: Float): String

    @JavascriptInterface
    fun generateReply(payloadJson: String): String {
        val json = JSONObject(payloadJson)
        val system = json.optString("systemInstruction")
        val prompt = json.optString("prompt")
        val maxTokens = json.optInt("maxTokens", 300)
        val temp = json.optDouble("temperature", 0.7).toFloat()

        val fullPrompt = "<|im_start|>system\n$system<|im_end|>\n<|im_start|>user\n$prompt<|im_end|>\n<|im_start|>assistant\n"
        
        val replyText = nativeInfer(fullPrompt, maxTokens, temp)
        
        val response = JSONObject()
        response.put("content", replyText)
        response.put("model", "LFM2.5-2.6B-Q4_K_M.gguf")
        return response.toString()
    }
}
```

### Injecting Bridge into Android Webview (`MainActivity.kt`)

```kotlin
val webView = findViewById<WebView>(R.id.webview)
webView.settings.javaScriptEnabled = true
webView.addJavascriptInterface(AndroidLlamaBridge(this), "AndroidLlamaBridge")
webView.loadUrl("file:///android_asset/ui/index.html")
```

---

## 3. One-Click Packaging Command (Android)

```bash
# 1. Build the frontend web bundle
npm run build

# 2. Sync web assets to Capacitor Android project
npx cap sync android

# 3. Compile native arm64 APK with Gradle
cd android && ./gradlew assembleRelease
```

Output:
`android/app/build/outputs/apk/release/CorporateLifeAI-arm64-v8a-release.apk`
