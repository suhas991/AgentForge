# Migration Guide for Existing Users

## Overview
The app now supports multiple AI providers (Gemini + Groq). Existing users with Gemini API keys will continue to work seamlessly.

---

## Backward Compatibility

### Existing Users (Gemini Only)
Your existing configuration will automatically work:

**Old localStorage.userConfig:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "apiKey": "AIzaSyD..."
}
```

**How it works now:**
- `apiKey` is read as `geminiApiKey` (backward compatible)
- All existing Gemini agents continue to work
- No action required!

### After Opening Settings
When you open Settings, your Gemini API key will appear in the "Google Gemini" provider card. You can:
- Keep using only Gemini
- Add a Groq API key to use Groq models
- Update your Gemini key if needed

---

## New Users

New users will see the improved onboarding:
1. **Step 1**: Enter name and email
2. **Step 2**: Configure AI Providers
   - Add Gemini API key (optional)
   - Add Groq API key (optional)
   - **At least ONE provider required**

---

## Adding Groq to Existing Setup

1. Click Settings (⚙️ icon)
2. Scroll to "AI Providers" section
3. Find the "⚡ Groq" card
4. Click "Get API key from Groq" link
5. Paste your Groq API key
6. Click "Save Changes"

Now you can create agents with Groq models!

---

## What Happens If You Try to Use a Model Without the API Key?

**Before this update:** ❌ App would crash

**After this update:** ✅ Clear error message
```
Groq API key not configured. Please add your API key 
in Settings to use Groq models.
```

You'll be directed to Settings to add the missing key.

---

## Data Migration

No manual migration needed! The system automatically:
- Reads old `apiKey` field
- Maps it to `geminiApiKey`
- Maintains `apiKey` for backward compatibility
- Adds new `groqApiKey` field when configured

---

## Questions?

**Q: Do I need to reconfigure anything?**
A: No! Existing setup works as-is.

**Q: Can I use both Gemini and Groq?**
A: Yes! Configure both in Settings.

**Q: What if I only want Gemini?**
A: Perfect! Just keep your current setup.

**Q: Will my existing agents break?**
A: No. All existing agents continue to work unchanged.

**Q: Can workflows mix Gemini and Groq agents?**
A: Yes! Each agent uses its configured model's provider.
