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
- **Relatórios Semanais (Weekly Reports)**: Análise de progresso com gráficos
- **Smart Premium Button**: Shows upsell for free users, dashboard for premium users
- Protected routes requiring authentication

## Recent Changes (Sep 30, 2025)
- **Premium System Simplification**: Reduced from 5 to 2 essential tools based on user feedback
- **Removed Tools**: Monitor de Tempo de Tela, Alertas Inteligentes, Metas Familiares (excesso de informação)
- **Kept Tools**: Modo Foco (Focus Mode) e Relatórios Semanais (Weekly Reports)
- **Dashboard Reorganization**: Conclusão moved after Etapa 4, Bônus and Premium moved down
- **Sidebar Reorganization**: Logical order (Etapas → Conclusão → Bônus → Premium)
- **Simplified Storage**: useScreenTimeStorage hook simplified to manage only family members
- **Bug Fixes**: Fixed navigation issue from Etapa 3 to Dashboard
- Updated routes and removed unused files/hooks for cleaner codebase

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