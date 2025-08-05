# After Cognition: Human Value in the Age of Irreducibility

## 🎓 Secure Thesis Review System

A modern, password-protected thesis platform built with **Quarto**, **Supabase Authentication**, and **GitHub Pages**. This system provides enterprise-grade security for academic document review while maintaining a beautiful, responsive reading experience.

---

## 🌟 Features

### 🔐 **Authentication & Security**
- **Magic Link Authentication** - No passwords required, secure email-based login
- **Role-Based Access Control** - Admin, Reviewer, and Guest permission levels
- **Row Level Security (RLS)** - Database-level protection for all user data
- **Audit Logging** - Complete tracking of all access attempts and activities
- **Session Management** - Secure token handling with automatic refresh

### 📖 **Thesis Platform**
- **Beautiful Reading Experience** - Clean, academic typography optimized for long-form reading
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Fast Loading** - Static site generation for optimal performance
- **Search Functionality** - Built-in search across thesis content
- **Navigation** - Intuitive chapter-based navigation system

### 🛠 **Technical Excellence**
- **Static Site Generation** - Built with Quarto for optimal performance
- **Modern Architecture** - Supabase backend with JavaScript frontend
- **GitHub Pages Deployment** - Automatic deployment and hosting
- **TypeScript Support** - Type-safe development environment
- **Scalable Design** - Ready for multiple theses and additional features

---

## 🚀 Quick Start

### Prerequisites
- Git
- Node.js (v18+)
- Supabase account
- GitHub account

### 1. Clone Repository
```bash
git clone https://github.com/Magnussmari/after-cognition-thesis.git
cd after-cognition-thesis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open **SQL Editor**
3. Copy and run the contents of `supabase/migrations/20250110_initial_schema.sql`

### 4. Create Admin Account
In Supabase SQL Editor, run:
```sql
-- Replace with your email
UPDATE public.profiles SET role = 'admin' WHERE email = 'your.email@example.com';
INSERT INTO public.thesis_access (user_id, thesis_id, access_level, granted_by)
SELECT id, 'after-cognition', 'admin', id FROM public.profiles WHERE email = 'your.email@example.com';
```

### 5. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 6. Deploy
```bash
# Build the site
quarto render

# Deploy to GitHub Pages (automated via Actions)
git add .
git commit -m "Deploy thesis"
git push origin main
```

---

## � Project Structure

```
after-cognition-thesis/
├── 📖 Thesis Content
│   ├── parts/                    # Thesis chapters
│   │   ├── 00-frontmatter.qmd   
│   │   ├── 01-prologue.qmd      
│   │   ├── 02-introduction.qmd   
│   │   └── ...                  
│   ├── resources/               # Bibliography & assets
│   │   ├── astros_references_complete.bib
│   │   └── graphics/            
│   └── _quarto.yml             # Quarto configuration
│
├── 🔐 Authentication System
│   ├── docs/                   # Generated site + auth
│   │   ├── auth.html          # Login page
│   │   ├── auth-callback.html # Auth handler
│   │   ├── index.html         # Protected entry point
│   │   └── index-original.html # Original thesis
│   ├── src/                   # TypeScript source
│   │   ├── lib/supabase/      # Supabase clients & types
│   │   ├── middleware/        # Auth middleware
│   │   └── app/auth/          # Auth routes
│   └── supabase/              # Database schema
│       └── migrations/        
│
├── ⚙️ Configuration
│   ├── .env.local            # Environment variables
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript config
│   ├── next.config.js        # Next.js config
│   └── middleware.ts         # Auth middleware
│
└── 📚 Documentation
    ├── README.md             # This file
    ├── IMPLEMENTATION_COMPLETE.md
    ├── MANUAL_SETUP.md       
    └── AUTHOR_SETUP.md       
```

---

## 🔐 Authentication Flow

### For New Users
1. **Visit Thesis** → Redirected to login page
2. **Enter Email** → Receive magic link
3. **Click Link** → Authenticated & redirected to thesis
4. **Access Granted** → Based on assigned permissions

### For Admins
1. **Full Access** → No restrictions
2. **User Management** → Grant/revoke access via Supabase Dashboard
3. **Audit Logs** → View all access attempts and activities

### Security Features
- **Magic Links** → No passwords to compromise
- **Row Level Security** → Database-level access control
- **Session Tokens** → Secure, auto-refreshing authentication
- **Role-Based Permissions** → Granular access control
- **Audit Trail** → Complete activity logging

---

## 👥 User Roles & Permissions

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Admin** | Full access, user management, audit logs | Thesis author, supervisors |
| **Reviewer** | Read + comment permissions | External reviewers, committee members |
| **Guest** | Read-only access | General access, limited review |

### Managing User Access

#### Grant Access (via Supabase Dashboard)
```sql
-- Grant reviewer access
INSERT INTO public.thesis_access (user_id, thesis_id, access_level, granted_by)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'reviewer@university.edu'),
  'after-cognition',
  'reviewer',
  auth.uid();
```

#### Revoke Access
```sql
-- Revoke access
UPDATE public.thesis_access 
SET is_active = false 
WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'user@example.com');
```

#### Set Expiration
```sql
-- Set 30-day access
UPDATE public.thesis_access 
SET expires_at = now() + interval '30 days'
WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'user@example.com');
```

---

## 🛠 Development Guide

### Local Development
```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Building Thesis
```bash
# Render Quarto site
quarto render

# Preview locally
quarto preview
```

### Database Management
```bash
# Reset database (local development)
npm run supabase:reset

# Generate TypeScript types
npm run supabase:types

# Apply migrations
npm run supabase:migrate
```

### Adding New Content
1. **Create new chapter** in `parts/`
2. **Update `_quarto.yml`** to include new chapter
3. **Add to navigation** if needed
4. **Render and deploy**

---

## 🚀 Deployment

### Automatic Deployment
- **Push to main** → GitHub Actions builds and deploys
- **Live at:** `https://magnussmari.github.io/after-cognition-thesis/`

### Manual Deployment
```bash
# Build site
quarto render

# Commit changes
git add docs/
git commit -m "Update thesis content"
git push origin main
```

### Environment Variables (Production)
Set in GitHub repository settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 📊 Analytics & Monitoring

### Access Analytics (via Supabase Dashboard)
```sql
-- Daily access counts
SELECT 
  DATE(created_at) as date,
  COUNT(*) as access_count
FROM public.audit_log 
WHERE action = 'access_thesis'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- User activity summary
SELECT 
  p.email,
  p.role,
  COUNT(al.id) as total_accesses,
  MAX(al.created_at) as last_access
FROM public.profiles p
LEFT JOIN public.audit_log al ON p.id = al.user_id
GROUP BY p.id, p.email, p.role
ORDER BY total_accesses DESC;
```

### Security Monitoring
```sql
-- Failed access attempts
SELECT * FROM public.audit_log 
WHERE details->>'status' = 'failed'
ORDER BY created_at DESC;

-- Unusual access patterns
SELECT 
  user_id,
  ip_address,
  COUNT(*) as access_count,
  MIN(created_at) as first_access,
  MAX(created_at) as last_access
FROM public.audit_log
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id, ip_address
HAVING COUNT(*) > 50;
```

---

## 🔧 Customization

### Styling
- **Modify `docs/auth.html`** for login page styling
- **Update Quarto theme** in `_quarto.yml`
- **Custom CSS** in `resources/` directory

### Authentication
- **Add OAuth providers** in Supabase Dashboard
- **Customize email templates** in Supabase Auth settings
- **Modify access checks** in auth middleware

### Features
- **Add commenting system** using Supabase database
- **File uploads** with Supabase Storage
- **Real-time collaboration** with Supabase Realtime
- **Email notifications** with Supabase Edge Functions

---

## 🆘 Troubleshooting

### Common Issues

#### Authentication Not Working
```bash
# Check environment variables
cat .env.local

# Verify Supabase connection
npm run supabase:test
```

#### Database Connection Issues
1. Check Supabase project status
2. Verify RLS policies are applied
3. Ensure user has proper role assignment

#### Build Failures
```bash
# Clean build
rm -rf docs/
quarto render

# Check for missing dependencies
npm install
```

### Support Resources
- **GitHub Issues:** [Report bugs and request features](https://github.com/Magnussmari/after-cognition-thesis/issues)
- **Supabase Docs:** [Authentication](https://supabase.com/docs/guides/auth) | [RLS](https://supabase.com/docs/guides/auth/row-level-security)
- **Quarto Docs:** [Books](https://quarto.org/docs/books/) | [Publishing](https://quarto.org/docs/publishing/)

---

## 📄 License & Citation

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Citation
```bibtex
@phdthesis{aftercognition2025,
  title={After Cognition: Human Value in the Age of Irreducibility},
  author={[Author Name]},
  year={2025},
  school={[University Name]},
  url={https://magnussmari.github.io/after-cognition-thesis/}
}
```

---

## 🙏 Acknowledgments

- **Quarto** - For excellent academic publishing tools
- **Supabase** - For robust backend-as-a-service platform
- **GitHub Pages** - For reliable static site hosting
- **TypeScript** - For type-safe development

---

## 📈 Roadmap

### Version 2.0 (Planned)
- [ ] **Commenting System** - Inline thesis comments
- [ ] **Version Control** - Track thesis revisions
- [ ] **Export Options** - PDF, EPUB, Word formats
- [ ] **Admin Dashboard** - Web-based user management
- [ ] **Email Notifications** - Access requests and updates

### Version 3.0 (Future)
- [ ] **Multi-Thesis Support** - Platform for multiple documents
- [ ] **Collaboration Tools** - Real-time editing and review
- [ ] **Advanced Analytics** - Reading patterns and engagement
- [ ] **Integration APIs** - Connect with institutional systems

---

**Built with ❤️ for academic excellence and secure scholarly communication.**

The thesis investigates how generative AI's commoditization of cognitive labor transforms rather than destroys human value. The central argument is the **Value Concentration Hypothesis**: as AI handles computable tasks, economic and existential value concentrates in three irreducible human domains:

1. **Presence** (embodied intelligence)
2. **Cohesion** (intersubjective bonds)  
3. **Meaning** (narrative identity)

The investigation employs the **Ástrós Paradox**: using AI to map its own limits, revealing where human value becomes most concentrated and precious.

---

## 📁 **Project Structure**

```
after_cognition/
├── README.md                      # This file
├── _quarto.yml                    # Main project configuration
├── index.qmd                      # Book entry point with abstract
├── parts/                         # Modular chapter files
│   ├── 00-frontmatter.qmd         # Dedication & epigraph
│   ├── 01-prologue.qmd            # The Axiological Engineer
│   ├── 02-introduction.qmd        # Introduction & framework
│   ├── 03-part-i.qmd              # Economic imperative
│   ├── 04-part-ii.qmd             # Lifeworld cartography  
│   ├── 05-part-iii.qmd            # Value concentration gradient
│   ├── 06-part-iv.qmd             # Paradoxical method
│   ├── 07-conclusion.qmd          # Practical guide & epilogue
│   └── 08-appendices.qmd          # Baruchello Loop & protocols
├── resources/                     # Supporting files
│   ├── astros_references_complete.bib  # Complete bibliography (426 entries)
│   └── apa-7.csl                  # APA 7th edition citation style
└── _book/                         # Generated output (created after rendering)
```

---

## 🚀 **Quick Start**

### Prerequisites
- **Quarto** (latest version): [Install here](https://quarto.org/docs/get-started/)
- **LaTeX** distribution (for PDF output): TeX Live, MiKTeX, or TinyTeX
- **R or Python** (optional, for computational content)

### Building the Book

```bash
# Navigate to the after cognition directory
cd after_cognition/

# Render the entire book (HTML + PDF)
quarto render

# Render specific format only
quarto render --to html    # Web version
quarto render --to pdf     # PDF version

# Preview during development
quarto preview             # Live preview with auto-refresh
```

### Output Locations
- **HTML**: `docs/index.html` (interactive web version for GitHub Pages)
- **PDF**: `docs/After-Cognition.pdf` (print-ready academic format)

### 🌐 **Thesis Review System**

This edition includes a complete thesis review system with:

- **📱 GitHub Pages Deployment**: Professional web hosting for easy sharing
- **💬 Hypothesis Integration**: Interactive commenting for supervisor feedback
- **🚀 Automated Deployment**: One-click publishing with `./deploy.sh`
- **📋 Review Documentation**: Complete guides for reviewers and supervisors

#### Quick Deployment
```bash
# Deploy to GitHub Pages (one-time setup required)
./deploy.sh
```

#### For Reviewers
See `REVIEW_GUIDE.md` for complete instructions on using the interactive commenting system.

---

## ✏️ **Editing Guide**

### For LLM-Assisted Editing

Each part file is optimized for AI collaboration:

1. **Choose a specific part** (e.g., `parts/04-part-ii.qmd`)
2. **Load the file into your LLM** (200-500 lines each)
3. **Request specific improvements**:
   - "Improve the clarity of the argument in Domain I"
   - "Strengthen the transitions between sections"
   - "Add more concrete examples for the LVDI framework"
   - "Polish the writing style while preserving academic rigor"

### File-by-File Content Guide

| File | Content | Lines | Best for LLM Tasks |
|------|---------|-------|-------------------|
| `00-frontmatter.qmd` | Dedication, epigraph | ~50 | Style refinement |
| `01-prologue.qmd` | Personal narrative, stakes | ~200 | Storytelling, voice |
| `02-introduction.qmd` | Framework overview | ~150 | Clarity, structure |
| `03-part-i.qmd` | Economic analysis | ~300 | Data integration, examples |
| `04-part-ii.qmd` | Phenomenological mapping | ~400 | Philosophical precision |
| `05-part-iii.qmd` | Economic modeling | ~350 | Technical accuracy |
| `06-part-iv.qmd` | Practical frameworks | ~450 | Implementation details |
| `07-conclusion.qmd` | Synthesis, implications | ~250 | Vision articulation |
| `08-appendices.qmd` | Technical protocols | ~300 | Methodological precision |

### Collaborative Editing Workflow

1. **Choose your section** based on expertise/interest
2. **Create a branch** (if using Git) or work directly
3. **Edit the `.qmd` file** using any text editor
4. **Test locally** with `quarto render`
5. **Share changes** for review

---

## 📖 **Content Overview**

### Part I: The Economic Imperative
- Generative AI as general-purpose technology
- The commoditization crisis in cognitive labor
- Zero-marginal cost economics for thought

### Part II: Lifeworld Cartography  
- Phenomenological foundations (Husserl, Merleau-Ponty)
- Three domains of irreducible value
- Empirical validation through psychedelic research

### Part III: Value Concentration Gradient
- Economic modeling of value migration
- The Life-Value Development Index (LVDI)
- Market mechanisms for the irreducible

### Part IV: Paradoxical Method
- AI-assisted cartography of limits
- Measurement frameworks and validation
- Cultivation protocols for development

---

## 🔧 **Technical Features**

### Quarto Configuration
- **Book format** with professional styling
- **Cross-references** between chapters
- **Bibliography** with APA 7th edition formatting
- **Callout boxes** for key concepts
- **Mathematical notation** and diagrams
- **Responsive HTML** and print-ready PDF

### Special Elements
- **LaTeX integration** for complex diagrams
- **Color-coded domains** (Presence, Cohesion, Meaning)
- **Interactive callouts** with definitions
- **Autoethnographic vignettes** 
- **Empirical tables** and frameworks

---

## 📊 **Key Frameworks & Tools**

### The Life-Value Development Index (LVDI)
Measurement framework for irreducible capacities:
- **Presence subscale**: Embodiment, mortality integration, attention
- **Cohesion subscale**: Trust, reciprocity, collective resonance  
- **Meaning subscale**: Narrative coherence, growth from adversity, awe

### The Paradoxical Method
Three-phase investigation:
1. **AI-assisted cartography** of computational limits
2. **Empirical validation** through discriminative indicators
3. **Cultivation protocols** for systematic development

### Emotional Prompting Protocol
Practical technique for axiological steering of AI systems using explicit emotional states as control parameters.

---

## 🎯 **Target Audiences**

### Primary Readers
- **Researchers** in AI ethics, human-computer interaction, phenomenology
- **Policymakers** grappling with AI's societal implications
- **Educators** designing curricula for the AI age
- **Practitioners** working at the human-AI interface

### Secondary Applications
- **Organizational development** (human-AI complementarity)
- **Personal development** (cultivation of irreducible capacities)
- **Economic modeling** (value concentration in automation)
- **Philosophical inquiry** (nature of human uniqueness)

---

## 🔄 **Version History**

- **v1.0** (July 30, 2025): Original monolithic thesis (1,482 lines)
- **v2.0** (August 5, 2025): After Cognition edition with modular structure

---

## 📝 **Citation**

```
Smárason, M. S. (2025). After cognition: Human value in the age of irreducibility 
- The Ástrós Paradox [Doctoral thesis]. University of Akureyri.
```

---

## 🤝 **Contributing**

### Feedback Welcome
- **Conceptual clarity**: Are the arguments well-structured?
- **Empirical rigor**: Do the frameworks need strengthening?
- **Practical application**: Are the protocols actionable?
- **Writing quality**: Is the prose engaging and precise?

### Improvement Areas
- Additional empirical validation for LVDI
- Cross-cultural perspectives on irreducibility
- More concrete implementation examples
- Enhanced measurement protocols

---

## ⚠️ **Important Notes**

### Academic Integrity
- This is theoretical work requiring empirical validation
- LVDI and protocols are proposals, not validated instruments
- Claims about irreducibility are architecturally bounded (current AI systems)

### Ethical Considerations
- **No ranking humans**: LVDI for cultivation, not classification
- **Privacy protection**: Relational metrics need careful safeguards
- **Cultural sensitivity**: Framework emerges from Western phenomenology

### Future Development
- Empirical studies needed for validation
- Cross-cultural adaptation required
- Longitudinal research for cultivation protocols

---

## 📞 **Contact**

**Author**: Magnús Smári Smárason  
**Institution**: University of Akureyri, Iceland  
**Date**: July 30, 2025

For questions about the thesis, collaboration opportunities, or access to frameworks, please contact the author.

---

## 🎨 **Technical Notes**

### Custom Styling
The book uses custom LaTeX packages for:
- **TikZ diagrams** with three-domain visualization
- **CMYK color definitions** for print quality
- **Academic formatting** with proper spacing and headers

### Build Requirements
- Minimum Quarto version: 1.4+
- LaTeX packages: tikz, xcolor, booktabs, fancyhdr
- Font requirements: Standard LaTeX fonts or specified alternatives

---

*"We are the guardians at the gate."* - Final words of the thesis, capturing the human responsibility to preserve what makes us irreducibly valuable in an age of artificial intelligence.
