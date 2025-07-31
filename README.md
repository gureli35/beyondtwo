# Beyond2C Platform

🌍 **Climate action platform connecting Generation Z with local governments** 

🚀 **Now live on GitHub Pages!**

## 🚀 Live Demo

- **GitHub Pages:** [https://gureli35.github.io/beyond2c-test](https://gureli35.github.io/beyond2c-test)

## 🌟 Features

- ✅ **Fully Bilingual** - Turkish/English (Default: English)
- ✅ **Responsive Design** - Works on all devices  
- ✅ **SEO Optimized** - Meta tags, schema markup
- ✅ **Fast Loading** - Static export, optimized assets
- ✅ **Climate Data** - Real-time climate statistics
- ✅ **Interactive Map** - Community actions and events
- ✅ **Youth Stories** - Climate activism voices
- ✅ **Admin Panel** - Comprehensive content management system
- ✅ **Blog Management** - Rich text editor with markdown support
- ✅ **User Management** - Role-based access control
- ✅ **Analytics Dashboard** - Real-time statistics and charts

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Chart.js + React Chart.js 2
- **Rich Text Editor:** @uiw/react-md-editor
- **Deployment:** GitHub Pages (Static Export)
- **Admin Panel:** React 19 + TypeScript
- **Security:** AES Encryption for sensitive data
- **Email Service:** Resend API

## 🔐 Security Features

- **🔒 Encrypted Environment Variables** - All API keys and sensitive data are AES encrypted
- **🛡️ Secure API Routes** - Protected endpoints with proper error handling
- **🔑 JWT Authentication** - Secure token-based authentication
- **📧 Contact Form Security** - Encrypted email delivery with Resend API
- **🌐 MongoDB Security** - Encrypted database connection strings

📖 **For detailed security documentation:** [ENCRYPTION_SECURITY_GUIDE.md](./ENCRYPTION_SECURITY_GUIDE.md)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/USERNAME/beyond2c-platform.git
cd beyond2c-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌍 Language Support

- **Default:** English
- **Switcher:** Top-right corner
- **Full i18n:** All UI elements translated

## 📦 Deployment Options

### GitHub Pages (Recommended for Demo)
1. Fork this repository
2. Enable GitHub Pages in repository Settings
3. Select "GitHub Actions" as source
4. Push to main branch - auto-deploy

### cPanel Hosting
1. Run `npm run build`
2. Upload `out/` folder contents to `public_html`
3. Enable SSL certificate

## 📋 Pages

- 🏠 **Home** - Climate crisis overview
- 👥 **About** - Mission and team
- 🚨 **Issues** - Climate impacts
- 🎯 **Take Action** - Get involved
- 🗺️ **Impact Map** - Community actions
- 📚 **Resources** - Educational materials
- 📊 **Data Hub** - Climate statistics
- 📝 **Blog** - Articles and insights
- 🎤 **Voices** - Youth climate stories
- 📞 **Contact** - Get in touch

## 🔧 Configuration

Environment variables (optional):
```env
MAPBOX_TOKEN=your_mapbox_token
FIREBASE_CONFIG=your_firebase_config
```

## 🔧 Admin Panel

The platform includes a comprehensive admin panel for content management:

### 📊 Dashboard Features
- **Overview Dashboard** - Statistics cards, charts, and activity logs
- **Blog Management** - Create, edit, delete, and manage blog posts
- **User Management** - User roles, permissions, and account management
- **Comment Moderation** - Approve, reject, and manage user comments
- **Analytics** - Detailed site analytics with interactive charts

### 🚀 Access Admin Panel
- **Local Development:** `http://localhost:3000/admin`
- **Live Demo:** Access through admin login

### 📝 Blog Editor Features
- **Rich Text Editor** - Markdown support with live preview
- **Image Upload** - Drag & drop image functionality
- **SEO Optimization** - Meta descriptions, tags, and slug management
- **Draft/Publish** - Save drafts and publish when ready
- **Categories & Tags** - Organize content with categories and tags

### 👥 User Management
- **Role-based Access** - Admin, Editor, Author, Subscriber roles
- **User Profiles** - Manage user information and preferences
- **Activity Logging** - Track user actions and changes
- **Permission System** - Granular permission control

### 📈 Analytics Dashboard
- **Real-time Charts** - Page views, user engagement, traffic sources
- **Performance Metrics** - Site speed, conversion rates, bounce rates
- **Content Analytics** - Most popular posts, user engagement patterns
- **Export Reports** - Download analytics data for further analysis

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/name`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for climate action**
