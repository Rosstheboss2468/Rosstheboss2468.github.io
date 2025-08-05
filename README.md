# LinkedIn Message Drafter

A professional web application that mimics LinkedIn's posting interface, allowing users to draft and save LinkedIn messages before publishing them.

## Features

### 🎯 Core Functionality
- **LinkedIn-like Interface**: Authentic design that feels like you're actually on LinkedIn
- **Message Drafting**: Write and edit your LinkedIn posts with real-time character counting
- **Draft Management**: Save, view, edit, and delete your drafts
- **Auto-save**: Automatically saves your work as you type (after 3 seconds of inactivity)
- **Character Counter**: Real-time character count with visual feedback (3000 character limit)

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + S`: Save draft
  - `Ctrl/Cmd + Enter`: Post message
  - `Escape`: Close drafts section
- **Toast Notifications**: User-friendly feedback for all actions
- **Professional UI**: Clean, modern design using LinkedIn's color scheme and typography

### 💾 Data Management
- **Local Storage**: All drafts are saved locally in your browser
- **Persistent Data**: Drafts remain available even after closing the browser
- **Export/Import**: Built-in functionality for backing up and restoring drafts

## Getting Started

### Local Development
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start drafting your LinkedIn messages!

### Deployment to Your Domain

#### Option 1: Simple File Upload
1. Upload all files (`index.html`, `styles.css`, `script.js`) to your web server
2. Ensure they're in the same directory
3. Access via your domain (e.g., `https://yourdomain.com`)

#### Option 2: GitHub Pages
1. Create a new GitHub repository
2. Upload the project files
3. Go to Settings > Pages
4. Select source branch (usually `main`)
5. Your site will be available at `https://yourusername.github.io/repository-name`

#### Option 3: Netlify/Vercel
1. Create account on Netlify or Vercel
2. Connect your GitHub repository or upload files directly
3. Deploy automatically with custom domain support

### File Structure
```
linkedin-message-drafter/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

### Writing a Message
1. Type your LinkedIn post in the main text area
2. Watch the character counter update in real-time
3. Use the action buttons to add media, documents, events, or polls (coming soon)

### Saving Drafts
- **Manual Save**: Click "Save Draft" button
- **Auto-save**: Automatically saves after 3 seconds of inactivity
- **Keyboard Shortcut**: Press `Ctrl/Cmd + S`

### Managing Drafts
1. Click "View Drafts" in the header
2. See all your saved drafts with timestamps and character counts
3. Click "Edit" to load a draft back into the editor
4. Click "Delete" to remove unwanted drafts

### Posting
- Click "Post" to simulate publishing to LinkedIn
- In a real implementation, this would connect to LinkedIn's API

## Customization

### Changing Colors
Edit `styles.css` to modify the color scheme:
- Primary blue: `#0a66c2`
- Background: `#f3f2ef`
- Text: `#191919`

### Adding Features
The JavaScript file includes placeholder functions for:
- Media upload
- Document upload
- Event creation
- Poll creation

### Branding
Update the header logo and title in `index.html` to match your brand.

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Privacy & Security
- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics
- Your drafts remain private

## Future Enhancements
- LinkedIn API integration for actual posting
- Rich text formatting
- Image and media upload
- Draft templates
- Collaboration features
- Cloud sync across devices

## Support
For issues or feature requests, please create an issue in the repository or contact the developer.

## License
This project is open source and available under the MIT License.

---

**Note**: This is a demonstration application. The "Post" functionality simulates posting to LinkedIn but doesn't actually publish content. For real LinkedIn integration, you would need to implement the LinkedIn API. 