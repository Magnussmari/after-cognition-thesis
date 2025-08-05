# Quarto Thesis Review System - Complete Setup Guide

## 🎯 **Overview**

This guide documents the complete process for setting up a professional, interactive thesis review system using Quarto, GitHub Pages, and Hypothesis commenting. Based on the successful setup of "After Cognition: Human Value in the Age of Irreducibility" by Magnús Smári Smárason.

**What This System Provides:**
- ✅ Professional academic book format (HTML, PDF, Word)
- ✅ Interactive online commenting with Hypothesis
- ✅ GitHub Pages deployment for easy sharing
- ✅ Comprehensive reviewer documentation
- ✅ Automated deployment workflows

---

## 📂 **Project Structure Setup**

### **1. Required Directory Structure**
```
your-thesis-project/
├── _quarto.yml                 # Main configuration
├── index.qmd                   # Home page (required!)
├── 00_metadata/
│   ├── references.bib          # Bibliography
│   └── apa-7.csl              # Citation style
├── 01_front_matter/
│   └── frontmatter.qmd        # Dedication, acknowledgments
├── 02_chapters/
│   ├── chapter1.qmd           # Main content chapters
│   ├── chapter2.qmd
│   └── conclusion.qmd
├── 03_back_matter/
│   └── appendices.qmd         # Appendices
├── assets/
│   ├── figures/               # Images and figures
│   └── tables/                # Data tables
└── docs/                      # Output directory (auto-generated)
```

### **2. Essential Files to Create**

#### **A. `_quarto.yml` - Master Configuration**
```yaml
project:
  type: book
  output-dir: docs  # GitHub Pages serves from /docs folder

book:
  title: "Your Thesis Title"
  subtitle: "Your Subtitle"
  author: "Your Name"
  date: "2025"
  
  chapters:
    - index.qmd
    - 01_front_matter/frontmatter.qmd
    - part: "Part I: Your First Part Title"
      chapters:
        - 02_chapters/chapter1.qmd
    - part: "Part II: Your Second Part Title"
      chapters:
        - 02_chapters/chapter2.qmd
    - 02_chapters/conclusion.qmd
    - 03_back_matter/appendices.qmd

bibliography: 00_metadata/references.bib
csl: 00_metadata/apa-7.csl

format:
  html:
    theme: cosmo
    comments:
      hypothesis: true
    # Enhanced HTML configuration for review
    toc: true
    toc-depth: 3
    toc-expand: 2
    number-sections: true
    number-depth: 3
    highlight-style: github
    code-fold: false
    code-tools: true
    smooth-scroll: true
    link-external-icon: true
    link-external-newwindow: true
  pdf:
    documentclass: book
    # Professional PDF configuration
    geometry:
      - top=1in
      - bottom=1in
      - left=1.25in
      - right=1in
    fontsize: 12pt
    linestretch: 1.5
    toc: true
    toc-depth: 3
    number-sections: true
    number-depth: 3
    colorlinks: true
    keep-tex: true
    cite-method: natbib
    include-in-header: |
      \usepackage{fancyhdr}
      \pagestyle{fancy}
      \fancyhead[LE,RO]{\thepage}
      \fancyhead[LO,RE]{Your Thesis Title}
      \fancyfoot[C]{}
  docx:
    # Word document for traditional reviewers
    toc: true
    number-sections: true
    highlight-style: github
```

#### **B. `index.qmd` - Required Home Page**
```markdown
# Your Thesis Title {.unnumbered}

## Your Subtitle

*Your Name*

---

Brief description of your thesis, its main contributions, and structure.

The work is structured in [X] main parts:

- **Part I: [Title]** - Description
- **Part II: [Title]** - Description
- **Part III: [Title]** - Description

---

*2025*
```

#### **C. `.gitignore` - Essential Exclusions**
```gitignore
# Quarto output
docs/
.quarto/

# macOS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes

# LaTeX
*.aux
*.bbl
*.blg
*.fdb_latexmk
*.fls
*.log
*.out
*.synctex.gz
*.toc

# Editor files
.vscode/
*.swp
*.swo

# Environment
.env
.env.local
```

---

## 🛠️ **Step-by-Step Setup Process**

### **Phase 1: Local Quarto Setup**

#### **Step 1: Install Requirements**
```bash
# Install Quarto (if not already installed)
# Download from https://quarto.org/docs/get-started/

# Install required packages
brew install git gh  # GitHub CLI
```

#### **Step 2: Create Project Structure**
```bash
# Create main directory
mkdir your-thesis-project
cd your-thesis-project

# Create subdirectories
mkdir -p 00_metadata 01_front_matter 02_chapters 03_back_matter assets/figures assets/tables

# Create essential files
touch _quarto.yml index.qmd
touch 00_metadata/references.bib 00_metadata/apa-7.csl
touch 01_front_matter/frontmatter.qmd
touch 02_chapters/chapter1.qmd 02_chapters/conclusion.qmd
touch 03_back_matter/appendices.qmd
```

#### **Step 3: Test Local Build**
```bash
# Test that Quarto builds correctly
quarto preview

# Should open browser at localhost:3241
# If errors occur, fix configuration before proceeding
```

### **Phase 2: GitHub Repository Setup**

#### **Step 4: Create GitHub Repository**
```bash
# Initialize git
git init

# Create GitHub repository
gh repo create your-thesis-project --public --description "Your thesis description"

# Connect local to remote
git remote add origin https://github.com/YOUR_USERNAME/your-thesis-project.git

# Initial commit
git add .
git commit -m "Initial thesis setup"
git push -u origin main
```

#### **Step 5: Configure GitHub Pages**
```bash
# Deploy to GitHub Pages
quarto publish gh-pages

# Or manually via GitHub website:
# Repository → Settings → Pages → Source: gh-pages branch
```

### **Phase 3: Documentation Creation**

#### **Step 6: Create Review Documentation**

**A. `REVIEW_GUIDE.md`** (Copy and adapt from template below)
**B. `AUTHOR_SETUP.md`** (Deployment instructions for author)
**C. `GITHUB_PAGES_DEPLOYMENT.md`** (Complete deployment guide)
**D. `QUICK_SETUP.md`** (5-minute reference)

#### **Step 7: Create Deployment Automation**

**`deploy.sh`** script:
```bash
#!/bin/bash
echo "🚀 Deploying thesis to GitHub Pages..."

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    read -p "Enter commit message: " commit_message
    git add .
    git commit -m "${commit_message:-Update thesis content}"
fi

# Deploy
git push
quarto publish gh-pages --no-browser

echo "✅ Deployment complete!"
echo "📖 View at: https://YOUR_USERNAME.github.io/your-thesis-project/"
```

```bash
chmod +x deploy.sh
```

---

## 📋 **Documentation Templates**

### **Template 1: `REVIEW_GUIDE.md`**

```markdown
# [Your Thesis Title] - Review Guide

## For Thesis Reviewers and Supervisors

### Accessing the Thesis
- **Online Version**: https://YOUR_USERNAME.github.io/your-thesis-project/
- **PDF Version**: Available in repository
- **Word Version**: Available on request

### Using Hypothesis Comments
[Copy Hypothesis instructions from master template]

### Review Framework
#### Overall Assessment Areas
1. **Thesis Statement & Core Argument**
   - [Adapt questions to your thesis]
2. **Structure & Organization**
   - [Customize for your parts/chapters]
3. **Theoretical Contributions**
   - [Field-specific questions]
4. **Empirical Evidence**
   - [Methodology-specific questions]
5. **Academic Rigor**
   - [Standard academic criteria]

### Specific Questions for Each Section
[Customize for your thesis structure]

[Copy remaining sections from master template]
```

### **Template 2: `AUTHOR_SETUP.md`**

```markdown
# Thesis Review Setup - Author Guide

## Quick Setup for [Your Thesis Title] Review

### 1. Start Preview Server
```bash
quarto preview
```

### 2. Deploy to GitHub Pages
```bash
./deploy.sh
```

### 3. Share with Reviewers
- URL: https://YOUR_USERNAME.github.io/your-thesis-project/
- Send REVIEW_GUIDE.md
- Add collaborators if private repo

[Copy remaining sections from master template]
```

### **Template 3: Supervisor Email Template**

```markdown
Subject: Thesis Review Access - "[Your Thesis Title]"

Dear [Supervisor Name],

I'm pleased to share my thesis "[Your Thesis Title]" for your review.

**Access Information:**
- Online Version: https://YOUR_USERNAME.github.io/your-thesis-project/
- Interactive Commenting: Hypothesis annotations enabled
- Review Guide: Attached comprehensive instructions

**Key Features:**
- Highlight text and add contextual feedback
- Multiple output formats available
- Cross-references and search functionality

**Timeline:**
- Review period: [Your dates]
- Discussion meeting: [Proposed date]

Please see the attached REVIEW_GUIDE.md for detailed instructions.

Best regards,
[Your Name]
```

---

## 🔧 **Customization Guidelines**

### **Adapting for Different Disciplines**

#### **STEM Theses**
```yaml
# Add to _quarto.yml
format:
  html:
    code-fold: true
    code-tools: true
    fig-cap-location: bottom
    tbl-cap-location: top
  pdf:
    include-in-header: |
      \usepackage{amsmath}
      \usepackage{amsthm}
      \usepackage{amssymb}
```

#### **Humanities Theses**
```yaml
# Add to _quarto.yml
format:
  html:
    citations-hover: true
    footnotes-hover: true
  pdf:
    include-in-header: |
      \usepackage{csquotes}
      \usepackage[style=mla]{biblatex}
```

#### **Social Sciences**
```yaml
# Add to _quarto.yml
format:
  html:
    df-print: paged
    tbl-cap-location: top
  pdf:
    include-in-header: |
      \usepackage{booktabs}
      \usepackage{longtable}
```

### **Citation Styles**
Replace `apa-7.csl` with appropriate style:
- **MLA**: `mla.csl`
- **Chicago**: `chicago-fullnote-bibliography.csl`
- **IEEE**: `ieee.csl`
- **Nature**: `nature.csl`

Download from: https://github.com/citation-style-language/styles

### **Review Questions Customization**

#### **For Theoretical Work**
- Are theoretical frameworks properly grounded?
- Is the logical argumentation sound?
- Are concepts clearly defined and consistently used?

#### **For Empirical Work**
- Are research methods appropriate and well-executed?
- Is data analysis rigorous and properly reported?
- Are limitations adequately discussed?

#### **For Applied Work**
- Are practical applications realistic and well-developed?
- Is implementation feasibility addressed?
- Are policy implications clearly articulated?

---

## 🚦 **Quality Checklist**

### **Before First Deployment**
- [ ] All internal links work correctly
- [ ] Bibliography formats properly
- [ ] Cross-references function
- [ ] Figures and tables display correctly
- [ ] Mobile responsiveness tested
- [ ] All chapters have content (no empty files)

### **Before Sharing with Supervisors**
- [ ] Hypothesis commenting works
- [ ] Multiple output formats generate successfully
- [ ] Review documentation is complete and customized
- [ ] Supervisor access configured (if private repo)
- [ ] Email template prepared and personalized

### **Ongoing Maintenance**
- [ ] Regular commits with meaningful messages
- [ ] Backup of comments and feedback
- [ ] Version control for major revisions
- [ ] Monitor supervisor engagement and respond promptly

---

## 🎯 **Success Metrics**

### **Technical Success Indicators**
- ✅ Site loads quickly on all devices
- ✅ Comments system functions reliably
- ✅ Search and navigation work smoothly
- ✅ PDF generation succeeds without errors

### **Review Process Success Indicators**
- ✅ Supervisors engage with commenting system
- ✅ Feedback is specific and actionable
- ✅ Review timeline stays on track
- ✅ Technical issues don't impede review process

---

## 🔄 **Workflow for Regular Updates**

### **Daily Writing Workflow**
```bash
# Start writing session
quarto preview

# [Write content in .qmd files]

# End of session
git add .
git commit -m "Add [description of changes]"
git push

# Weekly deployment
./deploy.sh
```

### **Review Period Workflow**
```bash
# Monitor comments
# Respond to supervisor questions
# Track feedback in spreadsheet/document

# Major revisions
git add .
git commit -m "Revisions based on [supervisor] feedback"
./deploy.sh
```

---

## 🆘 **Common Issues and Solutions**

### **Quarto Build Errors**
```bash
# Clear cache and rebuild
quarto clean
quarto render

# Check for missing dependencies
quarto check
```

### **GitHub Pages Not Updating**
```bash
# Force rebuild
git commit --allow-empty -m "Force rebuild"
git push
quarto publish gh-pages --no-browser
```

### **Hypothesis Comments Not Working**
1. Check `hypothesis: true` in `_quarto.yml`
2. Clear browser cache
3. Try incognito mode
4. Verify site is accessible

### **Supervisor Access Issues**
1. Verify repository permissions
2. Check GitHub Pages is enabled
3. Test URL accessibility
4. Provide alternative access method (PDF)

---

## 📚 **Resources and References**

### **Official Documentation**
- [Quarto Books](https://quarto.org/docs/books/)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Hypothesis](https://web.hypothes.is/help/)

### **Academic Writing with Quarto**
- [Quarto for Academics](https://quarto.org/docs/get-started/authoring/rstudio.html)
- [Citation Management](https://quarto.org/docs/authoring/footnotes-and-citations.html)
- [Cross-references](https://quarto.org/docs/authoring/cross-references.html)

### **Advanced Customization**
- [Quarto Extensions](https://quarto.org/docs/extensions/)
- [Custom CSS](https://quarto.org/docs/output-formats/html-themes.html)
- [LaTeX Customization](https://quarto.org/docs/output-formats/pdf-engine.html)

---

## 🎓 **Final Notes**

This system has been successfully tested with "After Cognition: Human Value in the Age of Irreducibility" and provides a robust, professional platform for thesis review. The combination of Quarto's publishing capabilities, GitHub's hosting infrastructure, and Hypothesis's annotation tools creates an optimal environment for academic collaboration.

**Key Benefits:**
- **Professional Presentation**: Academic-quality formatting across multiple outputs
- **Interactive Review**: Real-time commenting and discussion
- **Easy Sharing**: Simple URL sharing with supervisors
- **Version Control**: Complete revision history and backup
- **Accessibility**: Works on all devices and platforms

**Success Factors:**
- Clear documentation for all stakeholders
- Reliable technical infrastructure
- Streamlined workflows for updates
- Responsive support for reviewer questions

Adapt this guide to your specific needs, but maintain the core principles of professional presentation, interactive engagement, and comprehensive documentation.

**Good luck with your thesis review process!** 🚀

---

*This guide documents the complete setup process developed for professional thesis review using modern web technologies and academic best practices.*
