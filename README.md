# After Cognition: Human Value in the Age of Irreducibility

## 🎓 Dynamic Thesis Platform

A modern, database-driven thesis platform built with **Next.js**, **Supabase**, and **TypeScript**. This system transforms a static Quarto thesis into an interactive reading experience with authentication, progress tracking, and full-text search.

---

## 🌟 Features

### 📖 **Reading Experience**
- **Dynamic Chapter Navigation** - Table of contents with visual progress indicators
- **Section-by-Section Reading** - Smooth navigation between thesis sections
- **Smart Bookmarks** - Create bookmarks with annotations and notes
- **Full-Text Search** - Search across all thesis content with highlighting
- **Reading Progress** - Automatic tracking and resume where you left off
- **Dark Mode** - System-aware theme switching for comfortable reading

### 🔐 **Authentication & Security**
- **Magic Link Authentication** - Secure email-based login with Supabase
- **Row Level Security (RLS)** - Database-level protection for user data
- **Role-Based Access** - Admin, reviewer, and guest permission levels
- **Session Management** - Secure token handling with automatic refresh

### 📊 **Analytics & Tracking**
- **Reading Statistics** - Track time spent, sections read, and completion
- **Progress Visualization** - See your journey through the thesis
- **Reading Sessions** - Automatic session tracking with device info
- **Personal Dashboard** - View your reading habits and achievements

### 🛠 **Technical Excellence**
- **Modern Stack** - Next.js 14, TypeScript, Tailwind CSS
- **Database-Driven** - PostgreSQL via Supabase with full-text search
- **MCP Integration** - Custom Model Context Protocol server for AI operations
- **Content Pipeline** - Automated Quarto HTML parsing and sync
- **Mobile Responsive** - Perfect on all devices with touch support

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase account
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Magnussmari/after-cognition-thesis.git
cd after-cognition-thesis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://axjuevxjcestqhzdgjca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Setup
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/axjuevxjcestqhzdgjca/sql)
2. Copy and run `supabase/migrations/20250115_thesis_schema.sql`

### 5. Sync Content
```bash
npm run sync-content
```

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your thesis platform!

---

## 📁 Project Structure

```
after-cognition-thesis/
├── 📖 Content & Documentation
│   ├── parts/                    # Original Quarto thesis chapters
│   ├── docs/                     # Rendered HTML from Quarto
│   ├── DEPLOYMENT_GUIDE.md       # Step-by-step deployment guide
│   └── CLAUDE.md                 # Project context for AI assistance
│
├── 🎨 Frontend Application
│   └── src/
│       ├── app/                  # Next.js app router pages
│       │   ├── chapters/         # Chapter listing and reading
│       │   ├── bookmarks/        # Bookmark management
│       │   ├── progress/         # Reading analytics
│       │   └── auth/             # Authentication pages
│       ├── components/           # React components
│       │   ├── Navigation.tsx    # Main navigation bar
│       │   ├── ChapterReader.tsx # Core reading experience
│       │   ├── ChapterList.tsx   # Chapter grid with progress
│       │   └── SearchDialog.tsx  # Full-text search interface
│       ├── hooks/                # Custom React hooks
│       ├── types/                # TypeScript definitions
│       └── utils/                # Utility functions
│
├── 🗄️ Backend & Database
│   ├── supabase/
│   │   └── migrations/           # Database schema (PostgreSQL)
│   ├── supabase-thesis-mcp/      # Custom MCP server
│   └── scripts/
│       └── sync-content.js       # Content sync pipeline
│
└── ⚙️ Configuration
    ├── package.json              # Dependencies & scripts
    ├── tsconfig.json             # TypeScript config
    ├── tailwind.config.js        # Tailwind CSS config
    └── next.config.js            # Next.js config
```

---

## 💾 Database Schema

The platform uses a comprehensive PostgreSQL schema:

- **`thesis_metadata`** - Thesis information and metadata
- **`chapters`** - Chapter structure with ordering
- **`sections`** - Section content with full-text search
- **`user_progress`** - Reading progress tracking
- **`bookmarks`** - User bookmarks and annotations
- **`citations`** - Academic references
- **`figures`** - Figure metadata and captions
- **`reading_sessions`** - Session analytics
- **`content_versions`** - Content version history

All tables include proper indexes, RLS policies, and triggers for optimal performance.

---

## 🔧 MCP Server Integration

The project includes a custom Model Context Protocol (MCP) server for AI-powered operations:

### Available Tools
- `create_tables` - Set up database schema
- `sync_content` - Parse and upload content
- `query_content` - Search thesis content
- `setup_search` - Configure full-text search
- `get_analytics` - Retrieve reading statistics
- `check_health` - System health checks

### Usage with Claude Code
```bash
# Start MCP server
cd supabase-thesis-mcp && npm run dev

# Use in Claude Code
"Check system health and sync all thesis content"
```

---

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🎯 Key Features Explained

### Reading Progress System
- Automatically saves your position as you scroll
- Calculates reading time based on content length
- Visual progress indicators on chapter cards
- Resume reading from where you left off

### Smart Bookmarking
- Select any text to create a bookmark
- Add personal notes to bookmarks
- Navigate directly to bookmarked sections
- Export bookmarks for external use

### Full-Text Search
- PostgreSQL full-text search with tsvector
- Real-time search results as you type
- Context preview for each result
- Click to jump directly to content

### Analytics Dashboard
- Total reading time and sessions
- Chapter completion percentages
- Reading velocity trends
- Most-read sections

---

## 📊 Content Pipeline

The platform includes an automated content pipeline:

1. **Quarto Rendering** - Original thesis in Quarto format
2. **HTML Parsing** - Extract structured content from rendered HTML
3. **Content Processing** - Preserve academic formatting, citations
4. **Database Upload** - Store in PostgreSQL with search indexes
5. **Version Control** - Track content changes over time

Run the pipeline:
```bash
npm run sync-content
```

---

## 🔐 Security & Privacy

- **Magic Links** - No passwords to manage or compromise
- **Row Level Security** - Database-level access control
- **Encrypted Sessions** - Secure cookie-based authentication
- **Data Privacy** - User data isolated and protected
- **Audit Logging** - Track all access for security

---

## 🎨 Customization

### Styling
- Tailwind CSS for utility-first styling
- Dark mode with CSS variables
- Typography optimized for academic reading
- Responsive breakpoints for all devices

### Content
- Modify Quarto source in `parts/`
- Run sync pipeline to update
- Content automatically formatted

### Features
- Extend with new components
- Add custom analytics
- Integrate additional tools

---

## 📈 Roadmap

### Version 2.0 (Planned)
- [ ] **AI Assistant** - Chat interface for thesis questions
- [ ] **Collaborative Notes** - Share annotations with reviewers
- [ ] **Export Options** - PDF generation with progress
- [ ] **Citation Manager** - Export references to Zotero/Mendeley
- [ ] **Offline Support** - PWA with service workers

### Version 3.0 (Future)
- [ ] **Multi-Thesis Platform** - Support multiple documents
- [ ] **Real-time Collaboration** - Live cursor and comments
- [ ] **Advanced Analytics** - ML-powered reading insights
- [ ] **API Access** - Public API for researchers

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See `CONTRIBUTING.md` for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Quarto** - For excellent academic publishing tools
- **Supabase** - For the powerful backend platform
- **Next.js** - For the modern React framework
- **Vercel** - For seamless deployment

---

## 📞 Contact

**Author**: Magnús Már Magnússon  
**Institution**: University of Akureyri, Iceland  
**Email**: magnussmari@unak.is

For questions about the platform or thesis content, please contact the author.

---

## 🎯 About the Thesis

**"After Cognition: Human Value in the Age of Irreducibility"**

This thesis investigates how generative AI transforms human value through the **Value Concentration Hypothesis**: as AI handles computable tasks, economic and existential value concentrates in three irreducible human domains:

1. **Presence** (embodied intelligence)
2. **Cohesion** (intersubjective bonds)  
3. **Meaning** (narrative identity)

The platform you're using demonstrates the thesis's core argument - using technology to enhance rather than replace human scholarly work.

---

**Built with ❤️ for the future of academic publishing**