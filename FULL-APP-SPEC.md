# EziNotes Full App - Technical Specification

## Overview
Full-featured NDIS note-taking app with compliance, security, and payments.

---

## 1. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 14 | Auth, Stripe, SSR - all built-in |
| Database | Supabase | Australian region (Sydney), built-in auth, row-level security |
| AI | OpenAI Whisper + GPT-4 | Proven, reliable |
| Payments | Stripe | Australian-friendly, handles subscriptions |
| Hosting | Vercel + Cloudflare | CDN, fast, free tier |

---

## 2. Database Schema (Supabase)

### Users Table
```sql
id (uuid, PK)
email
full_name
organisation
plan (free | solo | team)
created_at
updated_at
```

### Clients Table
```sql
id (uuid, PK)
user_id (uuid, FK)
name
ndis_number
notes (encrypted)
created_at
```

### Notes Table
```sql
id (uuid, PK)
user_id (uuid, FK)
client_id (uuid, FK)
transcript (text)
polished_note (text)
service_type
duration_minutes
created_at
```

### Subscriptions Table
```sql
id (uuid, PK)
user_id (uuid, FK)
stripe_subscription_id
status (active | past_due | canceled)
current_period_end
```

---

## 3. Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 5 notes/month, basic formatting, English only |
| Solo | $15/mo | Unlimited notes, AI polish, abbreviations |
| Solo+ | $19/mo | Everything in Solo + **multi-language input** (record in any language, get English NDIS notes) |
| Team | $29/mo | 3 users, client management, reporting |

### Multi-Language Support (Solo+)
- Worker records voice in their native language
- Whisper transcribes in original language
- GPT-4 translates to English + formats to NDIS
- Supported languages: Mandarin, Hindi, Tagalog, Vietnamese, Arabic, Spanish, Indonesian, and 80+ more
- **Key differentiator**: No other NDIS app offers this

---

## 4. NDIS Compliance Checklist

- [ ] Data stored in Australia (Supabase Sydney region)
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Data encryption at rest (Supabase handles this)
- [ ] Data export capability (users can download their data)
- [ ] Account deletion capability
- [ ] No overseas data transfers without consent
- [ ] Incident response process

---

## 5. Security Measures

### Authentication
- Email + password via Supabase Auth
- Optional: 2FA via authenticator app
- Password requirements: 8+ chars

### Data Protection
- Row-level security: users can only see their own data
- Client-side encryption for sensitive fields (optional upgrade)
- SSL/TLS in transit

### Access Control
- Solo plan: 1 user
- Team plan: up to 3 users, admin can invite
- No shared accounts

---

## 6. Core Features

### MVP+ (Solo Plan)
- [x] Voice recording → transcription
- [x] AI polish to NDIS format
- [x] Abbreviation toggle
- [ ] Multi-language input (Solo+ only) - record in any language, get English notes
- [ ] Client list (add/edit clients)
- [ ] Date/time picker
- [ ] Service type dropdown
- [ ] Export to PDF
- [ ] Copy to clipboard
- [ ] Save to device

### Team Plan
- [ ] Multi-user invites
- [ ] Client sharing (optional)
- [ ] Usage reports
- [ ] Admin controls

---

## 7. API Routes Needed

```
POST /api/transcribe    - Whisper API
POST /api/polish        - GPT-4 formatting
POST /api/stripe/webhook - Handle subscription events
GET  /api/notes         - List user's notes
POST /api/notes         - Create note
GET  /api/clients      - List clients
POST /api/clients      - Create client
```

---

## 8. Build Phases

### Phase 1: Foundation (Week 1-2)
- Set up Next.js project
- Configure Supabase (Sydney region)
- Build auth flow
- Basic note creation

### Phase 2: Core Features (Week 3-4)
- Voice recording + transcription
- AI polish
- Client management
- Export functionality

### Phase 3: Payments (Week 5-6)
- Stripe integration
- Subscription tiers
- Webhook handling
- Usage tracking

### Phase 4: Polish (Week 7-8)
- UI improvements
- Compliance docs
- Testing
- Launch

---

## 9. Estimated Costs (Monthly)

| Item | Cost |
|------|------|
| Vercel (Pro) | $20/mo |
| Supabase (Pro) | $25/mo |
| OpenAI ( Whisper + GPT) | ~$10-50/mo (usage based) |
| Stripe fees | 0% (pass to customer) |
| **Total** | ~$55-95/mo |

With 100 solo users ($15/mo): $1,500/mo revenue - costs = ~$1,400/mo profit

---

## 10. Next Steps

1. Set up Next.js repo
2. Configure Supabase project
3. Build auth + basic CRUD
4. Deploy to test

Want me to start building Phase 1?