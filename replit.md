# Desintoxicação Digital Kids - Digital Detox for Kids

## Project Overview
This is a React application built with Vite that provides a digital detox guide for children and teenagers. It's designed to help parents and educators manage smartphone and social media usage for young people.

## Architecture
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **State Management**: React Context API with local storage persistence
- **Development**: Hot Module Replacement (HMR) enabled

## Key Features
- User authentication system (mock implementation)
- Protected routes for authenticated users
- Responsive design with mobile-first approach
- Chapter-based content navigation
- Bonus book sections with PDF downloads
- **Premium Features**: Modo Foco (Focus Mode) e Relatórios Semanais (Weekly Reports)
- **Smart Upsell System**: Different experiences for free vs premium users
- Beautiful UI with custom color palette (teal primary, coral secondary, purple accent)
- Dark mode support (configured but not implemented)

## Technical Setup
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows Replit proxy to work properly)
- **Hot Module Replacement**: Configured on port 5000
- **Build Output**: Static files suitable for deployment

## Project Structure
```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui component library
├── contexts/           # React Context providers (AuthContext with isPremium)
├── data/              # Static data and content
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── pages/             # Route components
│   └── premium/       # Premium-only pages
├── types/             # TypeScript type definitions (including premium types)
└── lib/               # Utility functions
```

## Content Structure
- Login page with mock authentication (users with "premium" in email get premium access)
- Dashboard for navigation (reorganized: Etapas → Conclusão → Bônus → Premium)
- Chapter-based content system
- Bonus books feature with PDF downloads
- **Premium Dashboard**: Simplified access to 2 essential tools
- **Modo Foco (Focus Mode)**: Timer educativo com templates por faixa etária
- **Questionários de Evolução (Weekly Reports)**: Sistema de questionários simples para avaliação do progresso em cada etapa
- **Smart Premium Button**: Shows upsell for free users, dashboard for premium users
- Protected routes requiring authentication

## Recent Changes (Oct 2, 2025)

### Questionários de Evolução - Complete Redesign
- **Complete Transformation from Complex Charts to Simple Questionnaires**
  - Replaced complex chart-based reports with simple, intuitive questionnaire system
  - 4 questionnaires (one for each method stage: Etapa 1-4)
  - 5 questions per questionnaire focused on behavior, progress, and resistance
  - Simple multiple-choice format (3 options per question with weighted scoring)

- **Smart Scoring System (0-100%)**
  - Automatic calculation based on selected answers
  - Three performance levels:
    - 0-50%: "Necessita Atenção" (Needs Attention) - red theme
    - 50-80%: "Evoluindo Bem" (Evolving Well) - amber theme
    - 80-100%: "Excelente Progresso!" (Excellent Progress) - green theme

- **Personalized Feedback System**
  - Contextual feedback based on questionnaire stage and score level
  - 4 feedback categories per result:
    - **Pontos Fortes**: Recognizes what parents are doing right
    - **Áreas de Atenção**: Highlights areas needing improvement
    - **Dicas para Melhorar**: Practical, actionable tips (5-6 tips per level)
    - **Próximos Passos**: Clear next actions to take
  - All feedback uses simple, accessible language for non-technical parents
  - Includes empathetic messaging: "Lembre-se: cada pessoa tem seu tempo para entender e aceitar mudanças!"

- **Data Persistence**
  - Responses saved in localStorage per family member
  - Can review past questionnaires and retake as needed
  - useQuestionnaireResponses custom hook for state management

- **User Flow**
  1. Select family member
  2. Choose stage/questionnaire (1-4)
  3. Answer 5 questions
  4. View detailed results with personalized feedback
  5. Option to take another questionnaire or return to dashboard

## Previous Changes (Oct 1, 2025)

### UI/UX Improvements
- **Hours Limitation**: Limited allowed hours to 7h-22h range in both profile configuration and daily logs (educational context)
- **Navigation Bug Fixes**: 
  - Fixed blank screen issue when navigating from Etapa 2 to Etapa 3 in responsive mode
  - Added missing subtitle for Etapa 3: "Preenchendo o tempo com experiências significativas"
  - Fixed navigation button text from hardcoded "Conclusão" to dynamic "Próximo Capítulo"
  - Added safe rendering validation for chapter subtitles
- **Conclusion Page Enhancement**: 
  - Added "Início" button on the right side of navigation in Conclusion page
  - Button redirects users back to main dashboard for easy navigation
- **Bug Fix**: Fixed 404 error when clicking "Configurar Horários" button in compliance chart empty state

## Previous Changes (Sep 30, 2025)

### Educational Tracking System Implementation
- **Complete Family Member Profile System**: Apps used, time limits per app, and allowed hours configuration
- **Simplified Schedule Interface**: Refactored "Horários Permitidos" from 168-cell grid to add/remove system
  - Shows only configured schedules in clean cards
  - Dialog-based adding with day selector and multi-hour grid
  - Individual hour removal and full day removal options
  - Empty state guidance with visual feedback
- **Manual Observation System**: Daily and weekly log forms for parents to record child behavior
- **Comparative Analysis Reports**: 
  - Compliance analysis: Compares allowed hours vs actual usage with violation details
  - App usage frequency tracking: Shows most used apps based on parent observations
  - Automatic insights generation based on compliance and behavior patterns
- **Data Model Expansion**: FamilyMember with apps/appLimits/allowedHours, DailyLog and WeeklyLog types
- **Storage Hooks**: useDailyLogs and useWeeklyLogs for localStorage persistence
- **Bug Fixes**: 
  - Fixed compliance logic to only count days with configured allowedHours
  - Removed invalid app comparison (minutes vs count), now shows frequency only
  - Corrected navigation from Etapa 3 to Dashboard

### Premium System Architecture
- **Premium System Simplification**: Reduced from 5 to 2 essential tools based on user feedback
- **Removed Tools**: Monitor de Tempo de Tela, Alertas Inteligentes, Metas Familiares (excesso de informação)
- **Kept Tools**: Modo Foco (Focus Mode) e Questionários de Evolução (Progress Questionnaires)
- **Dashboard Reorganization**: Conclusão moved after Etapa 4, Bônus and Premium moved down
- **Sidebar Reorganization**: Logical order (Etapas → Conclusão → Bônus → Premium)
- **Family Management Page**: Dedicated page at /premium/family with clickable cards
- **Family Member Edit Page**: Complete profile editor with apps, limits, and allowed hours grid
- **Premium Dashboard Layout**: "Gerenciar Família" as prominent teal gradient banner above tools
- **Accessibility Improvements**: Removed nested interactive controls, added aria-hidden to decorative icons
- **Full Premium Flow Working**: Login → Dashboard → Family Management → Edit Profile → Daily/Weekly Logs → Reports

## Previous Changes (Sep 25, 2025)
- **Premium System Implementation**: Complete freemium model with tiered access
- **AuthContext Enhanced**: Added isPremium property to User interface
- **Smart Navigation**: Golden premium button that adapts to user type
- **PDF Downloads**: Real PDFs integrated in bonus section
- **Pricing Strategy**: R$ 14,90/month with external checkout preparation
- Updated Vite configuration for Replit environment (port 5000, host 0.0.0.0)
- Added production start script using vite preview
- Configured deployment settings for autoscale deployment

## User Preferences
- Application is in Portuguese language
- Focus on child/family-friendly design patterns
- Emphasis on digital wellness and healthy technology habits

## Development
- Run `npm run dev` to start development server
- Run `npm run build` to build for production
- Run `npm run start` to serve production build