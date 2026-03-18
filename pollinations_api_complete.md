# 🌸 Pollinations API — Dليل كامل مع الكود

> **Base URL:** `https://gen.pollinations.ai`  
> **API Key:** احصل عليه من [enter.pollinations.ai](https://enter.pollinations.ai)

---

## 📋 فهرس الإمكانيات

| | النوع | الـ Endpoint | الـ Output |
|---|---|---|---|
| ✍️ | **Text (Chat)** | `POST /v1/chat/completions` | JSON |
| ✍️ | **Text (Simple)** | `GET /text/{prompt}` | Plain text |
| 🖼️ | **Image Generation** | `GET /image/{prompt}` | JPEG / PNG |
| 🎬 | **Video Generation** | `GET /video/{prompt}` | MP4 |
| 🔊 | **Text-to-Speech** | `GET /audio/{text}` | MP3 |
| 🎵 | **Music Generation** | `GET /audio/{text}?model=elevenmusic` | MP3 |
| 🎙️ | **Transcription (Speech-to-Text)** | `POST /v1/audio/transcriptions` | JSON |
| 🤖 | **List Models** | `GET /v1/models` | JSON |
| 📦 | **Media Upload/Storage** | `POST /upload` (media.pollinations.ai) | JSON |

---

## 🔐 Authentication (المفتاح)

كاين نوعين من المفاتيح:

| النوع | البادئة | الاستخدام | Rate Limit |
|-------|---------|-----------|------------|
| Secret | `sk_` | Backend (server-side) | بلا حدود |
| Publishable | `pk_` | Frontend (client-side) | 1 request/IP/hour |

> ⚠️ **تحذير:** ما تحطش `sk_` في كود frontend أبداً!

### طريقة الإرسال — اختر واحدة:

```bash
# الطريقة 1: Authorization Header (الأفضل)
curl -H "Authorization: Bearer YOUR_API_KEY" ...

# الطريقة 2: Query Parameter
curl "https://gen.pollinations.ai/text/hello?key=YOUR_API_KEY"
```

---

## ✍️ 1. توليد النص — Text Generation

### الطريقة السريعة (GET)
```bash
# cURL
curl "https://gen.pollinations.ai/text/Write%20a%20haiku?model=openai" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```python
# Python
import requests

response = requests.get(
    "https://gen.pollinations.ai/text/Write a haiku",
    params={
        "model": "openai",        # اختر الموديل
        "system": "You are a poet",# system prompt
        "temperature": 0.8,        # creativity (0-2)
        "seed": 42,                # للنتيجة الثابتة
        "json": False,             # True = يرجع JSON
        "stream": False,           # True = streaming
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)
print(response.text)
```

```javascript
// JavaScript
const response = await fetch(
  "https://gen.pollinations.ai/text/Write%20a%20haiku?model=openai",
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(await response.text());
```

---

### الطريقة الكاملة — Chat Completions (OpenAI-Compatible)

هاذي تكون compatible مع أي OpenAI SDK — بدل `base_url` فقط!

```bash
# cURL
curl https://gen.pollinations.ai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant"},
      {"role": "user", "content": "Hello! How are you?"}
    ],
    "temperature": 1,
    "max_tokens": 500,
    "stream": false
  }'
```

```python
# Python — باستخدام OpenAI SDK
from openai import OpenAI

client = OpenAI(
    base_url="https://gen.pollinations.ai",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="openai",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello!"}
    ],
    temperature=1,
    max_tokens=500,
    stream=False,          # True للـ streaming
)
print(response.choices[0].message.content)
```

```python
# Python — Streaming
response = client.chat.completions.create(
    model="openai",
    messages=[{"role": "user", "content": "Tell me a long story"}],
    stream=True,
)
for chunk in response:
    print(chunk.choices[0].delta.content, end="")
```

```javascript
// JavaScript — OpenAI SDK
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://gen.pollinations.ai",
  apiKey: "YOUR_API_KEY",
});

const response = await client.chat.completions.create({
  model: "openai",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(response.choices[0].message.content);
```

### Vision — إرسال صورة مع النص

```python
response = client.chat.completions.create(
    model="gemini",   # أو openai-large
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "What's in this image?"},
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://example.com/image.jpg",
                    "detail": "high"   # auto | low | high
                }
            }
        ]
    }]
)
```

### Function Calling / Tools

```python
response = client.chat.completions.create(
    model="openai",
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"}
                },
                "required": ["city"]
            }
        }
    }],
    tool_choice="auto"
)
```

### Structured Output (JSON Schema)

```python
response = client.chat.completions.create(
    model="openai",
    messages=[{"role": "user", "content": "Extract: 'John is 30 years old'"}],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "person",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer"}
                }
            }
        }
    }
)
```

### موديلات النص المتاحة

| الموديل | الخصائص |
|---------|---------|
| `openai` | GPT-4o — default |
| `openai-fast` | GPT-4o-mini — سريع |
| `openai-large` | GPT-4.1 — كبير + vision |
| `claude` | Claude Sonnet |
| `claude-fast` | Claude Haiku |
| `claude-large` | Claude Opus |
| `gemini` | Gemini 2.0 |
| `gemini-fast` | Gemini Flash |
| `gemini-large` | Gemini 2.5 Pro |
| `gemini-search` | Gemini + Google Search |
| `deepseek` | DeepSeek R1 |
| `grok` | Grok من X/xAI |
| `mistral` | Mistral |
| `qwen-coder` | Qwen2.5-Coder |
| `perplexity-fast` | Perplexity (web search) |
| `perplexity-reasoning` | Perplexity + reasoning |

---

## 🖼️ 2. توليد الصور — Image Generation

### الطريقة الأبسط — URL مباشر في المتصفح

```
https://gen.pollinations.ai/image/a cat in space?model=flux
```

```html
<!-- HTML: ما تحتاجش كود! -->
<img src="https://gen.pollinations.ai/image/a%20beautiful%20sunset?model=flux" />
```

```bash
# cURL — حفظ كـ image
curl "https://gen.pollinations.ai/image/a%20cat%20in%20space?model=flux" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o image.jpg
```

```python
# Python
import requests

response = requests.get(
    "https://gen.pollinations.ai/image/a cat in space",
    params={
        "model": "flux",              # الموديل
        "width": 1024,                # العرض
        "height": 1024,               # الارتفاع
        "seed": 42,                   # للنتيجة الثابتة (-1 = عشوائي)
        "enhance": True,              # AI يحسن الـ prompt
        "negative_prompt": "blurry",  # ما تريدش في الصورة
        "safe": False,                # فتر السلامة
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)
with open("image.jpg", "wb") as f:
    f.write(response.content)
```

```javascript
// JavaScript
const response = await fetch(
  "https://gen.pollinations.ai/image/a%20cat%20in%20space?model=flux&width=1024&height=1024",
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
const blob = await response.blob();
// استخدام في المتصفح:
const url = URL.createObjectURL(blob);
document.getElementById("my-img").src = url;
```

### Image Editing — تعديل صورة موجودة

```bash
# إرسال صورة مرجعية للتعديل
curl "https://gen.pollinations.ai/image/change%20the%20background%20to%20beach?model=kontext&image=https://example.com/photo.jpg" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o edited.jpg
```

```python
response = requests.get(
    "https://gen.pollinations.ai/image/make it look like anime",
    params={
        "model": "kontext",   # أو: gptimage, seedream, klein, nanobanana
        "image": "https://example.com/your-photo.jpg",  # صورة المصدر
        "width": 1024,
        "height": 1024,
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)
```

### GPT Image — جودة عالية + خلفية شفافة

```python
response = requests.get(
    "https://gen.pollinations.ai/image/a logo for a tech startup",
    params={
        "model": "gptimage",          # أو gptimage-large
        "quality": "hd",              # low | medium | high | hd
        "transparent": True,          # خلفية شفافة (PNG)
        "width": 1024,
        "height": 1024,
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)
```

### موديلات الصور المتاحة

| الموديل | الخصائص |
|---------|---------|
| `flux` | FLUX.1 — جودة عالية |
| `zimage` | **Default** |
| `gptimage` | GPT-4o Image, جودة عالية |
| `gptimage-large` | GPT + transparent support |
| `kontext` | Image editing متقدム |
| `seedream5` | Seedream v5 |
| `seedream-pro` | Seedream Pro |
| `nanobanana` | سريع |
| `nanobanana-pro` | سريع + جودة |
| `klein` | Klein model |
| `klein-large` | Klein كبير |
| `imagen-4` | Google Imagen 4 |
| `flux-2-dev` | FLUX.2 |
| `grok-imagine` | Grok Image Generation |

---

## 🎬 3. توليد الفيديو — Video Generation

```bash
# cURL
curl "https://gen.pollinations.ai/video/a%20sunset%20timelapse%20over%20the%20ocean?model=veo&duration=4" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o video.mp4
```

```python
# Python
import requests

response = requests.get(
    "https://gen.pollinations.ai/video/a sunset timelapse over the ocean",
    params={
        "model": "veo",           # الموديل
        "duration": 4,            # المدة بالثواني
        "aspectRatio": "16:9",    # 16:9 أو 9:16
        "audio": True,            # أضف موسيقى (veo فقط يحتاج True)
        "width": 1920,
        "height": 1080,
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    timeout=120,  # الفيديو يأخذ وقت!
)
with open("video.mp4", "wb") as f:
    f.write(response.content)
```

```javascript
// JavaScript
const response = await fetch(
  "https://gen.pollinations.ai/video/a%20sunset%20timelapse?model=veo&duration=4&audio=true",
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
const blob = await response.blob();
```

### فيديو من صورة (Image-to-Video)

```python
# veo يدعم start frame + end frame
response = requests.get(
    "https://gen.pollinations.ai/video/smooth transition",
    params={
        "model": "veo",
        # صورتان للـ start و end frame (مفصولتان بـ |)
        "image": "https://start-frame.jpg|https://end-frame.jpg",
        "duration": 6,
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)
```

### موديلات الفيديو

| الموديل | المدة | ملاحظات |
|---------|-------|---------|
| `veo` | 4، 6، أو 8 ثواني | يدعم start/end frames |
| `seedance` | 2-10 ثواني | — |
| `seedance-pro` | 2-10 ثواني | جودة أعلى |
| `wan` | 2-15 ثواني | audio تلقائي |
| `ltx-2` | ~10 ثواني | audio تلقائي |
| `grok-video` | — | من xAI |

> ✨ يمكنك أيضاً توليد فيديو عبر `GET /image/{prompt}?model=veo` (نفس الـ endpoint كالصور)

---

## 🔊 4. توليد الصوت — Audio (TTS + Music)

### Text-to-Speech بسيط (GET)

```bash
# cURL — نص إلى كلام
curl "https://gen.pollinations.ai/audio/Hello%20world?voice=nova" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o speech.mp3

# مع تنسيق مختلف
curl "https://gen.pollinations.ai/audio/Hello?voice=rachel&response_format=wav" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o speech.wav
```

```python
# Python
import requests

response = requests.get(
    "https://gen.pollinations.ai/audio/Hello, welcome to Pollinations!",
    params={
        "voice": "nova",            # اختر الصوت
        "response_format": "mp3",   # mp3 | opus | aac | flac | wav | pcm
        "model": "tts-1",           # TTS model
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)
with open("speech.mp3", "wb") as f:
    f.write(response.content)
```

```javascript
// JavaScript — تشغيل في المتصفح
const response = await fetch(
  "https://gen.pollinations.ai/audio/Hello%20world?voice=nova",
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
const blob = await response.blob();
const audio = new Audio(URL.createObjectURL(blob));
audio.play();
```

### TTS بـ OpenAI SDK

```python
# Python — OpenAI SDK
from openai import OpenAI

client = OpenAI(
    base_url="https://gen.pollinations.ai",
    api_key="YOUR_API_KEY",
)

response = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input="Hello, this is a test of text to speech!",
    response_format="mp3",   # mp3 | opus | aac | flac | wav | pcm
    speed=1.0,               # 0.25 to 4.0
)
response.stream_to_file("speech.mp3")
```

```javascript
// JavaScript — OpenAI SDK
import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  baseURL: "https://gen.pollinations.ai",
  apiKey: "YOUR_API_KEY",
});

const response = await client.audio.speech.create({
  model: "tts-1",
  voice: "nova",
  input: "Hello, this is a test!",
  response_format: "mp3",
  speed: 1.0,
});
const buffer = Buffer.from(await response.arrayBuffer());
fs.writeFileSync("speech.mp3", buffer);
```

### 🎵 توليد موسيقى — Music Generation

```bash
# cURL
curl "https://gen.pollinations.ai/audio/upbeat%20jazz%20with%20piano?model=elevenmusic&duration=30" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o music.mp3
```

```python
# Python
response = requests.get(
    "https://gen.pollinations.ai/audio/calm ambient electronic music",
    params={
        "model": "elevenmusic",     # مهم! للموسيقى
        "duration": 60,             # المدة بالثواني (3-300)
        "instrumental": True,       # True = بلا كلام
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)
with open("music.mp3", "wb") as f:
    f.write(response.content)
```

### قائمة الأصوات المتاحة (Voices)

```
# أصوات OpenAI:
alloy, echo, fable, onyx, shimmer, nova, ash, ballad, coral, sage, verse

# أصوات ElevenLabs:
rachel, domi, bella, elli, charlotte, dorothy, sarah, emily, lily, matilda,
adam, antoni, arnold, josh, sam, daniel, charlie, james, fin, callum,
liam, george, brian, bill

# يمكنك أيضاً استخدام ElevenLabs Voice ID مباشرة (UUID)
```

---

## 🎙️ 5. Transcription — صوت إلى نص (Speech-to-Text)

```bash
# cURL
curl https://gen.pollinations.ai/v1/audio/transcriptions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F file=@audio.mp3 \
  -F model=whisper-large-v3 \
  -F language=ar \
  -F response_format=json
```

```python
# Python — OpenAI SDK
from openai import OpenAI

client = OpenAI(
    base_url="https://gen.pollinations.ai",
    api_key="YOUR_API_KEY",
)

with open("audio.mp3", "rb") as f:
    transcript = client.audio.transcriptions.create(
        model="whisper-large-v3",  # أو: whisper-1, scribe
        file=f,
        language="ar",             # ar للعربية، en للإنجليزية
        response_format="json",    # json | text | srt | vtt | verbose_json
        temperature=0,             # 0 = أكثر دقة
    )
print(transcript.text)
```

```javascript
// JavaScript
import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  baseURL: "https://gen.pollinations.ai",
  apiKey: "YOUR_API_KEY",
});

const transcript = await client.audio.transcriptions.create({
  model: "whisper-large-v3",
  file: fs.createReadStream("audio.mp3"),
  language: "ar",
  response_format: "json",
});
console.log(transcript.text);
```

### موديلات الـ Transcription

| الموديل | الخصائص |
|---------|---------|
| `whisper-large-v3` | **Default** — دقيق |
| `whisper-1` | نفس whisper-large-v3 |
| `scribe` | ElevenLabs — 90+ لغة + timestamps |

### الصيغ الصوتية المدعومة للإدخال:
`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`

---

## 🤖 6. قائمة الموديلات — Model Discovery

```bash
# قائمة موديلات النص (OpenAI format)
curl https://gen.pollinations.ai/v1/models

# قائمة موديلات النص (تفاصيل كاملة)
curl https://gen.pollinations.ai/text/models

# قائمة موديلات الصور والفيديو
curl https://gen.pollinations.ai/image/models

# قائمة موديلات الصوت
curl https://gen.pollinations.ai/audio/models
```

```python
# Python
import requests

# موديلات النص
models = requests.get("https://gen.pollinations.ai/text/models").json()
for m in models:
    print(f"{m['id']}: {m.get('description', '')}")

# موديلات الصور
img_models = requests.get("https://gen.pollinations.ai/image/models").json()
```

```javascript
// JavaScript — باستخدام OpenAI SDK
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://gen.pollinations.ai",
  apiKey: "YOUR_API_KEY",
});

const models = await client.models.list();
models.data.forEach((m) => console.log(m.id));
```

---

## 📦 7. رفع الوسائط — Media Storage

```bash
# رفع صورة
curl -X POST https://media.pollinations.ai/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@image.jpg"

# الرد:
# { "id": "abc123", "url": "https://media.pollinations.ai/abc123", ... }

# استرجاع الملف
curl https://media.pollinations.ai/abc123 -o downloaded.jpg
```

```python
# Python
import requests

# رفع ملف
with open("image.jpg", "rb") as f:
    response = requests.post(
        "https://media.pollinations.ai/upload",
        files={"file": f},
        headers={"Authorization": "Bearer YOUR_API_KEY"},
    )
result = response.json()
print(result["url"])  # الرابط الدائم للملف

# استرجاع الملف
file_content = requests.get(result["url"]).content
with open("downloaded.jpg", "wb") as f:
    f.write(file_content)
```

**حدود الرفع:** 10MB كحد أقصى  
**الملفات المكررة:** يرجع نفس الـ hash (لا يحتسب مرتين)

---

## 👤 8. Account & Balance API

```bash
# الملف الشخصي
curl https://gen.pollinations.ai/account/profile \
  -H "Authorization: Bearer YOUR_API_KEY"

# الرصيد (pollen)
curl https://gen.pollinations.ai/account/balance \
  -H "Authorization: Bearer YOUR_API_KEY"

# تاريخ الاستخدام
curl "https://gen.pollinations.ai/account/usage?limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"

# الاستخدام اليومي (للـ dashboard)
curl "https://gen.pollinations.ai/account/usage/daily" \
  -H "Authorization: Bearer YOUR_API_KEY"

# معلومات المفتاح
curl https://gen.pollinations.ai/account/key \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```python
# Python
import requests

headers = {"Authorization": "Bearer YOUR_API_KEY"}

# الرصيد
balance = requests.get("https://gen.pollinations.ai/account/balance", headers=headers).json()
print(f"Pollen balance: {balance['balance']}")

# الاستخدام
usage = requests.get(
    "https://gen.pollinations.ai/account/usage",
    params={"limit": 50, "format": "json"},
    headers=headers
).json()
for record in usage["usage"]:
    print(f"{record['model']}: ${record['cost_usd']}")

# تصدير CSV
csv_data = requests.get(
    "https://gen.pollinations.ai/account/usage",
    params={"format": "csv", "limit": 1000},
    headers=headers
).text
```

---

## 🌸 9. BYOP — Bring Your Own Pollen (للمطورين)

هاذي ميزة مهمة: مستخدميك يدفعوا هما بدلك!

```javascript
// 1. أرسل المستخدم للتفويض
const params = new URLSearchParams({
  redirect_url: window.location.href,
  app_key: "pk_yourkey",    // مفتاحك الـ publishable
  models: "flux,openai",    // حصر على موديلات محددة (اختياري)
  budget: "10",             // حد أقصى للإنفاق (اختياري)
  expiry: "7",              // مدة المفتاح بالأيام (default: 30)
});
window.location.href = `https://enter.pollinations.ai/authorize?${params}`;

// 2. بعد الرجوع، اجلب المفتاح من الـ URL
const apiKey = new URLSearchParams(location.hash.slice(1)).get("api_key");

// 3. استخدمه للـ requests
const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "openai",
    messages: [{ role: "user", content: "Hello!" }]
  })
});
```

---

## ❌ رموز الأخطاء

```json
{
  "status": 400,
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Description of what went wrong"
  }
}
```

| Status | المعنى |
|--------|--------|
| `400` | بيانات خاطئة |
| `401` | مفتاح غير صحيح أو مفقود |
| `402` | رصيد pollen غير كافٍ |
| `403` | ليس لديك صلاحية لهذا الموديل |
| `429` | طلبات سريعة جداً — أبطئ |
| `500` | خطأ في الخادم |

---

## 🚀 مثال كامل — Full App Example (Python)

```python
import requests
import os

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://gen.pollinations.ai"
HEADERS = {"Authorization": f"Bearer {API_KEY}"}

def generate_text(prompt, model="openai"):
    """توليد نص"""
    r = requests.get(f"{BASE_URL}/text/{prompt}", 
                     params={"model": model}, headers=HEADERS)
    return r.text

def generate_image(prompt, model="flux", width=1024, height=1024):
    """توليد صورة وحفظها"""
    r = requests.get(f"{BASE_URL}/image/{prompt}",
                     params={"model": model, "width": width, "height": height},
                     headers=HEADERS)
    with open("output.jpg", "wb") as f:
        f.write(r.content)
    return "output.jpg"

def generate_video(prompt, model="veo", duration=4):
    """توليد فيديو"""
    r = requests.get(f"{BASE_URL}/video/{prompt}",
                     params={"model": model, "duration": duration, "audio": True},
                     headers=HEADERS, timeout=180)
    with open("output.mp4", "wb") as f:
        f.write(r.content)
    return "output.mp4"

def text_to_speech(text, voice="nova"):
    """تحويل نص إلى كلام"""
    r = requests.get(f"{BASE_URL}/audio/{text}",
                     params={"voice": voice}, headers=HEADERS)
    with open("speech.mp3", "wb") as f:
        f.write(r.content)
    return "speech.mp3"

def generate_music(description, duration=30):
    """توليد موسيقى"""
    r = requests.get(f"{BASE_URL}/audio/{description}",
                     params={"model": "elevenmusic", "duration": duration, "instrumental": True},
                     headers=HEADERS)
    with open("music.mp3", "wb") as f:
        f.write(r.content)
    return "music.mp3"

def transcribe_audio(audio_file_path, language="ar"):
    """تحويل صوت إلى نص"""
    with open(audio_file_path, "rb") as f:
        r = requests.post(
            f"{BASE_URL}/v1/audio/transcriptions",
            files={"file": f},
            data={"model": "whisper-large-v3", "language": language},
            headers=HEADERS
        )
    return r.json()["text"]

def get_balance():
    """عرض الرصيد"""
    r = requests.get(f"{BASE_URL}/account/balance", headers=HEADERS)
    return r.json()["balance"]

# =================== استخدم الكود ===================

# 1. توليد نص
print("📝 توليد نص...")
text = generate_text("اكتب قصيدة عن الشمس", model="openai")
print(text)

# 2. توليد صورة
print("\n🖼️ توليد صورة...")
img = generate_image("a beautiful sunset over mountains, photorealistic", model="flux")
print(f"الصورة محفوظة: {img}")

# 3. توليد فيديو
print("\n🎬 توليد فيديو...")
vid = generate_video("a cat playing in a garden", model="seedance", duration=5)
print(f"الفيديو محفوظ: {vid}")

# 4. نص إلى كلام
print("\n🔊 تحويل نص إلى كلام...")
audio = text_to_speech("Hello from Pollinations API!", voice="nova")
print(f"الصوت محفوظ: {audio}")

# 5. توليد موسيقى
print("\n🎵 توليد موسيقى...")
music = generate_music("relaxing lofi hip hop beats", duration=60)
print(f"الموسيقى محفوظة: {music}")

# 6. الرصيد
print(f"\n💰 رصيدك الحالي: {get_balance()} pollen")
```

---

## 🚀 مثال كامل — JavaScript (Frontend)

```javascript
const API_KEY = "YOUR_API_KEY";
const BASE = "https://gen.pollinations.ai";

// دالة مساعدة للـ requests
async function pollinationsRequest(endpoint, params = {}) {
  const url = new URL(BASE + endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
}

// 1. توليد نص
async function generateText(prompt, model = "openai") {
  const res = await pollinationsRequest(`/text/${encodeURIComponent(prompt)}`, { model });
  return res.text();
}

// 2. URL صورة مباشر (يمكن وضعها في <img> مباشرة)
function imageUrl(prompt, model = "flux", width = 1024, height = 1024) {
  return `${BASE}/image/${encodeURIComponent(prompt)}?model=${model}&width=${width}&height=${height}&key=${API_KEY}`;
}

// 3. توليد صورة كـ Blob
async function generateImage(prompt, model = "flux") {
  const res = await pollinationsRequest(`/image/${encodeURIComponent(prompt)}`, { model });
  return URL.createObjectURL(await res.blob());
}

// 4. توليد فيديو كـ Blob
async function generateVideo(prompt, model = "veo", duration = 4) {
  const res = await pollinationsRequest(
    `/video/${encodeURIComponent(prompt)}`,
    { model, duration, audio: true }
  );
  return URL.createObjectURL(await res.blob());
}

// 5. Text to Speech
async function textToSpeech(text, voice = "nova") {
  const res = await pollinationsRequest(`/audio/${encodeURIComponent(text)}`, { voice });
  const blob = await res.blob();
  const audio = new Audio(URL.createObjectURL(blob));
  audio.play();
}

// 6. Chat Completions
async function chat(messages, model = "openai") {
  const res = await fetch(`${BASE}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

// ============ استخدام =============

// نص
const text = await generateText("Write a haiku about coding");
console.log(text);

// صورة في <img> مباشرة (الأبسط!)
document.getElementById("img").src = imageUrl("a cat in space");

// Chat
const reply = await chat([
  { role: "system", content: "You are a helpful Moroccan assistant" },
  { role: "user", content: "كيف داير؟" }
]);
console.log(reply);

// صوت
await textToSpeech("Bonjour from Pollinations!");
```

---

## 📋 ملخص سريع — Quick Reference

```
Base URL: https://gen.pollinations.ai
Auth: Authorization: Bearer YOUR_KEY  (أو ?key=YOUR_KEY)

TEXT:
  GET  /text/{prompt}?model=openai&system=...&temperature=1
  POST /v1/chat/completions  (OpenAI compatible)

IMAGE:
  GET  /image/{prompt}?model=flux&width=1024&height=1024&seed=42&enhance=true
  GET  /image/{prompt}?model=kontext&image=URL  (editing)

VIDEO:
  GET  /video/{prompt}?model=veo&duration=4&aspectRatio=16:9&audio=true

AUDIO (TTS):
  GET  /audio/{text}?voice=nova&response_format=mp3
  POST /v1/audio/speech  (OpenAI compatible)

MUSIC:
  GET  /audio/{description}?model=elevenmusic&duration=30&instrumental=true

TRANSCRIPTION:
  POST /v1/audio/transcriptions  (multipart/form-data: file, model, language)

MODELS:
  GET  /v1/models        (text — OpenAI format)
  GET  /text/models      (text — detailed)
  GET  /image/models     (images + video)
  GET  /audio/models     (audio)

ACCOUNT:
  GET  /account/balance
  GET  /account/profile
  GET  /account/usage
  GET  /account/key

MEDIA STORAGE (media.pollinations.ai):
  POST /upload
  GET  /{hash}
  DELETE /{hash}
```
