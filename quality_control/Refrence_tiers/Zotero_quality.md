# Source Quality Assessment Framework for Zotero

## Quality Assessment Dimensions

### 1. **Authority & Credibility Score (0-30 points)**

#### Author Credentials (0-10 points)
- **10 points**: Leading expert with extensive publication record in field
- **8 points**: Established researcher with relevant PhD and publications
- **6 points**: Academic or professional with relevant expertise
- **4 points**: Industry practitioner or journalist with demonstrated knowledge
- **2 points**: Some relevant background but limited expertise
- **0 points**: No author listed or credentials unclear

#### Publisher/Source Reputation (0-10 points)
- **10 points**: Top-tier peer-reviewed journal (Impact Factor >5) or prestigious academic press
- **8 points**: Well-regarded peer-reviewed journal or university press
- **6 points**: Specialized academic journal or reputable think tank
- **4 points**: Professional publication or established media outlet
- **2 points**: Self-published but with institutional backing
- **0 points**: Unknown publisher or predatory journal

#### Institutional Affiliation (0-10 points)
- **10 points**: Top research university or leading research institute
- **8 points**: Respected university or government research body
- **6 points**: Regional university or established NGO/think tank
- **4 points**: Industry research division or professional organization
- **2 points**: Independent researcher with verifiable background
- **0 points**: No institutional affiliation or unverifiable

### 2. **Methodological Rigor (0-25 points)**

#### Study Design (0-10 points)
- **10 points**: Systematic review/meta-analysis or large RCT
- **8 points**: Well-designed experimental study or longitudinal research
- **6 points**: Cross-sectional study with solid methodology
- **4 points**: Case study or qualitative research with clear methods
- **2 points**: Opinion piece backed by evidence
- **0 points**: No clear methodology or purely anecdotal

#### Sample Size & Representativeness (0-5 points)
- **5 points**: Large, representative sample with power analysis
- **4 points**: Adequate sample for research question
- **3 points**: Small but appropriate for methodology
- **2 points**: Limited sample with acknowledged limitations
- **0 points**: Unclear or inadequate sample

#### Data Transparency (0-10 points)
- **10 points**: Full data and code publicly available
- **8 points**: Detailed supplementary materials provided
- **6 points**: Clear description of data and methods
- **4 points**: Basic methodology described
- **2 points**: Limited methodological detail
- **0 points**: No transparency about data or methods

### 3. **Currency & Relevance (0-15 points)**

#### Publication Date (0-10 points)
- **10 points**: Published within last 2 years
- **8 points**: Published within 3-5 years
- **6 points**: Published within 6-10 years
- **4 points**: Published within 11-15 years
- **2 points**: Historical importance (classic work)
- **0 points**: Outdated without historical significance

#### Field Relevance (0-5 points)
- **5 points**: Directly addresses research question
- **4 points**: Highly relevant to topic
- **3 points**: Provides important context
- **2 points**: Tangentially related
- **0 points**: Minimal relevance

### 4. **Impact & Citation Metrics (0-15 points)**

#### Citation Count (relative to field and age) (0-10 points)
- **10 points**: Highly cited (top 10% for field/year)
- **8 points**: Well-cited (top 25% for field/year)
- **6 points**: Moderately cited (above median)
- **4 points**: Some citations
- **2 points**: Few citations but recent publication
- **0 points**: No citations after sufficient time

#### Cross-disciplinary Impact (0-5 points)
- **5 points**: Cited across multiple disciplines
- **3 points**: Cited within related fields
- **1 point**: Cited only within narrow subfield
- **0 points**: No cross-disciplinary impact

### 5. **Bias & Objectivity (0-15 points)**

#### Conflict of Interest (0-5 points)
- **5 points**: No conflicts, full disclosure
- **3 points**: Minor conflicts, properly disclosed
- **1 point**: Significant conflicts disclosed
- **0 points**: Undisclosed conflicts or major bias risk

#### Balanced Perspective (0-5 points)
- **5 points**: Considers multiple viewpoints fairly
- **3 points**: Acknowledges limitations and counterarguments
- **1 point**: Some acknowledgment of alternatives
- **0 points**: One-sided or cherry-picked evidence

#### Peer Review Status (0-5 points)
- **5 points**: Double-blind peer reviewed
- **4 points**: Single-blind peer reviewed
- **3 points**: Editorial review
- **1 point**: Preprint or working paper
- **0 points**: No review process

## Quality Categories

Based on total score (out of 100):

- **Gold Standard (85-100)**: Exceptional sources that should anchor your research
- **High Quality (70-84)**: Reliable sources suitable for primary citations
- **Good Quality (55-69)**: Useful sources with some limitations
- **Acceptable (40-54)**: Use with caution, verify claims
- **Poor Quality (25-39)**: Only for context or opposing viewpoints
- **Unreliable (0-24)**: Avoid or use only to demonstrate poor arguments

## Zotero Implementation Strategy

### Tag System for Quick Assessment

Create these color-coded tags in Zotero:

#### Quality Level Tags
- 🟢 `QA-Gold` (Green) - Score 85-100
- 🔵 `QA-High` (Blue) - Score 70-84
- 🟡 `QA-Good` (Yellow) - Score 55-69
- 🟠 `QA-Fair` (Orange) - Score 40-54
- 🔴 `QA-Poor` (Red) - Score 25-39
- ⚫ `QA-Unreliable` (Black) - Score 0-24

#### Assessment Status Tags
- `QA-Pending` - Needs quality assessment
- `QA-Complete` - Assessment finished
- `QA-Recheck` - Needs updated assessment

#### Special Concern Tags
- `Bias-Risk` - Potential conflict of interest
- `Outdated` - Needs newer source
- `Method-Weak` - Methodological concerns
- `Unverified` - Claims need verification
- `Retracted` - Paper has been retracted

### Quick Assessment Checklist

For efficient evaluation, use this rapid screening:

1. **30-Second Initial Screen**
   - Journal reputation (check Scimago or Impact Factor)
   - Author institutional affiliation
   - Publication year
   - Peer review status

2. **2-Minute Deep Check**
   - Scan methodology section
   - Check funding/conflicts statement
   - Review citation count (Google Scholar)
   - Assess sample size/design

3. **5-Minute Verification** (for key sources)
   - Verify author credentials
   - Check for retractions (Retraction Watch)
   - Cross-reference claims with other sources
   - Evaluate data availability

### Automated Quality Indicators

Add these to Zotero notes for each source:

```
QUALITY ASSESSMENT
==================
Authority Score: __/30
Methodology Score: __/25
Currency Score: __/15
Impact Score: __/15
Objectivity Score: __/15
-------------------
TOTAL: __/100
Category: [Gold/High/Good/Fair/Poor/Unreliable]

Key Strengths:
- 

Limitations:
- 

Best Used For:
- 
```

## Red Flags to Watch For

### Immediate Disqualifiers
- Published in predatory journal (check Beall's List)
- Retracted paper (check Retraction Watch)
- No methodology section in empirical study
- Undisclosed major conflicts of interest
- Fabricated data or plagiarism

### Warning Signs
- Self-citations exceeding 20%
- No citations to opposing viewpoints
- Extraordinary claims without extraordinary evidence
- Statistical errors or p-hacking indicators
- Vague or changing sample sizes

## Source Diversity Audit

Ensure your sources include:

- **Methodological diversity**: Quantitative, qualitative, mixed methods
- **Geographic diversity**: Not just Western/English sources
- **Temporal diversity**: Historical context and recent developments
- **Perspective diversity**: Different theoretical frameworks
- **Publication diversity**: Journals, books, reports, preprints

## Batch Processing Workflow

1. **Weekly Review Session**
   - Process 10-15 new sources
   - Apply quality tags
   - Add assessment notes

2. **Monthly Audit**
   - Review distribution of quality tags
   - Identify gaps needing better sources
   - Remove or replace poor quality sources

3. **Project-Specific Validation**
   - Before writing, filter by quality tags
   - Ensure key claims backed by Gold/High sources
   - Document quality decisions in research log

## Quality Reporting Template

For systematic reviews or theses, document your quality control:

```
Source Quality Summary
======================
Total Sources Assessed: ___
Gold Standard: ___ (___%)
High Quality: ___ (___%)
Good Quality: ___ (___%)
Acceptable: ___ (___%)
Poor/Unreliable: ___ (___%)

Excluded Sources: ___
Reasons for Exclusion:
- Methodological issues: ___
- Outdated: ___
- Bias concerns: ___
- Relevance: ___
```

## Quick Reference Decision Tree

```
Is it peer-reviewed? 
  ├─ No → Is it from reputable institution?
  │        ├─ No → Flag as "QA-Fair" or lower
  │        └─ Yes → Check methodology rigorously
  └─ Yes → Check journal quality
           ├─ Predatory → Tag "QA-Unreliable"
           └─ Legitimate → Full assessment

Is methodology clear?
  ├─ No → Maximum "QA-Fair"
  └─ Yes → Continue full assessment

Are there conflicts of interest?
  ├─ Undisclosed → Reduce score significantly
  └─ Disclosed → Note and continue

Is it current for the topic?
  ├─ No → Is it a seminal work?
  │        ├─ No → Flag "Outdated"
  │        └─ Yes → Note historical importance
  └─ Yes → Continue assessment
```