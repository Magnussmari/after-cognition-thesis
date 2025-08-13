# After Cognition: Visual Companion

This directory contains a standalone Quarto book with all visual elements (tables, figures, diagrams) from the main "After Cognition" manuscript.

## Purpose

The visual companion was created to:
1. Provide better rendering quality for complex tables and figures
2. Allow easy extraction of visual elements for presentations
3. Create a quick reference guide for key frameworks and data
4. Enable separate formatting optimized for visual content

## Structure

```
visuals-book/
├── _quarto.yml          # Quarto configuration
├── index.qmd            # Preface/introduction
├── part-i-visuals.qmd   # Economic tables and data
├── part-ii-visuals.qmd  # Three Domains framework
├── part-iii-visuals.qmd # LVDC and market cases
├── part-iv-visuals.qmd  # Implementation frameworks
├── appendix-visuals.qmd # Technical diagrams
├── styles.css           # Custom styling
├── images/              # High-quality image files
└── _book/              # Rendered output (after building)
```

## Building the Book

To render the visual companion:

```bash
cd visuals-book
quarto render
```

This will create HTML and PDF versions in the `_book` directory.

## Visual Elements Included

### Part I
- Economic comparison table (SaaS vs AI)
- Stratified displacement data

### Part II  
- Three Domains Venn diagram
- Domains summary table with indicators

### Part III
- Market case comparisons (concerts, therapy)
- LVDC sample items tables
- Democratic cultivation practices table

### Part IV
- Monitor vs Treater framework
- Implementation case studies
- Three-tiered political strategy

### Appendix
- Paradoxical method diagram
- Psychometric validation requirements
- Economic model parameters
- Methodological transparency table

## Usage Notes

1. **For Presentations**: All images are available in the `images/` folder in SVG format
2. **For Analysis**: Tables are formatted for easy copying and further analysis
3. **For Reference**: Use the table of contents to quickly find specific visuals

## Technical Details

- Built with Quarto 1.3+
- Optimized for both HTML and PDF output
- Responsive design for mobile viewing
- Print-friendly CSS included
- Mermaid diagrams for flowcharts

## Contributing

To add new visuals:
1. Add the content to the appropriate .qmd file
2. Place any new images in the `images/` folder
3. Update this README with the new content
4. Rebuild using `quarto render`