# Frontend Design Specification

## 🎨 Design Philosophy

### Core Principles
- **Academic Elegance:** Professional typography and layout that respects scholarly content
- **Reader-First:** Optimized for sustained reading and comprehension
- **Progressive Enhancement:** Rich features that don't distract from content
- **Accessibility:** WCAG 2.1 AA compliance for inclusive access
- **Performance:** Fast, responsive, and efficient across all devices

### Visual Hierarchy
1. **Content First:** Typography and layout prioritize readability
2. **Subtle Navigation:** Interface elements support without overwhelming
3. **Contextual Actions:** Features appear when needed, hidden when not
4. **Academic Conventions:** Familiar patterns from scholarly publishing

## 📱 User Experience Flow

### Reader Journey
```
Login → Table of Contents → Chapter Selection → Reading Experience
  ↓
Progress Tracking → Bookmarks → Search → Advanced Features
```

### Navigation Patterns
- **Primary:** Chapter-based navigation with clear progress
- **Secondary:** Section jumping within chapters
- **Contextual:** Cross-references, citations, footnotes
- **Utility:** Search, bookmarks, settings, profile

## 🖼️ Interface Components

### 1. Authentication Experience
```tsx
// Modern, academic-focused login
interface AuthPageProps {
  title: "After Cognition: Secure Access"
  subtitle: "Human Value in the Age of Irreducibility"
  features: [
    "Secure magic link authentication",
    "No password required",
    "Cross-device synchronization"
  ]
}
```

**Design Specifications:**
- Gradient background (academic blues/purples)
- Clean white card with subtle shadow
- Professional typography (Inter/System fonts)
- Loading states with academic branding
- Error handling with helpful messaging

### 2. Table of Contents
```tsx
interface TableOfContentsProps {
  chapters: Chapter[]
  userProgress: ProgressMap
  estimatedTime: ReadingTimeMap
}

// Visual Elements:
// - Chapter cards with progress rings
// - Reading time estimates
// - Completion badges
// - "Continue Reading" quick access
```

**Features:**
- Progress visualization for each chapter
- Reading time estimates
- Last read position highlighting
- Search integration
- Mobile-optimized layout

### 3. Chapter Reader
```tsx
interface ChapterReaderProps {
  chapter: Chapter
  sections: Section[]
  userProgress: Progress
  bookmarks: Bookmark[]
}

// Layout Structure:
// Header: Chapter title, progress, navigation
// Sidebar: Section navigation (desktop)
// Main: Content with academic formatting
// Footer: Previous/Next navigation
```

**Reading Experience:**
- Typography optimized for long-form reading
- Automatic progress tracking
- Smooth scrolling between sections
- Distraction-free reading mode
- Citation hover previews

### 4. Search Interface
```tsx
interface SearchProps {
  query: string
  results: SearchResult[]
  filters: SearchFilter[]
  suggestions: string[]
}

// Search Features:
// - Full-text search across all content
// - Contextual result previews
// - Advanced filtering options
// - Search history and suggestions
```

## 🎨 Visual Design System

### Typography Scale
```css
/* Academic Typography */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-serif: 'Charter', 'Georgia', serif; /* For body text */
--font-family-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;

/* Scale */
--text-xs: 0.75rem;      /* 12px - captions, metadata */
--text-sm: 0.875rem;     /* 14px - secondary text */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - large body */
--text-xl: 1.25rem;      /* 20px - section headings */
--text-2xl: 1.5rem;      /* 24px - chapter headings */
--text-3xl: 1.875rem;    /* 30px - page titles */
--text-4xl: 2.25rem;     /* 36px - main titles */

/* Reading Optimization */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
```

### Color Palette
```css
/* Academic Color System */
:root {
  /* Primary - Deep Academic Blue */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;

  /* Neutral - Reading Optimized */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;

  /* Academic Accents */
  --color-citation: #7c3aed;
  --color-highlight: #fbbf24;
  --color-note: #06b6d4;
}
```

### Layout System
```css
/* Container Sizes */
--container-sm: 640px;   /* Mobile content */
--container-md: 768px;   /* Tablet content */
--container-lg: 1024px;  /* Desktop content */
--container-xl: 1280px;  /* Wide desktop */
--container-2xl: 1536px; /* Ultra-wide */

/* Reading Widths */
--content-width-narrow: 65ch;  /* Optimal reading line length */
--content-width-medium: 75ch;  /* Comfortable reading */
--content-width-wide: 85ch;    /* Academic papers */

/* Spacing Scale */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
--space-3xl: 4rem;
```

## 📱 Responsive Design Strategy

### Breakpoint System
```css
/* Mobile First Approach */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Device-Specific Optimizations

#### Mobile (320px - 768px)
- Single column layout
- Collapsible navigation
- Touch-optimized interface
- Simplified typography scale
- Bottom navigation bar
- Swipe gestures for page turning

#### Tablet (768px - 1024px)
- Two-column layout option
- Sidebar navigation
- Enhanced typography
- Multi-touch interactions
- Picture-in-picture features

#### Desktop (1024px+)
- Multi-column layout
- Persistent sidebar navigation
- Advanced keyboard shortcuts
- Hover interactions
- Multi-window support

## 🔧 Component Architecture

### Core Components

#### 1. Layout Components
```tsx
// App Shell
<AppLayout>
  <Header />
  <Sidebar />
  <MainContent />
  <Footer />
</AppLayout>

// Reading Layout
<ReadingLayout>
  <ProgressHeader />
  <NavigationSidebar />
  <ContentArea />
  <ControlsFooter />
</ReadingLayout>
```

#### 2. Content Components
```tsx
// Chapter Display
<ChapterReader
  chapter={chapter}
  sections={sections}
  onProgressUpdate={handleProgress}
  bookmarks={bookmarks}
/>

// Section Navigation
<SectionNav
  sections={sections}
  currentSection={currentSection}
  progress={progress}
/>

// Academic Elements
<Citation key={citationKey} />
<Footnote content={footnoteText} />
<CrossReference target={referenceId} />
<Figure src={figureUrl} caption={caption} />
```

#### 3. Interactive Features
```tsx
// Search Interface
<SearchDialog
  onSearch={handleSearch}
  results={searchResults}
  suggestions={suggestions}
/>

// Bookmark System
<BookmarkButton
  section={section}
  position={scrollPosition}
  onBookmark={handleBookmark}
/>

// Progress Tracking
<ProgressIndicator
  current={currentProgress}
  total={totalProgress}
  chapters={chapterProgress}
/>
```

## 🎯 Performance Optimization

### Loading Strategy
- **Critical Path:** Authentication → TOC → First Chapter
- **Lazy Loading:** Non-visible chapters and sections
- **Prefetching:** Next chapter/section content
- **Caching:** Aggressive caching of static content

### Code Splitting
```tsx
// Route-based splitting
const ChapterReader = lazy(() => import('./ChapterReader'))
const SearchDialog = lazy(() => import('./SearchDialog'))
const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'))

// Component-based splitting
const HeavyAcademicComponent = lazy(() => 
  import('./components/AcademicFeatures')
)
```

### Image Optimization
- **Next.js Image:** Automatic optimization and lazy loading
- **SVG Optimization:** Academic diagrams and figures
- **WebP/AVIF:** Modern formats with fallbacks
- **Responsive Images:** Device-appropriate sizing

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Reader:** Semantic HTML and ARIA labels
- **Color Contrast:** 4.5:1 minimum contrast ratios
- **Focus Management:** Clear focus indicators
- **Alternative Text:** Comprehensive image descriptions

### Academic Accessibility
- **Reading Tools:** Font size, line spacing, contrast controls
- **Navigation Aids:** Skip links, landmark regions
- **Content Structure:** Proper heading hierarchy
- **Assistive Technology:** Screen reader optimization for academic content

## 🌙 Dark Mode Support

### Color Scheme
```css
/* Dark Mode Palette */
:root[data-theme="dark"] {
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-border: #334155;
}

/* Automatic Detection */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode as default for system preference */
  }
}
```

### Implementation
- System preference detection
- User preference storage
- Smooth theme transitions
- Academic-friendly dark colors
- Reduced eye strain for long reading sessions

## 📊 User Interface States

### Loading States
- Skeleton screens for content
- Progressive loading indicators
- Graceful degradation
- Offline support messaging

### Error States
- Network error recovery
- Content not found handling
- Authentication error flows
- Retry mechanisms

### Empty States
- First-time user onboarding
- No search results guidance
- Progress tracking initialization
- Bookmark collection setup

---

**Next:** Explore advanced features in `06-ADVANCED-FEATURES.md`
