# 🛡️ ScamShield — Real-Time Digital Fraud Detection Platform

ScamShield is an enterprise-grade, multimodal AI-powered fraud detection platform designed to protect Indian citizens from SMS phishing, fake banking/UPI OTP requests, deceptive QR payment tricks, malicious sideloaded APK packages, and voice deepfakes.

---

## 🌟 Key Features

1. **Multimodal Analysis Engine**:
   - **Text Messages**: SMS, WhatsApp chats, fake KYC notices, lottery draws, part-time job fraud.
   - **Website Links / URLs**: Typosquatting detection, deceptive domains, shortlink unwrapping.
   - **QR Code Images**: Server-side image decoding (via `sharp` & `jsqr`) to inspect underlying payloads.
   - **Voice Call Audio**: Server-side transcription using Gemini audio models before fraud analysis.
   - **APK Applications**: Package name and signature inspection for sideloaded remote-access RATs.
2. **Normalized Risk Verdict**:
   - **Scam Risk Score**: Normalized 0–100 score + risk tier (Safe / Suspicious / Dangerous / Confirmed Scam).
   - **Explainable Red Flags**: Transparent itemization of anomaly indicators.
   - **Recommended Safe Actions**: Actionable checklist (e.g. "Do not enter UPI PIN", "Block sender").
3. **8+ Regional Indian Languages**:
   - Explanations and safe recommendations generated natively in English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்), Telugu (తెలుగు), Malayalam (മലയാളം), Bengali (বাংলা), and Marathi (मराठी).
4. **Community Threat Database**:
   - Auto-correlation of phone numbers, domains, APK package names across submissions.
   - "N others reported this" alert elevation and threat scoring boosts.
5. **Public Scam Registry & Moderation**:
   - Searchable, paginated public feed of verified community reports (with zero PII).
   - Admin moderation queue for report approval and false-positive verification.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (custom trust-forward palette), React Router v6, Lucide Icons.
- **Backend**: Node.js, Express.js (ES Modules), Zod schema validation, Google Gemini AI (`@google/genai`), Multer memory storage, Sharp + JSQR.
- **Database**: Supabase PostgreSQL with full Row-Level Security (RLS) policies and trigram fuzzy matching.

---

## 🚀 Getting Started

### 1. Environment Variables Setup

Copy `.env.example` in both `server/` and `client/`:

```bash
# In server/
cp .env.example .env

# In client/
cp .env.example .env
```

#### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Security
CORS_ORIGIN=http://localhost:5173
IP_HASH_SALT=your-random-32-char-salt
```

#### Client (`client/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 2. Run Database Migration (Supabase)

Execute `server/db/schema.sql` in your Supabase SQL editor to create all enums, tables, indexes, triggers, and RLS policies.

---

### 3. Install & Run Locally

#### Server:
```bash
cd server
npm install
npm run dev
```
Backend API will be running at `http://localhost:5000`.

#### Client:
```bash
cd client
npm install
npm run dev
```
Client SPA will be running at `http://localhost:5173`.
