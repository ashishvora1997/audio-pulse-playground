import { useState } from 'react';
import Docs from './docs/docs';
import Playground from './playground/playground'; // rename your current App.tsx to Playground.tsx
import './App.css';

type Tab = 'docs' | 'playground';

export default function App() {
  const [tab, setTab] = useState<Tab>('docs');

  return (
    <div className="lab">
      <div className="topbar">

        {/* Logo */}
        <div className="topbar-header">
          <div className="logo-icon">
            <img src="/favicon.svg" width={18} height={18} alt="audio-pulse" />
          </div>
          <div className="topbar-left">
            <span className="logo-text">audio-pulse</span>
            <span className="logo-badge">v1.2.1</span>
          </div>
        </div>

        {/* Centre tabs */}
        <div className="tab-nav">
          <button
            className={`tab-btn ${tab === 'docs' ? 'active' : ''}`}
            onClick={() => setTab('docs')}
          >
            Docs
          </button>
          <button
            className={`tab-btn ${tab === 'playground' ? 'active' : ''}`}
            onClick={() => setTab('playground')}
          >
            Playground
          </button>
        </div>

        {/* Right links */}
        <div className="topbar-right">
          <a
            className="top-btn"
            href="https://www.npmjs.com/package/audio-pulse"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>
          <a
            className="top-btn top-btn-github"
            href="https://github.com/ashishvora1997/audio-pulse"
            target="_blank"
            rel="noreferrer"
          >
            <span>GitHub</span>
            <span> ↗</span>
          </a>
        </div>

      </div>

      {/* Tab content — both always mounted, swapped with display */}
      <div className="tab-content">
        <div style={{ display: tab === 'docs' ? 'block' : 'none', height: '100%' }}>
          <Docs />
        </div>
        <div style={{ display: tab === 'playground' ? 'block' : 'none', height: 'calc(100vh - 60px)', overflow: 'auto' }}>
          <Playground />
        </div>
      </div>
    </div>
  );
}