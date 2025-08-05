Parse and sync all Quarto thesis content to the database.

Read supabase-thesis-plan/04-CONTENT-PIPELINE.md for specifications.

Process all content from the parts/ directory:
1. Parse Quarto HTML files preserving formatting
2. Extract chapters and sections with metadata
3. Preserve citations, cross-references, and figures
4. Calculate reading times and word counts
5. Upload everything to Supabase
6. Update search vectors
7. Verify all content is searchable

Show progress as you process each chapter.

Test that content displays correctly.

Arguments: $ARGUMENTS
