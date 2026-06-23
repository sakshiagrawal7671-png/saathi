# 🌟 SAATHI – Human Connection & Life Guidance Platform

> *"You are not alone. SAATHI is here."*

SAATHI is a full-stack web application designed to help people feel less alone and live more meaningful lives. It's not a mental health app — it's a **Human Connection, Emotional Wellbeing, Family Bonding, Personal Growth, and Life Guidance Ecosystem**.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🤗 **SAATHI AI Companion** | Emotionally intelligent chat — listens, validates, guides |
| 😊 **Mood Tracker** | Daily mood + energy + sleep + stress tracking with analytics |
| 📓 **Smart Journal** | Text journaling with AI emotional analysis |
| ⚡ **Habit Tracker** | Daily habits with streaks, progress, and gamification |
| 🎯 **Goal Setting** | Life goals across career, health, relationships, and more |
| ❤️ **Family Bonding Hub** | Stay connected with loved ones, WhatsApp integration |
| 🌱 **Gratitude Garden** | Visual garden that grows with gratitude entries |
| 🌳 **Focus Forest** | Pomodoro timer — plant trees with focus sessions |
| 🌍 **Community** | Anonymous, moderated peer support space |
| 🫂 **Comfort Room** | One-tap emergency support with crisis resources |
| 🌿 **Wellness Center** | Breathing exercises, grounding techniques, calm sounds |

---

## 🛠️ Tech Stack

**Backend:** Java 21 · Spring Boot 3.2 · Spring Security · JWT · Spring Data JPA · WebSocket  
**Frontend:** React 18 · Redux Toolkit · React Router · Framer Motion ready · React Icons  
**Database:** H2 (dev) · MySQL 8 (prod)  
**AI:** OpenAI GPT-3.5 / Demo mode (works without API key)  
**Deployment:** Docker · Docker Compose

---

## 🚀 Quick Start

### Option 1: Run with Docker (Recommended)

```bash
# Clone or unzip the project
cd saathi

# Copy env file
cp .env.example .env

# (Optional) Add your OpenAI API key in .env
# OPENAI_API_KEY=sk-your-key-here

# Start everything
docker-compose up --build

# App runs at:
# Frontend → http://localhost
# Backend API → http://localhost:8080
# Swagger UI → http://localhost:8080/swagger-ui.html
```

### Option 2: Run Locally (Development)

**Prerequisites:** Java 21+, Node.js 18+, Maven 3.8+

**Backend:**
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm start
# Runs on http://localhost:3000
```

### Option 3: MySQL (Production)

```bash
# Start backend with MySQL profile
cd backend
mvn spring-boot:run -Dspring.profiles.active=mysql \
  -Dspring.datasource.password=your_password
```

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
# AI (optional - app works in demo mode without this)
OPENAI_API_KEY=sk-your-openai-api-key

# MySQL (for production)
MYSQL_ROOT_PASSWORD=saathi_root_2024
MYSQL_PASSWORD=saathi_pass_2024
```

---

## 📁 Project Structure

```
saathi/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/saathi/
│   │   ├── config/             # Security, WebSocket, App configs
│   │   ├── controller/         # REST API controllers
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Global error handling
│   │   ├── repository/         # Spring Data repositories
│   │   ├── security/           # JWT, UserDetails
│   │   └── service/            # Business logic
│   └── src/main/resources/
│       ├── application.properties      # H2 (default)
│       └── application-mysql.properties # MySQL (prod)
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── layout/         # Sidebar, Layout
│   │   │   └── wellness/       # ComfortRoom
│   │   ├── pages/              # All page components
│   │   ├── services/api.js     # Axios API client
│   │   ├── store/              # Redux Toolkit store
│   │   └── App.js              # Routes
│   └── public/index.html
│
├── docker-compose.yml          # Full stack deployment
├── .env.example
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard` | Dashboard data |
| POST/GET | `/api/mood` | Log & get moods |
| POST/GET | `/api/journal` | Create & list journal entries |
| POST | `/api/companion/chat` | Chat with SAATHI AI |
| POST/GET | `/api/habits` | Habits CRUD |
| POST/GET | `/api/goals` | Goals CRUD |
| POST/GET | `/api/family` | Family members |
| POST/GET | `/api/gratitude` | Gratitude entries |
| POST/GET | `/api/community/posts` | Community posts |
| POST/GET | `/api/focus` | Focus sessions |

Full docs: `http://localhost:8080/swagger-ui.html`

---

## 🤖 AI Integration

SAATHI works in **demo mode** without an API key (uses locally-generated empathetic responses).

To enable real AI:
1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Add to `application.properties`: `saathi.ai.openai.api-key=sk-your-key`
3. Or set environment variable: `OPENAI_API_KEY=sk-your-key`

---

## 🎨 Design Philosophy

- **No followers. No likes. No rankings.** — Genuine connection only
- **No toxic productivity.** — Growth without guilt  
- **No manipulative engagement.** — Users first, always
- **Warmth over clinical.** — Feels like coming home
- **Crisis-aware.** — Safety built in at every level

---

## 📞 Crisis Resources (India)

| Resource | Number |
|----------|--------|
| iCall | 9152987821 |
| Vandrevala Foundation | 1860-2662-345 |
| SNEHI | 044-24640050 |

---

## 🛣️ Roadmap

- [ ] Google OAuth login
- [ ] Voice journaling (Web Speech API)
- [ ] Push notifications (Firebase)
- [ ] Mobile app (React Native)
- [ ] Personality assessment (Big Five)
- [ ] Expert creator program
- [ ] Life RPG / gamification system
- [ ] Personal Island visual
- [ ] Advanced AI with Gemini

---

## 💜 Built with Love

SAATHI was built with one belief: **every person deserves to feel understood, valued, and supported.**

*"Someone listened. I have people who care about me. I can take the next step."*

---

## 🆕 V2 Features

| Module | Description |
|--------|-------------|
| ⚔️ **Life RPG System** | Daily quests, XP, levels (1–50+), titles (Seeker→Legend), achievements |
| 🐾 **Virtual Pet** | Adopt a Dog/Cat/Panda/Rabbit/Fox — grows from Baby→Wise Elder with your activity |
| 🏰 **Dream Tower** | Visual tower built from your dreams; track progress per dream |
| 📖 **Life Journey Story** | 5-chapter story arc; write your narrative, unlock chapters, log milestones |

### V2 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rpg/profile` | Full RPG profile — level, XP, quests, achievements |
| GET/POST | `/api/rpg/quests` | Daily quests list & complete a quest |
| GET | `/api/rpg/achievements` | All unlocked achievements |
| GET/POST | `/api/pet` | Pet status, create, feed, play |
| GET/POST | `/api/dreams` | Dream Tower CRUD + tower stats |
| GET/PUT | `/api/journey/chapters` | Life Journey chapters + update/complete |

---

## 🆕 V3 Features

| Module | Description |
|--------|-------------|
| 🧠 **Personality Assessment** | 50-question Big Five test (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism), personality type, strengths, growth areas, career matches, relationship style |
| 🧭 **Purpose Discovery Center** | Value selection (24 values), 6-section discovery (values, strengths, passions, impact, future vision, legacy), AI-generated purpose statement + next steps |
| 🚀 **Career Guidance Center** | Skill/interest profiling, personalised career recommendations (enriched by personality results), skill roadmap, learning resources, 90-day action plan |

### V3 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/personality/questions` | 50 Big Five questions |
| POST | `/api/personality/submit` | Submit answers, get full profile |
| GET | `/api/personality/result` | Get saved result |
| GET/PUT | `/api/purpose` | Get/update purpose profile |
| POST | `/api/purpose/generate` | Generate purpose statement |
| GET/POST | `/api/purpose/values` | Get/save value cards |
| GET/PUT | `/api/career` | Get/update career profile |
| POST | `/api/career/generate` | Generate career guidance |

---

## 🆕 V4 Features

| Module | Description |
|--------|-------------|
| 🏝️ **Personal Island** | Visual interactive island that grows with you — 8 structures (Family House, Memory Lake, Gratitude Garden, Dream Tower, Pet Area, Wisdom Library, Hope Bridge, Focus Forest), each unlocked by real activity. Dynamic day/night sky based on real time, animated clouds/stars/butterflies |
| ❤️ **Human Connection Score** | Weekly score (0-100) measuring real connection — family contact, meaningful conversations, kindness acts, community support. No followers, no likes, just genuine relationship health with weighted breakdown |
| ✨ **SAATHI Shorts** | Daily limited (5/day) bite-sized wisdom cards across 5 categories (study tips, life lessons, emotional wellbeing, career advice, family relationships). Swipeable card UI, like/save, rotates daily — no infinite scroll |

### V4 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/island` | Full island status with unlock states |
| PATCH | `/api/island/environment` | Set time of day / weather |
| POST | `/api/connection/log` | Log a connection activity |
| GET | `/api/connection/score` | Weekly/monthly connection score & breakdown |
| GET | `/api/connection/logs` | Recent connection logs |
| GET | `/api/shorts/daily` | Today's 5 curated shorts |
| POST | `/api/shorts/{id}/view\|like\|save` | Interact with a short |
| GET | `/api/shorts/saved` | Saved shorts |
| GET | `/api/shorts/stats` | Daily viewing stats |

### How v4 connects to v1-v3
- **Personal Island** structures unlock based on: Gratitude entries (Memory Lake, Garden), Dreams (Dream Tower), Virtual Pet (Pet Area), Personality Assessment (Wisdom Library), Focus sessions (Focus Forest), Connection logs (Hope Bridge)
- **Connection Score** awards XP via the Life RPG system for every logged connection
- **SAATHI Shorts** awards XP for daily engagement, tying into the gamification system

---

## 🆕 V5 Features

| Module | Description |
|--------|-------------|
| 📚 **Life Library** | 10 curated articles across Courage, Hope, Compassion, Patience, Gratitude, Purpose, Psychology, Human Behaviour, Emotional Intelligence, Life Skills, Personal Growth — each grounded in real psychological research, bookmarkable, "helpful" voting |
| 🌟 **Hope Library** | 10 stories of resilience covering Overcoming Failure, Loss, Adversity, Rejection — framed around real public examples and psychology, with a dedicated "this gave me hope" reaction |
| 🎁 **Daily Surprise System** | 5 daily gifts: Wisdom Card, Kindness Mission, Reflection Prompt, Family Challenge, Gratitude Challenge — rotates by date, gift-box "open" animation, completing awards +15 XP |
| 🎓 **Expert Creator Program** | Apply as Psychologist/Teacher/Professor/Mentor/Doctor/Career Coach, admin approval flow, verified experts can publish themed content to a community feed with "helpful" voting |

### V5 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/library/{LIFE\|HOPE}` | Library articles, optional `?theme=` filter |
| GET | `/api/library/article/{id}` | Single article |
| POST | `/api/library/article/{id}/read\|bookmark\|helpful` | Article interactions |
| GET | `/api/library/bookmarked` | Bookmarked articles |
| GET | `/api/surprises/today` | Today's 5 surprises |
| POST | `/api/surprises/{id}/open\|complete` | Open/complete a surprise |
| POST | `/api/experts/apply` | Apply as expert |
| GET | `/api/experts/me`, `/me/stats` | Application status & stats |
| POST | `/api/experts/content` | Publish content (verified only) |
| GET | `/api/experts/content` | Public expert feed |
| POST | `/api/experts/content/{id}/helpful` | Mark helpful |
| GET/POST | `/api/experts/pending`, `/{id}/review` | Admin: review applications |

### How v5 connects to v1-v4
- Reading library articles, completing surprises, and publishing expert content all award XP via the Life RPG system
- Daily Surprise's Family Challenge ties naturally into the Family Bonding Hub
- Expert content uses the same `LibraryTheme` taxonomy as the Life Library for consistency

---

## 🆕 V6 Features

| Module | Description |
|--------|-------------|
| 🔐 **Google OAuth** | Full Google OAuth2 login via Spring Security OAuth2 client. New `/oauth-callback` frontend page captures JWT token after redirect. Accounts auto-created for first-time Google users, linked for existing users. Google button added to Login page |
| 🎙️ **Voice Journaling** | Browser Web Speech API integration (Chrome/Edge). Mic button inside journal form activates real-time transcription; transcript flows into journal content. Works in English and English-India locale |
| 🔔 **Push Notifications** | Full notification system: push token registration, 6-category preferences with toggle UI and custom reminder time, in-app notification inbox with unread badge, Firebase FCM integration point (graceful fallback when disabled). Browser permission request flow included |
| ⚙️ **Admin Dashboard** | Full admin panel (ROLE_ADMIN only): platform stats (users, entries, posts), user management table with role changer & enable/disable, flagged community post moderation, community analytics (avg stress/energy/sleep, mood distribution, focus minutes) |

### V6 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/oauth2/authorization/google` | Initiate Google OAuth (Spring auto-generated) |
| POST | `/api/notifications/register-token` | Register FCM push token |
| GET/PUT | `/api/notifications/preferences` | Get/update notification preferences |
| GET | `/api/notifications` | In-app notification inbox |
| POST | `/api/notifications/mark-all-read` | Mark all notifications read |
| GET | `/api/notifications/unread-count` | Unread badge count |
| POST | `/api/notifications/test` | Send a test notification |
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/analytics` | Community analytics |
| GET | `/api/admin/users` | Paginated user list |
| PATCH | `/api/admin/users/{id}/role` | Change user role |
| PATCH | `/api/admin/users/{id}/toggle-enabled` | Enable/disable user |
| GET | `/api/admin/posts/flagged` | Flagged posts |
| PATCH | `/api/admin/posts/{id}/flag` | Flag/unflag post |
| DELETE | `/api/admin/posts/{id}` | Delete post |

### Enabling Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → OAuth 2.0 Credentials
2. Add `http://localhost:8080/login/oauth2/code/google` as authorized redirect URI
3. Set in `application.properties`:
   - `spring.security.oauth2.client.registration.google.client-id=YOUR_ID`
   - `spring.security.oauth2.client.registration.google.client-secret=YOUR_SECRET`

### Enabling Firebase Push
1. Create a Firebase project → Project Settings → Service Accounts → Generate key
2. Save JSON as `firebase-service-account.json` in backend root
3. Add `firebase-admin` dependency to `pom.xml`
4. Set `saathi.firebase.enabled=true` in `application.properties`
5. Uncomment the FCM code block in `NotificationServiceImpl.sendViaFirebase()`

---

## 🆕 V7 Features

| Module | Description |
|--------|-------------|
| 🌿 **Digital Detox Engine** | Session tracker, daily usage ring (0–100%), weekly 7-bar chart, status levels (Healthy/Moderate/High/Over), configurable daily limit (15–240 min), break reminders, weekend detox mode, daily activity suggestion |
| 🤖 **Advanced AI (Gemini + OpenAI)** | Dual-provider AI with auto-detection (Gemini → OpenAI → Demo), personalised context injection (mood, personality, goals, streak), emotion/burnout/growth text analysis tool, AI-generated personalised insights panel |
| 🔄 **Offline Mode** | Browser-based offline queue (localStorage), Quick Capture (mood/journal/gratitude while offline), one-tap "Sync All" when reconnected, backend sync queue processor (OfflineSyncQueue entity handles server-side batching) |
| 📱 **React Native Mobile App** | Expo-based app with Login, Register, Home Dashboard (RPG stats, quick actions, mood week), and SAATHI AI Companion screens. Bottom tab navigation. Connects to same Spring Boot backend |

### V7 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/detox/session/start\|end` | Track usage sessions |
| GET | `/api/detox/usage/today\|weekly` | Daily & weekly usage stats |
| GET/PUT | `/api/detox/goal` | Get/update detox settings |
| POST | `/api/ai/chat` | Advanced chat (Gemini/OpenAI/demo auto-select) |
| GET | `/api/ai/provider` | Which AI provider is active |
| POST | `/api/ai/analyze` | Emotion/burnout/growth text analysis |
| GET | `/api/ai/insights` | Personalised AI-generated insights |
| POST | `/api/sync/queue` | Queue item for offline sync |
| POST | `/api/sync/process` | Process entire sync queue |
| GET | `/api/sync/pending\|count` | Pending sync items |

### Enable Gemini AI
Add to `application.properties`:
```
saathi.ai.gemini.api-key=YOUR_GEMINI_API_KEY
```
Get key free: [aistudio.google.com](https://aistudio.google.com)

### Run Mobile App
```bash
cd mobile
npm install
npx expo start
# Press 'a' for Android emulator, 'i' for iOS simulator, scan QR for device
```

---

## 🆕 V9 Features

| Module | Description |
|--------|-------------|
| 😊 **Positive Memory Vault** | Timeline + Grid views of your happiest moments. 11 categories (Achievement, Family, Friendship, Adventure, Milestone, Kindness Received, Love, Personal Growth, Nature, Celebration, Other). Pin favourites. Date-based timeline with colour-coded category nodes and gradient cards |
| 🎨 **Calm Coloring Therapy** | Interactive SVG canvas with 4 templates (Mandala, Flower, Star, Lotus). 24-colour palette with click-to-paint regions. Session tracking with XP reward. Hover preview on regions. No art skills needed — therapeutic colouring for stress relief |
| 🎵 **Relaxation Hub** | Web Audio API ambient sound mixer — 8 sounds (Rain, Ocean, Forest, River, Fire, White Noise, Thunder, Wind). Mix multiple sounds simultaneously with individual volume sliders. 4 presets (Deep Focus, Sleep Aid, Calm Anxiety, Meditation). Auto-stop timer (5/10/15/30/60 min). Animated equaliser bars |
| 🗺️ **Life Map** | 4-section visual journey map: Where I Am Now → Next 3-6 Months → Next 1-3 Years → Dream Life Vision. Progress bar across all sections. Individual milestone cards with complete/delete actions. Target dates. Motivational completion quote |

### V9 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/memories` | Add positive memory |
| GET | `/api/memories` | Get all memories (date-sorted) |
| POST | `/api/memories/{id}/pin` | Toggle pin |
| DELETE | `/api/memories/{id}` | Delete memory |
| GET | `/api/memories/stats` | Timeline stats & vault level |
| POST | `/api/coloring/session` | Save coloring session |
| GET | `/api/coloring/stats` | Sessions count, minutes, badge |
| POST | `/api/life-map` | Add life map entry |
| GET | `/api/life-map` | Get full map summary by section |
| POST | `/api/life-map/{id}/complete` | Toggle milestone complete |
| DELETE | `/api/life-map/{id}` | Remove entry |

### Notes
- Relaxation Hub uses the **Web Audio API** — no external audio files required. Works in all modern browsers. Generated procedurally in JavaScript.
- Calm Coloring uses **SVG path regions** — no canvas library needed. Each template region is a separate clickable SVG path.
