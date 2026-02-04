# 🚀 LeetCode to GitHub Sync Extension

A Chrome extension that automatically syncs your LeetCode solutions to GitHub after getting an "Accepted" submission.

## ✨ Features

- 🎯 **One-Click Sync** - Automatically detect accepted submissions and sync to GitHub
- 📁 **Organized Storage** - Solutions saved in `leetcode/` folder with clean filenames
- 🔒 **Secure** - GitHub credentials stored locally using Chrome storage
- 🎨 **Visual Feedback** - Green success indicator, red error alerts
- 🌐 **CSP Compliant** - Uses web-accessible resources for safe code extraction
- 🔄 **Smart Detection** - Extracts code from Monaco editor and problem metadata

## 📦 Installation

### Method 1: Load Unpacked (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `Leetcode_extension` folder
6. Extension installed! 🎉

### Method 2: Chrome Web Store (Coming Soon)

_Extension will be published to Chrome Web Store_

## ⚙️ Setup

### 1. Get GitHub Personal Access Token

1. Go to [GitHub Token Settings](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name (e.g., "LeetCode Sync")
4. Select scope: **`repo`** (Full control of private repositories)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)

### 2. Configure Extension

1. Click the extension icon in Chrome toolbar
2. Fill in the settings:
   - **GitHub Token**: Paste your personal access token
   - **Repository Owner**: Your GitHub username
   - **Repository Name**: Name of repo to sync to (must exist)
   - **Branch**: `main` (or `master`, `dev`, etc.)
3. Click **Save Settings**
4. Verify in console that settings were saved

## 🎮 Usage

1. Navigate to [LeetCode](https://leetcode.com/problems/)
2. Solve a problem and submit your solution
3. Wait for **"Accepted"** result
4. A **"Sync to GitHub"** button appears next to the result
5. Click the button
6. Button turns green → **"✓ Synced!"** (success)
7. Check your GitHub repo under `leetcode/` folder

### File Naming Convention

Files are saved as: `leetcode/{problem-slug}.{extension}`

Examples:

- `leetcode/two-sum.js`
- `leetcode/reverse-linked-list.py`
- `leetcode/valid-parentheses.cpp`

## 🏗️ Project Structure

```
Leetcode_extension/
├── manifest.json              # Extension configuration
├── background/
│   ├── serviceWorker.js      # Background script for message handling
│   ├── github.js             # GitHub API integration
│   └── storage.js            # Chrome storage utilities
├── content/
│   ├── contentScript.js      # Main content script with polling
│   ├── extractCode.js        # Code extraction from LeetCode
│   ├── pageExtractor.js      # Page context script (CSP-safe)
│   └── injectSyncButton.js   # Button injection logic
├── options/
│   ├── option.html           # Settings UI
│   └── option.js             # Settings logic
├── utils/
│   ├── languageMap.js        # Language to file extension mapping
│   └── filename.js           # Filename sanitization
└── readme.md                 # This file
```

## 🛠️ Technical Details

### Architecture

- **Manifest V3** - Uses service workers instead of background pages
- **CSP Compliant** - Injects external scripts via `web_accessible_resources`
- **Message Passing** - Content script ↔ Service worker ↔ GitHub API
- **Monaco Editor Support** - Extracts code directly from LeetCode's editor

### Key Technologies

- Chrome Extension APIs (Manifest V3)
- GitHub REST API
- Monaco Editor API
- Content Security Policy (CSP) compliant injection
- Chrome Storage API

### Supported Languages

- JavaScript (`.js`)
- Python (`.py`)
- C++ (`.cpp`)
- Java (`.java`)
- Others mapped to `.txt`

## 🐛 Troubleshooting

### "Extension context invalidated"

**Solution**: Refresh the LeetCode page after reloading the extension

### "GitHub credentials not configured"

**Solution**: Click extension icon and fill in all settings (Token, Owner, Repo)

### "Failed to extract code"

**Solution**: Make sure the code editor is visible on the page

### "Invalid GitHub token"

**Solution**: Generate a new token with `repo` scope at [GitHub Settings](https://github.com/settings/tokens)

### "Repository not found"

**Solution**: Verify the repository exists and the owner/repo names are correct

### "Permission denied. Token needs 'repo' scope"

**Solution**: Your token doesn't have the required permissions. Generate a new one with `repo` scope

### Button not appearing

**Solution**:

1. Make sure you're on a LeetCode problem page (`leetcode.com/problems/*`)
2. Submit a solution and wait for "Accepted" status
3. Check browser console for errors (F12)

## 🔐 Security & Privacy

- ✅ GitHub token stored locally (never sent to third parties)
- ✅ Only accesses `leetcode.com` and `api.github.com`
- ✅ No tracking or analytics
- ✅ Open source - audit the code yourself

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- LeetCode for the amazing platform
- GitHub for the API
- Chrome Extensions documentation

## 📧 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the [Troubleshooting](#-troubleshooting) section
- Review browser console logs (F12)

---

**Happy Coding! 🎉**

Made with ❤️ for the coding community
