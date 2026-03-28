# ⚙️ Environment Setup for FlowGuard AI

## Step 1: Get Google Generative AI API Key

### Register for Free Google API
1. Go to: https://ai.google.dev/
2. Click **"Get API Key"**
3. Sign in with Google account
4. Click **"Create API Key in new project"**
5. Copy the API key

### Important
- Keep your key **PRIVATE** (don't commit to GitHub!)
- Free tier includes generous quotas for hackathon use
- If rate limited, you can sign up for paid tier (optional)

---

## Step 2: Create .env File

Create `.env` file in the project root:

```bash
# Windows:
# c:\Users\gvman\Downloads\et gen\.env

# Content:
GOOGLE_API_KEY=your_api_key_here_from_step_1
```

### Don't have the file?

```bash
# In PowerShell, navigate to project:
cd "c:\Users\gvman\Downloads\et gen"

# Create .env file with API key:
@"
GOOGLE_API_KEY=your_api_key_from_google
"@ | Out-File -Encoding utf8 .env
```

---

## Step 3: Verify Installation

Run this to test everything works:

```bash
# Activate virtual environment
.venv\Scripts\activate

# Test Python
python --version

# Test Streamlit
python -m streamlit --version

# Test imports
python -c "import langchain; import faiss; import google.generativeai; print('✓ All imports OK')"
```

---

## Step 4: Run the Application

```bash
# From project root:
cd "c:\Users\gvman\Downloads\et gen"

# Make sure .env is in this directory
# (check with: dir .env)

# Run app:
python -m streamlit run app.py

# Should output:
# Streamlit app running on:
# Local URL: http://localhost:8501
```

### If Port 8501 is Busy

```bash
# Try next available port:
python -m streamlit run app.py --server.port 8502

# Try specific port:
python -m streamlit run app.py --server.port 9000
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'streamlit'"

**Fix:**
```bash
.venv\Scripts\activate
pip install streamlit
```

### Issue: "ModuleNotFoundError: No module named 'langchain'"

**Fix:**
```bash
.venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: "GOOGLE_API_KEY not found"

**Fix:**
- Make sure `.env` file exists in project root
- Run: `dir .env` to verify
- Check content: `Get-Content .env`

### Issue: API quota exceeded

**Fix:**
- Use a different Google account
- Wait 24 hours for quota reset
- Sign up for paid API access (optional)

### Issue: Port already in use

**Fix:**
```bash
# Kill process on port 8501:
netstat -ano | findstr :8501
taskkill /PID <process_id> /F
```

---

## .env Template

Copy and paste into `.env` file:

```env
# Google Generative AI Configuration
# Get your key from: https://ai.google.dev/

GOOGLE_API_KEY=your_api_key_here

# Optional: Model configuration (defaults in app.py)
# GEMINI_MODEL=gemini-pro
# GEMINI_TEMPERATURE=0.1

# Optional: Logging level
# LOG_LEVEL=INFO
```

---

## Production Environment Setup

For deployment post-hackathon:

### Docker (.Dockerfile)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

CMD ["streamlit", "run", "app.py", "--server.port=8501"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  flowguard:
    build: .
    ports:
      - "8501:8501"
    environment:
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    volumes:
      - ./faiss_index:/app/faiss_index
```

### Environment Variables (Production)
```bash
# Docker/Kubernetes
docker run -e GOOGLE_API_KEY=your_key flowguard-ai

# Kubernetes Secret
kubectl create secret generic google-api \
  --from-literal=key=your_api_key
```

---

## Security Best Practices

✅ **DO:**
- Store API keys in `.env` (never in code)
- Add `.env` to `.gitignore`
- Use different keys for dev/prod
- Rotate keys regularly
- Monitor API usage

❌ **DON'T:**
- Commit `.env` to GitHub
- Share API keys in messages
- Use same key across projects
- Leave keys in logs
- Expose keys in error messages

---

## FAQ

### Q: Where do I get the Google API key?
**A:** https://ai.google.dev/ → Click "Get API Key"

### Q: Is the API free?
**A:** Yes! Free tier includes sufficient quota for hackathon. See pricing at https://ai.google.dev/pricing

### Q: How do I update requirements?
**A:** 
```bash
pip install package_name
pip freeze > requirements.txt
```

### Q: Can I use a different LLM?
**A:** Yes! Modify line in `app.py`:
```python
# Change from:
model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.1)

# To:
from langchain.chat_models import ChatOpenAI
model = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

### Q: How do I save the FAISS index?
**A:** Already handled! Check `faiss_index/` folder after first run.

---

## Quick Setup Checklist

- [ ] Downloaded/Cloned FlowGuard AI
- [ ] Created virtual environment (`.venv`)
- [ ] Installed requirements (`pip install -r requirements.txt`)
- [ ] Got Google API key (https://ai.google.dev/)
- [ ] Created `.env` file with API key
- [ ] Verified setup (`python -c "import langchain"`)
- [ ] Can run app (`python -m streamlit run app.py`)
- [ ] App opens at `http://localhost:8501`
- [ ] Demo works (click "RUN LIVE SIMULATION")

---

## Support

**Stuck?** Check:
1. https://docs.streamlit.io/
2. https://python.langchain.com/
3. https://ai.google.dev/docs/
4. Issues on GitHub

**Report Bugs to:** e0324011@sriher.edu.in

---

**✅ Setup complete? You're ready for the hackathon! 🚀**
