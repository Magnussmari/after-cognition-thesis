# Claude Flow Academic Quick Reference - VALOR Thesis

## 🎓 Essential Academic Commands

### Research & Analysis
```bash
./claude-flow sparc run ask "research question or topic"          # Literature review & fact-finding
./claude-flow sparc run analyzer "analyze argument structure"     # Logical analysis & critique  
./claude-flow sparc run reviewer "review chapter as examiner"     # Peer review simulation
```

### Writing & Refinement
```bash
./claude-flow sparc run code "improve prose in chapter X"         # Writing enhancement
./claude-flow sparc run architect "analyze thesis structure"      # Structural analysis
./claude-flow sparc run designer "create conceptual diagram"      # Visual aids
```

### Quality Assurance
```bash
./claude-flow sparc run security-review "fact-check claims"       # Verification & validation
./claude-flow sparc run integration "check cross-references"      # Consistency checking
./claude-flow sparc run docs-writer "improve citations"           # Academic formatting
```

## 🔬 VALOR-Specific Workflows

### Value Concentration Hypothesis Work
```bash
# Strengthen core argument
./claude-flow swarm "Refine Value Concentration Hypothesis" \
--agents analyzer,ask,reviewer --parallel

# Supporting evidence
./claude-flow sparc run ask "Find empirical evidence for cognitive task commoditization"
```

### Three Domains Analysis
```bash
# Parallel domain analysis
batchtool run --parallel \
"./claude-flow sparc run analyzer 'Strengthen Presence domain arguments'" \
"./claude-flow sparc run analyzer 'Strengthen Cohesion domain arguments'" \
"./claude-flow sparc run analyzer 'Strengthen Meaning domain arguments'"
```

### Ástrós Paradox Development
```bash
./claude-flow sparc run analyzer "Analyze logical structure of Ástrós Paradox"
./claude-flow sparc run ask "Find examples supporting the Ástrós Paradox"
./claude-flow sparc run code "Improve explanation clarity of Ástrós Paradox"
```

## 📚 Chapter-Specific Commands

### Introduction Enhancement
```bash
./claude-flow sparc run code "Improve reader engagement in parts/02-introduction.qmd"
./claude-flow sparc run reviewer "Review introduction for clarity and impact"
```

### Part Development
```bash
# Part I: Economic Imperative
./claude-flow sparc run ask "Recent research on AI job displacement and economic impacts"

# Part II: Lifeworld Cartography  
./claude-flow sparc run analyzer "Strengthen phenomenological arguments for irreducible domains"

# Part III: Cultivation Architecture
./claude-flow sparc run architect "Develop practical implementation frameworks"

# Part IV: Crisis Integration
./claude-flow sparc run reviewer "Assess synthesis effectiveness in Part IV"
```

## 🧠 Academic Memory Commands

### Store Research Context
```bash
./claude-flow memory store "research-focus" "current research priority"
./claude-flow memory store "key-insight" "important discovery or connection"
./claude-flow memory store "reviewer-feedback" "specific feedback to address"
```

### Query Academic Knowledge
```bash
./claude-flow memory query "phenomenology"      # Find phenomenological content
./claude-flow memory query "economic"           # Find economic arguments
./claude-flow memory query "reviewer"           # Find review feedback
./claude-flow memory query "citations"          # Find citation-related notes
```

## 📊 Multi-Agent Academic Workflows

### Comprehensive Thesis Review
```bash
./claude-flow swarm "Complete thesis quality review" \
--agents reviewer,analyzer,ask --strategy academic-review
```

### Research Gap Analysis
```bash
./claude-flow swarm "Identify and address research gaps" \
--agents ask,analyzer,reviewer --goal "comprehensive coverage"
```

### Defense Preparation
```bash
./claude-flow swarm "Thesis defense preparation" \
--agents reviewer,analyzer,ask --strategy defense-prep
```

## 🔧 Quarto-Specific Commands

### Document Optimization
```bash
./claude-flow sparc run code "Optimize _quarto.yml for better academic output"
./claude-flow sparc run code "Improve cross-referencing in .qmd files"
./claude-flow sparc run devops "Optimize Quarto build and rendering process"
```

### Citation Management
```bash
./claude-flow sparc run code "Standardize citation formats across all chapters"
./claude-flow sparc run docs-writer "Create comprehensive bibliography"
```

## 🎯 Daily Academic Workflows

### Morning Research Session
```bash
# Load yesterday's context
./claude-flow memory query "yesterday"

# Set today's goals
./claude-flow memory store "today-goal" "your daily research objective"

# Start research
./claude-flow sparc run ask "today's research question"
```

### Evening Progress Documentation
```bash
# Document insights
./claude-flow memory store "today-insights" "key discoveries and progress"

# Plan tomorrow
./claude-flow memory store "tomorrow-priorities" "next day's focus areas"

# Save session summary
./claude-flow memory persist --session-summary
```

## 💡 Academic Pro Tips

### 1. Maintain Academic Integrity
- Always fact-check AI-generated content
- Verify citations and sources
- Use AI as research assistant, not replacement

### 2. Leverage Specialized Agents
- `ask` agent for literature review
- `analyzer` agent for argument critique  
- `reviewer` agent for quality assessment
- `architect` agent for structural analysis

### 3. Use Parallel Processing
- Research multiple topics simultaneously
- Analyze different chapters concurrently
- Prepare for various reviewer perspectives

### 4. Build Knowledge Over Time
- Store insights and discoveries in memory
- Query past research before starting new work
- Build comprehensive thesis knowledge base

---

**Academic Excellence Through AI Orchestration** 📚🤖

Transform your thesis work from isolated struggle to coordinated intellectual advancement!

**First Command**: `./claude-flow sparc run analyzer "What are the strongest and weakest arguments in this thesis?"`
