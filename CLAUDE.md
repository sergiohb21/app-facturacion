# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains a professional invoice generator application built with React and TypeScript. It's a comprehensive solution for creating and managing invoices with dynamic models, PDF generation, and statistics tracking.

### Key Features
- **Multi-step Invoice Generation**: 3-step wizard (Model Selection → Date Selection → PDF Generation)
- **Dynamic Model Management**: Create, edit, and delete invoice models with landlord information
- **Professional PDF Generation**: High-quality PDF invoices with jsPDF
- **Statistics Dashboard**: Track invoice generation metrics and history
- **Dark/Light Theme**: Theme toggle with persistent preference
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **PWA Support**: Progressive Web App capabilities
- **Form Validation**: Comprehensive validation for all user inputs
- **Local Storage**: Persistent data storage for models and records

## Development Commands

### Available Scripts
```bash
npm start          # Development server on localhost:3000
npm run build      # Production build to build/ folder
npm test           # Run tests in watch mode
npm run deploy     # Deploy to GitHub Pages
npm run eject      # Eject from Create React App (one-way)
```

### Development Workflow
1. **Development**: `npm start` - Runs on localhost:3000 with hot reload
2. **Building**: `npm run build` - Creates optimized production build in `build/` folder
3. **Testing**: `npm test` - Runs Jest tests with watch mode
4. **Deployment**: `npm run deploy` - Deploys to GitHub Pages using gh-pages

## Architecture Overview

### Framework and Technologies
- **Framework**: Create React App with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **PDF Generation**: jsPDF + jsPDF-autotable
- **State Management**: React useState hooks
- **Build Tool**: Create React App webpack configuration
- **Testing**: Jest + React Testing Library
- **Deployment**: GitHub Pages via gh-pages

### Project Structure
```
src/
├── components/           # Main components
│   ├── ui/              # Shadcn UI components
│   ├── form/            # Form section components
│   └── *.tsx            # Main app components
├── lib/                 # Business logic and utilities
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Main application component
```

### Key Components Architecture

#### Main App Flow
1. **InvoiceTypeSelector** - Step 1: Choose invoice model from available options
2. **DateSelector** - Step 2: Select invoice month/year with calendar picker
3. **InvoiceGenerator** - Step 3: Generate PDF with progress tracking

#### Management Features
- **ModelManagement** - CRUD operations for invoice models
- **InvoiceStats** - Statistics dashboard with charts and metrics
- **ModelForm** - Form for creating/editing invoice models

#### UI Components
- **Shadcn UI** - Modern, accessible UI components
- **Custom Components** - Progress indicators, modals, toasts
- **Form Components** - Validated form sections with error handling

### Core Business Logic

#### Invoice Models (`src/lib/invoiceModels.ts`)
- Default models with industrial, commercial, logistics, and office types
- Dynamic model storage with localStorage persistence
- Automatic tax calculations (IVA, IRPF)
- Landlord information management

#### PDF Generation (`src/lib/pdfGenerator.ts`)
- Professional PDF layout with jsPDF
- Dynamic content based on model data
- Automatic table generation with jsPDF-autotable
- Professional branding and footer

#### Form Validation (`src/lib/formValidation.ts`)
- Comprehensive validation schema for invoice models
- Real-time field validation with error messages
- Nested object validation for landlord information
- Custom validation rules and patterns

## State Management

### Local State
- **React useState**: Component-level state management
- **Context API**: Toast notifications and global state
- **LocalStorage**: Persistent data for models and settings

### Data Flow
1. **Model Selection**: User selects invoice model → stored in App state
2. **Date Selection**: User picks month/year → stored in App state  
3. **PDF Generation**: Combines model + date → generates PDF + saves record
4. **Statistics**: Aggregates all invoice records for dashboard

## Key Technologies

### Core Dependencies
- **React 18.3.1** with TypeScript support
- **Create React App** with custom webpack configuration
- **Tailwind CSS** for utility-first styling
- **Radix UI** primitives for accessibility
- **Lucide React** for consistent iconography

### Specialized Libraries
- **jsPDF** + **jspdf-autotable** for PDF generation
- **date-fns** for date manipulation
- **react-day-picker** for calendar functionality
- **class-variance-authority** for component variants
- **tailwind-merge** for class merging utilities

### Development Tools
- **ESLint** with React and TypeScript rules
- **Jest** + **React Testing Library** for testing
- **gh-pages** for GitHub Pages deployment
- **PostCSS** + **Autoprefixer** for CSS processing

## Code Style and Conventions

### TypeScript
- **Strict mode enabled** with comprehensive type checking
- **Interface definitions** for all data structures
- **Type inference** used where appropriate
- **Generic types** for reusable components

### React Patterns
- **Functional components** with hooks
- **Custom hooks** for reusable logic
- **Error boundaries** for graceful error handling
- **Component composition** over inheritance
- **Props interfaces** with TypeScript

### File Organization
- **Feature-based structure** with related files together
- **Index files** for clean imports
- **Type exports** from central types file
- **Utility functions** in dedicated utils folder

### Styling Conventions
- **Tailwind utility classes** for most styling
- **CSS custom properties** for theming
- **Responsive design** with mobile-first approach
- **Dark mode support** with system preference detection

## Development Patterns

### Form Handling
- **Controlled components** with React state
- **Real-time validation** with custom hooks
- **Error display** with user-friendly messages
- **Form submission** with comprehensive validation

### PDF Generation
- **Template-based** PDF creation
- **Dynamic content** injection
- **Professional formatting** with proper spacing
- **Automatic filename generation**

### Data Persistence
- **localStorage** for model and settings storage
- **IndexedDB** for large invoice records
- **Data validation** before storage
- **Automatic backup** and recovery

## Testing Strategy

### Testing Framework
- **Jest** for unit and integration tests
- **React Testing Library** for component testing
- **Mock functions** for external dependencies

### Test Coverage
- **Component testing** for all major components
- **Hook testing** for custom hooks
- **Utility testing** for pure functions
- **Integration testing** for user flows

## Deployment

### GitHub Pages
- **Automatic deployment** on master branch push
- **Custom domain** support through GitHub Pages
- **PWA manifest** for app-like experience
- **SEO optimized** with proper meta tags

### Build Process
- **Production optimization** with Create React App
- **Code splitting** for performance
- **Asset optimization** for faster loading
- **Service worker** for offline capabilities

## Configuration Files

### Build Configuration
- **tsconfig.json**: TypeScript compiler settings
- **tailwind.config.js**: Tailwind CSS configuration
- **components.json**: Shadcn UI component configuration
- **package.json**: Project dependencies and scripts

### Deployment Configuration
- **deploy.yaml**: GitHub Actions workflow
- **manifest.json**: PWA manifest
- **.gitignore**: Git ignore patterns

## Important Notes

### Code Quality
- **ESLint rules** enforced for consistent code style
- **TypeScript strict mode** for type safety
- **Component reusability** emphasized throughout
- **Performance considerations** for PDF generation

### User Experience
- **Progressive enhancement** approach
- **Accessibility** with ARIA labels and keyboard navigation
- **Responsive design** for all screen sizes
- **Error handling** with user-friendly messages

### Maintenance
- **Modular architecture** for easy updates
- **Type safety** for reduced runtime errors
- **Comprehensive documentation** in code comments
- **Automated testing** for reliability

This application demonstrates modern React development practices with TypeScript, comprehensive form handling, professional PDF generation, and a clean, maintainable architecture suitable for production use.

## WORKFLOW RULES
### Phase 1
- At the starting point of a feature on plan mode phase you MUST ALWAYS init a `.claude/sessions/context_session_{feature_name}.md` with your first analysis
- You MUST ask to the sub agents that you considered that have to be involved about the implementation and check their opinions, try always to run them on parallel if possible
- After a plan mode phase you ALWAYS update the `.claude/sessions/context_session_{feature_name}.md` with the definition of the plan and the recommendations of the sub agents
### Phase 2
- Before you do any work, MUST view files in `.claude/sessions/context_session_{feature_name}.md` file to get the full context
- `.claude/sessions/context_session_{feature_name}.md` should contain most of context of what we did, overall plan, and sub agents will continuously add context to the file
- After you finish each phase, MUST update the `.claude/sessions/context_session_{feature_name}.md` file to make sure others can get full context of what you did
- After you finish the work, MUST update the `.claude/sessions/context_session_{feature_name}.md` file to make sure others can get full context of what you did
### Phase 3
- You must ensure that the application has no errors in the linter with `npm run lint` and that it builds correctly with `npm run build`.
- You must ensure that the application runs correctly in the development server with `npm run dev`.

### SUB AGENTS MANAGEMENT
You have access to 3 sub agents:
- shadcn-ui-architect: all task related to UI building & tweaking HAVE TO consult this agent
- ui-ux-analyzer: all the task related with UI review, improvements & tweaking HAVE TO consult this agent
- frontend-expert: all task related to business logic before create the UI building & tweaking HAVE TO consult this agent

Sub agents will do research about the implementation and report feedback, but you will do the actual implementation;

When passing task to sub agent, make sure you pass the context file, e.g. `.claude/sessions/context_session_{feature_name}.md`.

After each sub agent finishes the work, make sure you read the related with this feature documentation they created in `.claude/doc/{feature_name}/` to get full context of the plan before you start executing.