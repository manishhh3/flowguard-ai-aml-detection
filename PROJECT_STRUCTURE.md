# 📁 FlowGuard AI - Project Structure

## Directory Overview

```
flowguard-ai/
│
├── 📄 app.py                      ← MAIN APPLICATION (Run this!)
│
├── 📄 requirements.txt            ← All dependencies (pip install)
│
├── 📄 README.md                   ← Project overview & quick start
│
├── .env                           ← API keys (CREATE THIS - see SETUP.md)
│
├── SETUP.md                       ← ⭐ SETUP INSTRUCTIONS (read first!)
│
├── REGISTRATION_GUIDE.md          ← How to register for hackathon
│
├── HACKATHON_SUBMISSION.md        ← Full submission document
│
├── JUDGES_BRIEF.md                ← 2-min executive summary for judges
│
├── .gitignore                     ← Git ignore rules (don't commit .env!)
│
│
├── 📂 src/
│   ├── components/
│   │   ├── DataFirehose.jsx       ← React component (future)
│   │   ├── ExecutionLog.jsx       ← React component (future)
│   │   ├── ThreatMatrix.jsx       ← React component (future)
│   ├── App.jsx                    ← React app (future)
│   ├── main.jsx                   ← React entry (future)
│   └── index.css                  ← Styles (future)
│
│
├── 📂 public/                     ← Static assets (future)
│
│
├── 📂 faiss_index/                ← Auto-created (vector DB)
│   ├── index.faiss                ← FAISS index file
│   └── index.pkl                  ← Pickle metadata
│
│
├── eslint.config.js               ← Linting rules
│
├── vite.config.js                 ← Vite build config
│
├── index.html                     ← Static HTML entry
│
└── package.json                   ← Node dependencies (future)
```

---

## File Descriptions

### 🚀 Must-Read Files (In Order)

1. **SETUP.md** - Environment setup & API key configuration
   - How to get Google API key
   - How to create .env file
   - Troubleshooting

2. **README.md** - Quick start guide
   - Installation steps
   - How to run the app
   - Feature overview
   - Technology stack

3. **app.py** - Main application
   - 100% complete Streamlit app
   - AI agent for fraud detection
   - Live simulation demo
   - No modifications needed to run!

### 📋 Hackathon Documents

4. **JUDGES_BRIEF.md** ⭐ MOST IMPORTANT
   - 2-minute executive summary
   - Problem/solution overview
   - Key metrics & impact
   - Demo walkthrough
   - Q&A for judges
   - **Share this with judges!**

5. **HACKATHON_SUBMISSION.md** - Detailed submission guide
   - Problem statement alignment
   - Full architecture explanation
   - Compliance details
   - Future roadmap
   - Team composition

6. **REGISTRATION_GUIDE.md** - How to register
   - Team setup instructions
   - Idea submission template
   - Pre-hackathon preparation
   - Judging criteria checklist
   - Prize information

### ⚙️ Configuration Files

- **.env** - API keys (CREATE THIS!)
  - Store GOOGLE_API_KEY here
  - Never commit to Git

- **.gitignore** - Files to ignore
  - Excludes .env, faiss_index, etc.

- **requirements.txt** - Python dependencies
  - All packages needed
  - Run: `pip install -r requirements.txt`

- **vite.config.js, eslint.config.js, package.json** - Future React frontend

### 📁 Directories

- **src/** - React source (for production website)
- **public/** - Static files
- **faiss_index/** - Vector database (auto-created after first run)

---

## Quick Reference: File Usage

### For Development
```
1. Read SETUP.md
2. Create .env with API key
3. Run: pip install -r requirements.txt
4. Run: python -m streamlit run app.py
5. Open: http://localhost:8501
```

### For Judges
```
1. Start app.py
2. Share JUDGES_BRIEF.md (2-min read)
3. Show live demo ("RUN LIVE SIMULATION" button)
4. Answer Q&A using talking points in JUDGES_BRIEF.md
```

### For Registration
```
1. Read REGISTRATION_GUIDE.md
2. Go to https://ideahackathon.com/sign-up
3. Copy text from REGISTRATION_GUIDE.md → form
4. Submit before 29 March 2026
```

### For Full Submission
```
1. Structure from HACKATHON_SUBMISSION.md
2. Metrics from JUDGES_BRIEF.md
3. Talking points from JUDGES_BRIEF.md
4. Code repo: Push app.py + requirements.txt + README.md
```

---

## What NOT to Edit

❌ **Don't modify unless you know what you're doing:**
- `app.py` (already 100% complete)
- `requirements.txt` (all deps included)
- `.gitignore` (covers all sensitive files)

✅ **Safe to modify:**
- Any `*.md` files (customize for your team)
- Create `TEAM_NOTES.md` for team collaboration
- Add `DEMO_DATA.md` if using custom data

---

## Future Enhancements (After Hackathon)

These directories are for the production React version:
```
src/
├── components/
│   ├── DataFirehose.jsx    → Upload & process PDFs
│   ├── ThreatMatrix.jsx    → 3D transaction visualization
│   ├── ExecutionLog.jsx    → Agent reasoning display
│
├── App.jsx                  → Main React app
├── main.jsx                 → Entry point
└── index.css                → Styling
```

For now, everything works in Streamlit (app.py). React UI comes later.

---

## File Sizes & Storage

| File | Size | Purpose |
|------|------|---------|
| app.py | ~3KB | Core app |
| JUDGES_BRIEF.md | ~8KB | Judge document |
| faiss_index/ | ~50MB | Vector DB (created on first run) |
| .venv/ | ~500MB | Python virtual env |

**Total Project Size**: ~500MB-1GB (mostly .venv which isn't committed)

---

## Git Workflow (If Using GitHub)

```bash
# Initialize repo
git init
git add .
git commit -m "Initial commit: FlowGuard AI MVP"

# Add remote
git remote add origin https://github.com/yourname/flowguard-ai.git

# Push to GitHub
git push -u origin main
```

### .gitignore already includes:
- `.env` (API keys safe)
- `faiss_index/` (large DB)
- `.venv/` (1000s of files)
- `__pycache__/` (Python cache)
- `*.pyc` (Compiled Python)

---

## File Access Checklist

Before submitting for hackathon, verify:

- [x] ✅ app.py exists & runs
- [x] ✅ requirements.txt has all packages
- [x] ✅ README.md explains project
- [x] ✅ JUDGES_BRIEF.md written & compelling
- [x] ✅ SETUP.md explains setup
- [x] ✅ REGISTRATION_GUIDE.md has template
- [x] ✅ .env template provided (SETUP.md)
- [x] ✅ .gitignore protects secrets
- [x] ✅ HACKATHON_SUBMISSION.md complete

---

## Questions About Files?

- **How do I run the app?** → See README.md
- **Where's my API key?** → SETUP.md (Step 1)
- **What do I tell judges?** → Share JUDGES_BRIEF.md
- **How do I register?** → REGISTRATION_GUIDE.md
- **What's in this directory?** → You're reading it! 😄

---

**📁 Project fully structured & ready for hackathon submission!**

**Next step:** Read SETUP.md → Create .env → Run app.py → Show judges!
