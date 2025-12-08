import { type ComponentProps, type ComponentType, type ReactNode } from 'react';

type FeatureItem = {
  title: string;
  Svg: ComponentType<ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Backend',
    Svg: () => (
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="backendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF570A" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff6b2b" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#backendGradient)" />
        {/* Server/API icon */}
        <rect x="60" y="50" width="80" height="100" rx="4" fill="white" fillOpacity="0.9" />
        {/* Server lines */}
        <line x1="70" y1="70" x2="130" y2="70" stroke="#FF570A" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="90" x2="130" y2="90" stroke="#FF570A" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="110" x2="130" y2="110" stroke="#FF570A" strokeWidth="3" strokeLinecap="round" />
        {/* Database icon */}
        <ellipse cx="100" cy="170" rx="40" ry="15" fill="white" fillOpacity="0.9" />
        <ellipse cx="100" cy="170" rx="40" ry="15" fill="none" stroke="#FF570A" strokeWidth="2" />
        <ellipse cx="100" cy="165" rx="35" ry="12" fill="none" stroke="#FF570A" strokeWidth="1.5" strokeOpacity="0.7" />
        {/* Connection lines */}
        <path d="M 100 150 L 100 155" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M 80 160 L 100 155 L 120 160" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* API endpoints */}
        <circle cx="50" cy="80" r="8" fill="white" fillOpacity="0.8" />
        <circle cx="50" cy="100" r="8" fill="white" fillOpacity="0.8" />
        <circle cx="50" cy="120" r="8" fill="white" fillOpacity="0.8" />
        <path d="M 58 80 L 60 80" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 100 L 60 100" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 120 L 60 120" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    description: (
      <>
        API robusta construída com <strong>NestJS</strong> e <strong>TypeScript</strong>, 
        conectada a um banco de dados <strong>PostgreSQL</strong> utilizando <strong>Prisma</strong> como ORM.
      </>
    ),
  },
  {
    title: 'Frontend',
    Svg: () => (
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="frontendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#frontendGradient)" />
        {/* Browser window */}
        <rect x="40" y="50" width="120" height="100" rx="6" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
        {/* Browser header */}
        <rect x="40" y="50" width="120" height="20" rx="6" fill="white" fillOpacity="0.3" />
        <circle cx="55" cy="60" r="4" fill="white" fillOpacity="0.6" />
        <circle cx="70" cy="60" r="4" fill="white" fillOpacity="0.6" />
        <circle cx="85" cy="60" r="4" fill="white" fillOpacity="0.6" />
        {/* UI elements */}
        <rect x="55" y="85" width="30" height="20" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="95" y="85" width="30" height="20" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="55" y="115" width="70" height="8" rx="2" fill="white" fillOpacity="0.5" />
        <rect x="55" y="130" width="50" height="8" rx="2" fill="white" fillOpacity="0.5" />
        {/* Vue logo inspired */}
        <path
          d="M 100 100 L 85 120 L 100 135 L 115 120 Z"
          fill="white"
          fillOpacity="0.8"
        />
        <path
          d="M 100 100 L 90 115 L 100 125 L 110 115 Z"
          fill="#3b82f6"
          fillOpacity="0.6"
        />
      </svg>
    ),
    description: (
      <>
        Interface moderna construída com <strong>Vue 3</strong> e <strong>Composition API</strong>, 
        utilizando <strong>Vite</strong> para desenvolvimento rápido e eficiente.
      </>
    ),
  },
  {
    title: 'Dashboard',
    Svg: () => (
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#dashboardGradient)" />
        {/* Dashboard frame */}
        <rect x="30" y="40" width="140" height="120" rx="8" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
        {/* Chart bars */}
        <rect x="50" y="100" width="15" height="40" fill="white" fillOpacity="0.9" rx="2" />
        <rect x="75" y="80" width="15" height="60" fill="white" fillOpacity="0.9" rx="2" />
        <rect x="100" y="70" width="15" height="70" fill="white" fillOpacity="0.9" rx="2" />
        <rect x="125" y="90" width="15" height="50" fill="white" fillOpacity="0.9" rx="2" />
        <rect x="150" y="110" width="15" height="30" fill="white" fillOpacity="0.9" rx="2" />
        {/* Line chart */}
        <path
          d="M 50 120 L 70 110 L 90 100 L 110 90 L 130 95 L 150 105"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        <circle cx="50" cy="120" r="3" fill="white" />
        <circle cx="70" cy="110" r="3" fill="white" />
        <circle cx="90" cy="100" r="3" fill="white" />
        <circle cx="110" cy="90" r="3" fill="white" />
        <circle cx="130" cy="95" r="3" fill="white" />
        <circle cx="150" cy="105" r="3" fill="white" />
        {/* Grid lines */}
        <line x1="40" y1="140" x2="170" y2="140" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="40" y1="120" x2="170" y2="120" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="40" y1="100" x2="170" y2="100" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="40" y1="80" x2="170" y2="80" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    ),
    description: (
      <>
        Interface de visualização de resultados de testes construída com <strong>Vue 3</strong>, <strong>Pinia</strong> e <strong>Chart.js</strong>.
      </>
    ),
  },
  {
    title: 'Testes Automatizados',
    Svg: () => (
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="testGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#testGradient)" />
        {/* Test checkmarks */}
        <path
          d="M 50 80 L 58 88 L 70 70"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 110 L 58 118 L 70 100"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 140 L 58 148 L 70 130"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Test container/beaker */}
        <rect x="100" y="60" width="50" height="80" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
        <path
          d="M 100 60 L 95 50 L 150 50 L 150 60"
          fill="white"
          fillOpacity="0.3"
        />
        {/* Test levels */}
        <rect x="105" y="120" width="40" height="15" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="105" y="100" width="30" height="15" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="105" y="80" width="20" height="15" rx="2" fill="white" fillOpacity="0.7" />
        {/* Automation gear */}
        <circle cx="130" cy="160" r="20" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
        <circle cx="130" cy="160" r="12" fill="none" stroke="white" strokeWidth="2" />
        <line x1="130" y1="140" x2="130" y2="148" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="130" y1="172" x2="130" y2="180" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="110" y1="160" x2="118" y2="160" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="142" y1="160" x2="150" y2="160" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    description: (
      <>
        Suíte completa de testes com <strong>Cypress</strong>, <strong> Playwright</strong>, 
        <strong> Robot Framework</strong>, <strong> Selenium</strong> , <strong>Vitest</strong> e <strong>Jest</strong>
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div style={{
      flex: '1',
      minWidth: '300px',
      maxWidth: '400px',
      textAlign: 'center',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ 
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '200px',
        height: '200px'
      }}>
        <Svg role="img" aria-label={title} />
      </div>
      <div style={{ width: '100%' }}>
        <h3 style={{ 
          marginTop: '0', 
          marginBottom: '0.5rem',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {title}
        </h3>
        <p style={{ 
          textAlign: 'center',
          maxWidth: '300px',
          margin: '0 auto',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section style={{
      display: 'flex',
      alignItems: 'center',
      padding: '4rem 0',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
