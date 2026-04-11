# EziNotes - Voice-to-NDIS Notes Logic

## 1. Voice Input
User records a casual voice note after a support session.
Input is typically unstructured, informal, and may include filler words, slang, and out-of-order thoughts.

## 2. Transcription
Audio is converted to text (via browser speech or API).
Output is a raw transcript — still messy, with repetition and filler words.

## 3. Cleaning & Normalisation
The system refines the transcript by:
- Removing filler words and repetition
- Correcting grammar and sentence structure
- Converting informal language into professional wording
- Standardising to past tense
- Clarifying vague phrasing where possible

## 4. Information Extraction
The AI identifies key details and separates them into structured components:
- Activities completed
- Support provided
- Participant presentation (mood, behaviour, engagement)
- Outcomes / progress
- Incidents or risks (if any)
- Follow-up actions

## 5. NDIS-Compliant Structuring
The content is rewritten into a clear, professional support note aligned with NDIS expectations:
- Objective and factual (no assumptions or opinions)
- Written in third person
- Concise and easy to read
- Links support provided to participant outcomes

## 6. Output Format
```
Date: [Auto/User Input]
Service Type: [e.g. Social & Domestic Support]

Session Summary:
Brief overview of what occurred during the session.

Support Provided:
Specific actions completed by the support worker.

Participant Response:
Observed behaviour, mood, and engagement.

Outcome:
What was achieved during the session.

Notes / Follow-Up:
Any risks, incidents, or future considerations.
```

## 7. Export
Final note can be copied, downloaded (PDF), or used directly in platforms like Mable.

---

## Key Principles
- Fast (reduces admin time significantly)
- Compliant (NDIS-aligned structure)
- Clear and professional
- Consistent formatting
- Privacy-conscious (configurable storage)