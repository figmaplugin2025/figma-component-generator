# 🔐 Security Setup Guide

## Figma Token Security

Your Figma plugin now has secure token management. Here's how to set it up:

### ✅ What's Already Secured:

1. **Token removed from git history** - Your token is no longer in the repository
2. **Secure token manager** - Created `src/utils/tokenManager.ts`
3. **Protected files** - Added to `.gitignore`
4. **API service** - Created `src/services/figmaApiService.ts`

### 🔧 Setup Instructions:

#### 1. **Create Environment File (Optional)**
```bash
# Copy the example file
cp env.example .env

# Edit .env and add your token
FIGMA_ACCESS_TOKEN=figd_your_actual_token_here
```

#### 2. **Get Your Figma Token:**
1. Go to [Figma Settings](https://www.figma.com/settings)
2. Navigate to **Account** → **Personal access tokens**
3. Click **Generate new token**
4. Give it a name like "Plugin Development"
5. Copy the token (starts with `figd_`)

#### 3. **Store Token Securely:**
The plugin will automatically prompt you for the token when needed, or you can:

- **Option A**: Add to `.env` file (for development)
- **Option B**: Let the plugin prompt you (recommended)
- **Option C**: Store in browser localStorage (temporary)

### 🛡️ Security Features:

#### **Token Manager (`src/utils/tokenManager.ts`)**
- ✅ Validates token format (`figd_` prefix)
- ✅ Stores in localStorage (encrypted by browser)
- ✅ Prompts user if token not found
- ✅ Clears token on demand

#### **API Service (`src/services/figmaApiService.ts`)**
- ✅ Secure API calls with token
- ✅ Error handling
- ✅ Token validation
- ✅ File and image retrieval

#### **Git Protection**
- ✅ `.gitignore` protects sensitive files
- ✅ Token removed from git history
- ✅ `env.example` shows format without real token

### 🚨 Security Best Practices:

1. **Never commit tokens** - They're in `.gitignore`
2. **Use environment variables** - For development
3. **Rotate tokens regularly** - Generate new ones periodically
4. **Limit token permissions** - Only grant necessary access
5. **Monitor usage** - Check Figma's token usage logs

### 🔍 Testing Your Setup:

```typescript
import { figmaApiService } from './src/services/figmaApiService';

// Test token validation
const isValid = await figmaApiService.validateToken();
console.log('Token valid:', isValid);
```

### 📝 File Structure:
```
src/
├── utils/
│   └── tokenManager.ts      # Secure token management
├── services/
│   └── figmaApiService.ts   # Secure API calls
└── figtoken.txt             # ❌ REMOVED (was insecure)

.gitignore                   # ✅ Protects sensitive files
env.example                  # ✅ Shows token format
.env                        # ✅ Your actual token (not in git)
```

### 🆘 Troubleshooting:

**Token not working?**
1. Check token format: `figd_...`
2. Verify token hasn't expired
3. Ensure token has correct permissions
4. Try regenerating the token

**API calls failing?**
1. Check network access in `manifest.json`
2. Verify token is valid
3. Check Figma API rate limits

### 🔄 Token Rotation:

1. Generate new token in Figma
2. Update your `.env` file or re-enter when prompted
3. Old token will be automatically replaced

---

**Remember**: Your token gives access to your Figma account. Keep it secure! 🔐
