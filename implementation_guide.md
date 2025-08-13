# Implementation Guide: Streamlining Front Matter

## Quick Reference: What Goes Where

### DELETE/MERGE
- `00-executive-summary.qmd` → Convert to 1-page abstract OR move to end
- `00-frontmatter.qmd` → Keep only dedication and epigraph
- "Personal Context and Methodological Standpoint" section → Extract key points for prologue, rest to appendix

### REPLACE WITH NEW VERSIONS
- `01-prologue.qmd` → Replace with `streamlined_prologue.md`
- `02-introduction.qmd` → Replace with `streamlined_introduction.md`

### EDITS NEEDED THROUGHOUT
1. Remove all redundant definitions of three domains
2. Remove repeated explanations of Value Concentration Hypothesis  
3. Remove duplicate methodology justifications
4. Ensure consistent terminology

## Step-by-Step Implementation

### Step 1: Backup Current Version
```bash
cp -r After_cognition After_cognition_backup_[date]
```

### Step 2: Create New Front Matter Structure

1. **New 00-frontmatter.qmd** should contain only:
   - Title page
   - Dedication (keep as is)
   - Epigraph (keep as is)
   - Table of contents

2. **New 01-prologue.qmd**:
   - Copy content from `streamlined_prologue.md`
   - Ensure proper Quarto formatting
   - Should be ~3 pages when rendered

3. **New 02-introduction.qmd**:
   - Copy content from `streamlined_introduction.md`
   - Ensure proper Quarto formatting
   - Should be ~4-5 pages when rendered

### Step 3: Move/Create Appendices

Create new appendix files:
- `appendix-b-personal-journey.qmd` - Extended personal context
- `appendix-c-methodology-detail.qmd` - Detailed operational definitions
- `appendix-d-glossary.qmd` - Key terms and concepts

### Step 4: Update _quarto.yml

```yaml
chapters:
  - index.qmd
  - parts/00-frontmatter.qmd  # Now minimal
  - parts/01-prologue.qmd     # New streamlined version
  - parts/02-introduction.qmd # New streamlined version
  - parts/03-part-i.qmd
  # ... rest of chapters
  - parts/appendix-b-personal-journey.qmd
  - parts/appendix-c-methodology-detail.qmd
  - parts/appendix-d-glossary.qmd
```

### Step 5: Search and Replace Throughout

Use these searches to find redundant content:

1. Search for "Value Concentration Hypothesis" - should appear MAX 3 times total
2. Search for "Presence.*Cohesion.*Meaning" - detailed definitions should appear only once
3. Search for "architectural* irreducib*" - consolidate explanations
4. Search for "5-10 year" - reduce repetition of timeframe

### Step 6: Create One-Page Abstract

```markdown
# Abstract

This thesis examines how artificial intelligence's commoditization of cognitive labor 
paradoxically concentrates human value in irreducible domains: embodied presence, 
intersubjective cohesion, and narrative meaning. Drawing on phenomenology, economics, 
and neuroscience, I develop the Value Concentration Hypothesis and propose a 
Cultivation Economy that systematically develops these irreducible capacities. 
Using frontier AI systems to map their own limitations, the work provides both 
theoretical framework and practical protocols for individuals, organizations, 
and policymakers navigating humanity's AI transformation.

Keywords: artificial intelligence, human value, phenomenology, labor economics, 
irreducibility, cultivation economy
```

## Verification Checklist

- [ ] Total front matter (before Part I) is under 10 pages
- [ ] No concept is defined more than twice
- [ ] Personal narrative appears primarily in prologue
- [ ] Methodological justification is brief and confident
- [ ] Clear progression: emotional hook → conceptual framework → analysis
- [ ] Reader can explain three domains after reading prologue
- [ ] Introduction sets up thesis structure without repetition
- [ ] All cut content is preserved in appendices or backup

## Common Pitfalls to Avoid

1. **Don't just cut** - Ensure smooth transitions between remaining content
2. **Preserve key quotes** - The falling daughter, mother's trust, etc.
3. **Maintain voice consistency** - Keep the urgent, personal tone in prologue
4. **Check citations** - Ensure no broken references after reorganization
5. **Test reader comprehension** - Have someone read just prologue + intro

## Final Quality Check

After implementation, the new structure should:
- Hook reader emotionally (prologue)
- Orient reader conceptually (introduction)  
- Launch into analysis without repetition (Part I)
- Feel urgent and accessible, not defensive or repetitive
- Make reader want to continue, not feel overwhelmed

## Time Estimate

- Initial restructuring: 4-6 hours
- Fine editing and transitions: 2-3 hours
- Final review and polish: 2 hours
- Total: 1-2 working days

The investment will transform the thesis from a repetitive academic document into a compelling, accessible work that honors both its intellectual rigor and human urgency.