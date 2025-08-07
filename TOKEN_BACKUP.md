# 🔐 Secure Token Backup Guide

## Where to Store Your Tokens Safely

Since you deleted `figtoken.txt`, here are the **secure** places to store your tokens:

### 🥇 **Option 1: Environment Variables (Recommended)**

Create a `.env` file in your project root:
```bash
# .env file (NOT tracked by git)
FIGMA_ACCESS_TOKEN=figd_your_actual_figma_token_here
GITHUB_ACCESS_TOKEN=ghp_your_actual_github_token_here
```

### 🥈 **Option 2: System Environment Variables (Most Secure)**

**Windows PowerShell:**
```powershell
# Set for current session
$env:FIGMA_ACCESS_TOKEN="figd_your_token_here"
$env:GITHUB_ACCESS_TOKEN="ghp_your_token_here"

# Set permanently
setx FIGMA_ACCESS_TOKEN "figd_your_token_here"
setx GITHUB_ACCESS_TOKEN "ghp_your_token_here"
```

### 🥉 **Option 3: Password Manager (Best for Production)**

**Recommended Password Managers:**
- **1Password** (most secure)
- **LastPass** (good free tier)
- **Bitwarden** (open source)
- **Windows Credential Manager**

**How to store:**
1. Create a new entry called "Figma Plugin Tokens"
2. Add fields:
   - Figma Token: `figd_...`
   - GitHub Token: `ghp_...`
3. Use strong master password

### 🏆 **Option 4: Secure Note Apps**

**Notion (Private Workspace):**
```
🔐 Plugin Tokens
├── Figma: figd_...
└── GitHub: ghp_...
```

**OneNote (Encrypted):**
- Create encrypted section
- Store tokens as text
- Use strong password

### 🚨 **NEVER Store Tokens In:**

❌ Plain text files
❌ Git repositories  
❌ Public cloud storage
❌ Email drafts
❌ Browser bookmarks
❌ Sticky notes

### 🔄 **Token Rotation Schedule:**

- **Figma Token**: Every 3 months
- **GitHub Token**: Every 6 months
- **Emergency**: If compromised

### 🛡️ **Security Checklist:**

- [ ] Tokens are NOT in git history
- [ ] Tokens are NOT in plain text files
- [ ] Tokens are stored in secure location
- [ ] Tokens have minimal permissions
- [ ] Tokens are rotated regularly
- [ ] Backup tokens are stored separately

### 📱 **Quick Access Methods:**

**For Development:**
```bash
# Check if tokens are set
echo $env:FIGMA_ACCESS_TOKEN
echo $env:GITHUB_ACCESS_TOKEN
```

**For Production:**
- Use password manager
- Store in secure note app
- Use system credential manager

### 🆘 **Emergency Recovery:**

If you lose your tokens:
1. **Figma**: Go to Settings → Account → Personal access tokens → Revoke old → Generate new
2. **GitHub**: Go to Settings → Developer settings → Personal access tokens → Revoke old → Generate new
3. **Update**: Replace tokens in your secure storage

---

**Remember**: Your tokens give access to your accounts. Treat them like passwords! 🔐
