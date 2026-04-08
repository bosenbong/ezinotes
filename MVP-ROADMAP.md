# EziNotes MVP Roadmap

## Premise
AI-powered voice-to-notes app for Australian support workers (NDIS). Privacy-first, simple, compliant.

## Core Features
1. **Record voice notes** — in-browser recording
2. **Upload securely** — to Australian-hosted backend
3. **Transcribe** — server-side AI transcription
4. **Format** — convert to NDIS-compliant support note
5. **Export** — copy to clipboard or PDF export

## Constraints
- No unnecessary data storage
- No complex architecture
- Mobile-first design
- Fast MVP launch

---

## MVP Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | React + Vite | Fast dev, mobile-first, simple |
| **Hosting** | Vercel (free) | Fast, easy, CDN |
| **Backend** | Single API route | Keep it simple |
| **AI/Transcription** | OpenAI Whisper (via OpenRouter) | Accurate, cheap |
| **Storage** | None (audio deleted after processing) | Privacy-first |
| **Australian Hosting** | Future: AWS Sydney | For now, use overseas for MVP |

---

## MVP Architecture (Simple)

```
[User Mobile] → [React App (Vercel)] → [API Route] → [Whisper API] → [NDIS Formatter] → [User]
```

**Flow:**
1. User records voice in browser
2. Audio sent to API
3. API transcribes via Whisper
4. Transcript formatted into NDIS note
5. Note returned, user copies/exports
6. Audio deleted from server immediately

---

## Build Steps

### Step 1: Frontend (Day 1)
- [x] Already have React app with voice recording
- [ ] Add file upload button (for pre-recorded audio)
- [ ] Mobile-friendly UI polish

### Step 2: Backend API (Day 2)
- [ ] Set up Vercel API route
- [ ] Add Whisper transcription
- [ ] Add NDIS formatter

### Step 3: Privacy & Security (Day 3)
- [ ] No audio storage (process & delete)
- [ ] Basic rate limiting
- [ ] Privacy disclaimer

### Step 4: Testing (Day 4)
- [ ] Test with real voice notes
- [ ] Verify NDIS compliance format

### Step 5: Launch (Day 5-7)
- [ ] Deploy to Vercel
- [ ] Share with 2-3 users for feedback
- [ ] Iterate based on feedback

---

## Budget
- Under $200 (mostly API costs)
- OpenRouter: ~$0.002/minute for transcription

---

## What We're Building Now

**Current status:** Frontend exists with basic voice recording

**Next task:** Add file upload capability to the app

**Questions for you:**
1. Do you want me to build the backend now, or test the frontend first?
2. Should we add the file upload feature next?