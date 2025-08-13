# Quarto Visuals – Source of Truth

This document is the canonical reference for all visual design, rendering, and inclusion standards in the After Cognition Visual Companion. All design decisions, rendering specs, and inclusion patterns are tracked here.

---

## Global Visuals Design Principles

- All figures and diagrams should be rendered as vector PDF (preferred) or high-DPI PNG (fallback).
- Table rendering uses kableExtra or gt for PDF output, with landscape or scale_down as needed.
- Captions should be concise, informative, and placed below figures/tables.
- All visuals should fit within A4 page margins and avoid overflow.
- Text inside diagrams should be 9–10pt for print readability.

---

## Visuals Rendering Specs

| Visual                | Type      | Source File / Chunk         | Output File                  | Dimensions         | Notes                       |
|-----------------------|-----------|-----------------------------|------------------------------|--------------------|-----------------------------|
| Figure 2.1            | Venn      | three-domains-diagram.svg   | figure-2-1-three-domains.pdf | 6.2in × 4.2in      | PDF, vector, 9pt text       |
| Figure 4.1            | Mermaid   | part-iv-visuals.qmd         | figure-4-1-transitional-strategy.pdf | 6.7in × 4.5in      | PDF, landscape if needed    |
| Figure A.1            | Mermaid   | appendix-visuals.qmd        | figure-a-1-paradoxical-method.pdf | 6.2in × 3.8in      | PDF, vector                 |
| Figure A.2            | Pie Chart | appendix-visuals.qmd        | figure-a-2-stratified-risk.pdf | 5.2in × 5.2in      | PDF, square                 |
| Table 3.4             | Table     | part-iii-visuals.qmd        | table-3-4-cost.pdf           | 220px col width    | Rendered as image           |
| Table 3.1a/3.1b/3.1c  | Table     | part-iii-visuals.qmd        | table-3-1a-presence.pdf etc. | 6.2in × 4.2in      | Each as separate PDF        |
| ...                   | ...       | ...                         | ...                          | ...                | ...                         |

---

## Inclusion Pattern

- Figures: `![](images/<file>.pdf){width=100%}`
- Tables (image): `![](images/<table>.pdf){width=100%}`
- Landscape: wrap with `\begin{landscape} ... \end{landscape}`
- All captions: below visual, use `Figure:` or `Table:` prefix

---

## Change Log

- [2025-08-10] Initial creation of source of truth for visuals

---

*Update this file with every design or rendering change. This is the single source of truth for all visuals in the project.*
