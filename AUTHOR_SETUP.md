# Thesis Review Setup - Author Guide

## Quick Setup for "After Cognition: Human Value in the Age of Irreducibility" Review

### 🚀 **Quick Commands**

#### 1. Start Preview Server
```bash
quarto preview
```
*Opens local preview at http://localhost:3241*

#### 2. Deploy to GitHub Pages
```bash
./deploy.sh
```
*Automated deployment script*

#### 3. Manual Deployment
```bash
quarto render
git add .
git commit -m "Update thesis content"
git push
quarto publish gh-pages --no-browser
```

---

## 📋 **Pre-Review Checklist**

### **Before Sharing with Supervisors:**
- [ ] All content is current and complete
- [ ] Quarto builds without errors
- [ ] Hypothesis commenting is enabled
- [ ] GitHub Pages deployment successful
- [ ] All internal links work
- [ ] PDF and Word exports function
- [ ] Review guide is customized and complete

### **Technical Verification:**
```bash
# Test local build
quarto preview

# Check for errors
quarto check

# Test deployment
quarto publish gh-pages --no-browser
```

---

## 📨 **Sharing with Supervisors**

### **Email Template:**
```
Subject: Thesis Review Access - "After Cognition: Human Value in the Age of Irreducibility"

Dear [Supervisor Name],

I'm pleased to share my thesis "After Cognition: Human Value in the Age of Irreducibility" for your review.

**Access Information:**
- Online Version: https://[your-username].github.io/after-cognition/
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

### **Required Attachments:**
1. `REVIEW_GUIDE.md` - Comprehensive reviewer instructions
2. PDF version (if requested)
3. Any specific questions or focus areas

---

## 🔄 **Daily Workflow**

### **Writing Session:**
```bash
# Start preview
quarto preview

# [Write content in .qmd files]

# Quick commit
git add .
git commit -m "Add [description of changes]"
git push
```

### **Weekly Deployment:**
```bash
./deploy.sh
```

### **Major Updates:**
```bash
# Full rebuild and deploy
quarto clean
quarto render
./deploy.sh

# Notify supervisors of significant changes
```

---

## 📊 **Monitoring Reviews**

### **Checking Comments:**
1. Visit your GitHub Pages site
2. Look for Hypothesis comment indicators
3. Read and respond to feedback
4. Track comments in a spreadsheet or document

### **Responding to Feedback:**
- Use Hypothesis replies for clarifications
- Email for scheduling discussions
- Update content based on feedback
- Track revisions systematically

---

## 🆘 **Common Issues**

### **Build Errors:**
```bash
# Clear cache and rebuild
quarto clean
quarto render

# Check dependencies
quarto check
```

### **Deployment Issues:**
```bash
# Force GitHub Pages rebuild
git commit --allow-empty -m "Force rebuild"
git push
quarto publish gh-pages --no-browser
```

### **Comments Not Working:**
1. Check `hypothesis: true` in `_quarto.yml`
2. Clear browser cache
3. Test in incognito mode
4. Verify site accessibility

---

## 📈 **Success Metrics**

### **Technical:**
- ✅ Site loads quickly
- ✅ Comments work reliably
- ✅ All formats export successfully
- ✅ No broken links or references

### **Review Process:**
- ✅ Supervisors can access and navigate
- ✅ Comments are being added
- ✅ Feedback is specific and actionable
- ✅ Timeline stays on track

---

## 📚 **Quick Reference**

### **Important URLs:**
- GitHub Repository: `https://github.com/[username]/after-cognition`
- GitHub Pages Site: `https://[username].github.io/after-cognition/`
- Hypothesis: `https://web.hypothes.is/`

### **Key Files:**
- `_quarto.yml` - Configuration
- `index.qmd` - Home page
- `parts/*.qmd` - Chapter content
- `resources/` - Bibliography and assets
- `REVIEW_GUIDE.md` - Supervisor instructions

### **Useful Commands:**
```bash
# Preview locally
quarto preview

# Render without preview
quarto render

# Clean output
quarto clean

# Check for issues
quarto check

# Deploy to GitHub Pages
quarto publish gh-pages
```

---

## 🎯 **Best Practices**

1. **Regular Commits**: Commit changes frequently with meaningful messages
2. **Backup Everything**: Keep local backups of all work
3. **Test Before Sharing**: Always verify builds before sending to supervisors
4. **Document Changes**: Track revisions and responses to feedback
5. **Monitor Engagement**: Check for comments regularly and respond promptly
6. **Stay Organized**: Keep clear records of feedback and revision progress

---

**Good luck with your thesis review process!** 🚀

*This guide provides everything you need to successfully manage the review process for "After Cognition: Human Value in the Age of Irreducibility."*
