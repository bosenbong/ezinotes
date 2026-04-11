# EziNotes - Development Log

## What is EziNotes?
AI-powered voice-to-notes app for Australian support workers (NDIS). Converts voice notes into professional, NDIS-compliant session notes.

## Problem Solved
Support workers spend unpaid time writing notes. EziNotes turns casual voice recordings into structured, professional NDIS notes in seconds.

## Target Users
- Independent support workers (sole traders) in Australia
- Disability support providers
- Users of platforms like Mable

## MVP Features (Current)
✅ Voice recording (browser speech recognition)  
✅ AI polishing (GPT-4 via OpenAI API)  
✅ Professional NDIS output format  
✅ Copy to clipboard  
✅ Save to file  
✅ Mobile-friendly  

## Tech Stack
- **Frontend:** Vanilla HTML/JS (simple, fast)
- **Backend:** Vercel Serverless Functions (API routes)
- **AI:** OpenAI GPT-4o (via API)
- **Hosting:** Vercel (free tier)
- **Repository:** https://github.com/bosenbong/ezinotes
- **Live URL:** https://ezinotes.vercel.app

## API Keys Needed
- **OPENAI_API_KEY** - Added to Vercel Environment Variables

## Output Format (NDIS Standard)
```
Client: [Name]
Date/Time: [times]
Service Type: Social & Domestic Support / Transport

Activities Undertaken:
- [bullet points]

Wellbeing/Outcome:
- [client status]

Departure:
- [time left, client status]
```

## User Flow
1. User taps mic → records voice note
2. Tap again to stop
3. Tap "✨ Polish Note (AI)" → AI transforms to professional NDIS format
4. Copy or Save the formatted note

## Pricing (MVP)
- Free to test
- OpenAI API costs ~$0.01-0.05 per note

## Future Enhancements (Roadmap)
- [ ] Better speech-to-text (WebSpeech API unreliable on mobile)
- [ ] Client name input field
- [ ] Auto-detect times from speech
- [ ] Date selection
- [ ] PDF export
- [ ] Multi-client support
- [ ] Australian hosting (AWS Sydney)
- [ ] Privacy-first (no audio storage)
- [ ] Custom GPT integration

## Known Issues
- Browser speech recognition doesn't work well on mobile Safari
- Speech-to-text may have errors (AI polishing fixes most)
- Times are hardcoded (need to extract from speech)

## Contact
- Jarrad (founder)
- GitHub: bosenbong/ezinotes
- Vercel: ezinotes project

## This Conversation
Date: 2026-04-11
Key wins:
- Got AI polishing working with OpenAI API
- Professional NDIS output format achieved
- Copy and Save buttons added
- Ready for MVP testing with real users

---
*Saved for ongoing refinement and development*