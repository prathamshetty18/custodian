import React, { useState } from 'react';
import { Compass, Volume2, Eye, Wind, Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES } from '../data/fieldNotesData';
import { UI_TRANSLATIONS } from '../data/translations';

export const NavigationHeader = ({
  currentScreen,
  setCurrentScreen,
  activeLanguage,
  setActiveLanguage,
  isPlayingAudio,
  reducedMotion,
  setReducedMotion,
  highContrast,
  setHighContrast
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = UI_TRANSLATIONS[activeLanguage.id] || UI_TRANSLATIONS.en;

  const screens = [
    { id: 1, name: t.nav.welcome, label: t.nav.welcome.split(' ')[1] || t.nav.welcome },
    { id: 2, name: t.nav.language, label: t.nav.language.split(' ')[1] || t.nav.language },
    { id: 3, name: t.nav.map, label: t.nav.map.split(' ')[1] || t.nav.map },
    { id: 4, name: t.nav.story, label: t.nav.story.split(' ')[1] || t.nav.story },
    { id: 5, name: t.nav.custodian, label: t.nav.custodian.split(' ')[1] || t.nav.custodian },
    { id: 6, name: t.nav.complete, label: t.nav.complete.split(' ')[1] || t.nav.complete },
  ];

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Brand identity */}
        <div className="brand" onClick={() => setCurrentScreen(1)} tabIndex={0} role="button" aria-label="Go to Welcome screen">
          <div className="brand-crest">
            <Compass size={18} strokeWidth={2} />
          </div>
          <div>
            <div className="brand-title">{t.brandTitle}</div>
            <div className="brand-subtitle">{t.brandSubtitle}</div>
          </div>
        </div>

        {/* Screen Breadcrumb / Step Navigation */}
        <nav className="screen-nav" aria-label="Prototype screens">
          <ol className="screen-list">
            {screens.map(s => {
              const isActive = currentScreen === s.id;
              const isPast = currentScreen > s.id;
              return (
                <li key={s.id} className={`screen-step ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                  <button
                    onClick={() => setCurrentScreen(s.id)}
                    className="screen-step-btn"
                    aria-current={isActive ? 'step' : undefined}
                    title={`Go to ${s.name}`}
                  >
                    <span className="step-num">{s.id.toString().padStart(2, '0')}</span>
                    <span className="step-name">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Global Utilities & Accessibility Controls */}
        <div className="header-actions">
          {isPlayingAudio && (
            <div className="audio-live-badge" title="Field audio is playing">
              <Volume2 size={15} className="pulse-icon" />
              <span>{t.audioActive}</span>
            </div>
          )}

          {/* Quick Language Switcher Dropdown in Header */}
          <div className="lang-picker-wrapper">
            <button
              className="lang-picker-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={langDropdownOpen}
              aria-label="Select application language"
              title="Change language"
            >
              <Globe size={15} className="globe-icon" />
              <span className="current-lang-name">{activeLanguage.nativeName}</span>
              <ChevronDown size={13} className={`chevron-icon ${langDropdownOpen ? 'open' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown-menu" role="listbox">
                {LANGUAGES.map(lang => {
                  const isSelected = activeLanguage.id === lang.id;
                  return (
                    <button
                      key={lang.id}
                      role="option"
                      aria-selected={isSelected}
                      className={`lang-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setActiveLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                    >
                      <div className="option-text">
                        <span className="option-native">{lang.nativeName}</span>
                        <span className="option-en">({lang.name})</span>
                      </div>
                      {isSelected && <Check size={14} className="option-check" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="accessibility-toggles">
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`util-btn ${reducedMotion ? 'active' : ''}`}
              title={reducedMotion ? "Enable animations" : "Reduce motion for accessibility"}
              aria-label="Toggle reduced motion"
            >
              <Wind size={15} />
              <span className="util-label">{reducedMotion ? t.reducedMotion : t.motionOn}</span>
            </button>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`util-btn ${highContrast ? 'active' : ''}`}
              title={highContrast ? "Standard contrast" : "Enhanced contrast"}
              aria-label="Toggle enhanced contrast"
            >
              <Eye size={15} />
              <span className="util-label">{highContrast ? t.highContrast : t.contrast}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .site-header {
          border-bottom: 1px solid var(--color-paper-200);
          background-color: var(--color-paper-50);
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 3px rgba(41, 37, 31, 0.04);
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.65rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
          user-select: none;
        }

        .brand-crest {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-terracotta);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-terracotta-hover);
        }

        .brand-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.2rem;
          letter-spacing: 0.08em;
          color: var(--color-ink-900);
          line-height: 1;
        }

        .brand-subtitle {
          font-size: 0.72rem;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }

        .screen-nav {
          display: flex;
          align-items: center;
        }

        .screen-list {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 0.25rem;
          background: var(--color-paper-100);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-paper-200);
        }

        .screen-step-btn {
          border: none;
          background: transparent;
          font-family: var(--font-ui);
          font-size: 0.8rem;
          color: var(--color-ink-500);
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 180ms ease;
        }

        .screen-step.past .screen-step-btn {
          color: var(--color-ink-700);
        }

        .screen-step.active .screen-step-btn {
          background-color: var(--color-paper-50);
          color: var(--color-terracotta);
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(41, 37, 31, 0.08);
        }

        .screen-step-btn:hover {
          color: var(--color-terracotta);
        }

        .step-num {
          font-size: 0.72rem;
          opacity: 0.8;
          font-variant-numeric: tabular-nums;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .audio-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-forest);
          background: var(--color-forest-soft);
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(64, 88, 68, 0.3);
        }

        .pulse-icon {
          animation: audioPulse 1.4s infinite ease-in-out;
        }

        @keyframes audioPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        /* Language Picker Dropdown */
        .lang-picker-wrapper {
          position: relative;
        }

        .lang-picker-btn {
          border: 1px solid var(--color-paper-200);
          background: var(--color-paper-100);
          color: var(--color-ink-900);
          font-family: var(--font-ui);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          transition: all 150ms ease;
        }

        .lang-picker-btn:hover {
          border-color: var(--color-terracotta);
        }

        .globe-icon {
          color: var(--color-terracotta);
        }

        .chevron-icon {
          transition: transform 200ms ease;
        }

        .chevron-icon.open {
          transform: rotate(180deg);
        }

        .lang-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 4px);
          background: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          box-shadow: var(--shadow-active);
          border-radius: var(--radius-sm);
          padding: 0.35rem;
          min-width: 170px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .lang-option {
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-ui);
          font-size: 0.82rem;
          color: var(--color-ink-700);
          transition: background 120ms ease;
        }

        .lang-option:hover {
          background: var(--color-paper-100);
          color: var(--color-ink-900);
        }

        .lang-option.selected {
          background: var(--color-paper-100);
          color: var(--color-terracotta);
          font-weight: 700;
        }

        .option-text {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .option-native {
          font-family: var(--font-display);
          font-size: 1.05rem;
        }

        .option-en {
          font-size: 0.72rem;
          color: var(--color-ink-500);
        }

        .option-check {
          color: var(--color-terracotta);
        }

        .accessibility-toggles {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .util-btn {
          border: 1px solid var(--color-paper-200);
          background: var(--color-paper-100);
          color: var(--color-ink-700);
          font-family: var(--font-ui);
          font-size: 0.75rem;
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 150ms ease;
        }

        .util-btn:hover {
          border-color: var(--color-ink-500);
          color: var(--color-ink-900);
        }

        .util-btn.active {
          background-color: var(--color-paper-200);
          color: var(--color-ink-900);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .screen-step-btn .step-name {
            display: none;
          }
          .util-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
