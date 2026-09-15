import React, { useState } from 'react';
import { 
  Compass, 
  Lock, 
  Check, 
  ArrowRight, 
  Volume2, 
  Eye, 
  ShieldCheck, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  MapPin,
  Filter
} from 'lucide-react';
import { getLocalizedNote } from '../data/fieldNotesData';
import { UI_TRANSLATIONS } from '../data/translations';

export const LivingMap = ({
  fieldNotes,
  selectedNote,
  setSelectedNote,
  onOpenStory,
  onOpenCustodian,
  isMobile,
  activeLanguage
}) => {
  const [filterType, setFilterType] = useState('all');
  const [hoveredNote, setHoveredNote] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const t = UI_TRANSLATIONS[activeLanguage?.id] || UI_TRANSLATIONS.en;
  const rawActiveNote = selectedNote || fieldNotes[0];
  const activeNote = getLocalizedNote(rawActiveNote, activeLanguage?.id);

  const filteredNotes = fieldNotes.filter(note => {
    if (filterType === 'all') return true;
    if (filterType === 'protected') return note.status === 'protected' || note.isProtected;
    if (filterType === 'completed') return note.status === 'completed';
    return true;
  });

  return (
    <section className="living-map-viewport transition-level-1" aria-label="Interactive Living Cultural Map">
      {/* Top Map Context & Filtering Toolbar */}
      <div className="map-toolbar">
        <div className="map-meta-info">
          <span className="journey-label">{t.mapScreen.sector}</span>
          <h2 className="map-heading">{t.mapScreen.heading}</h2>
        </div>

        <div className="map-controls">
          <div className="filter-group" role="group" aria-label="Tradition filter">
            <Filter size={14} className="filter-icon" />
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              {t.mapScreen.allTraditions} ({fieldNotes.length})
            </button>
            <button
              className={`filter-btn ${filterType === 'protected' ? 'active' : ''}`}
              onClick={() => setFilterType('protected')}
            >
              {t.mapScreen.protectedLore}
            </button>
            <button
              className={`filter-btn ${filterType === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterType('completed')}
            >
              {t.mapScreen.visited}
            </button>
          </div>

          <div className="zoom-controls">
            <button
              className="map-action-btn"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
              title="Zoom In"
              aria-label="Zoom in map"
            >
              +
            </button>
            <button
              className="map-action-btn"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
              title="Zoom Out"
              aria-label="Zoom out map"
            >
              –
            </button>
            <button
              className="map-action-btn"
              onClick={() => setZoomLevel(1)}
              title="Reset View"
              aria-label="Reset map scale"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Visual Canvas */}
      <div className="map-canvas-container">
        <div 
          className="map-svg-wrapper"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 300ms ease' }}
        >
          <svg
            className="illustrated-map-svg"
            viewBox="0 0 920 860"
            role="img"
            aria-label="Stylized illustrated expedition map of coastal Karnataka showing ritual centers, mountain ridges, and sacred rivers."
          >
            <defs>
              <filter id="inkSlightBleed" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
              </filter>
              
              <linearGradient id="arabianSeaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EAE1CD" stopOpacity="0.8" />
                <stop offset="85%" stopColor="#F2EBDB" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F7F1E3" stopOpacity="0.1" />
              </linearGradient>

              <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#29251F" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Background Muted Paper Surface */}
            <rect width="920" height="860" fill="#F7F1E3" />

            {/* Arabian Sea Coastal Basin */}
            <path
              d="M0,0 L210,0 Q185,140 220,280 Q250,420 220,540 Q180,680 230,860 L0,860 Z"
              fill="url(#arabianSeaGrad)"
            />

            {/* Hand-Drawn Coastal Linework */}
            <path
              d="M210,0 C190,70 180,150 200,220 C220,290 238,360 228,430 C218,500 195,570 205,640 C215,710 240,780 230,860"
              fill="none"
              stroke="#BFA985"
              strokeWidth="1.8"
              strokeDasharray="6 3"
              opacity="0.8"
            />
            <path
              d="M214,0 C194,70 184,150 204,220 C224,290 242,360 232,430 C222,500 199,570 209,640 C219,710 244,780 234,860"
              fill="none"
              stroke="#51483B"
              strokeWidth="0.8"
              opacity="0.4"
            />

            {/* Arabian Sea Calligraphic Cartographic Label */}
            <text x="75" y="440" fill="#766A59" fontSize="13" fontFamily="var(--font-display)" fontStyle="italic" letterSpacing="0.25em" transform="rotate(-90 75 440)">
              THE ARABIAN SEA (LAKSHADWEEP SEA)
            </text>

            {/* Hand-Drawn Rivers */}
            <g className="rivers-group" stroke="#8E9B90" fill="none" opacity="0.85">
              <path d="M590,320 Q480,330 380,370 T226,388" strokeWidth="2.2" />
              <path d="M540,300 Q490,320 460,335" strokeWidth="1.2" />
              <text x="360" y="360" fill="#766A59" fontSize="10" fontFamily="var(--font-display)" fontStyle="italic">Swarna River</text>

              <path d="M680,620 Q560,610 450,650 T215,690" strokeWidth="2.8" />
              <path d="M640,660 Q520,680 430,685" strokeWidth="1.4" />
              <text x="410" y="642" fill="#766A59" fontSize="10" fontFamily="var(--font-display)" fontStyle="italic">Netravati River</text>
            </g>

            {/* Western Ghats Mountain Ridges */}
            <g className="mountains-group" stroke="#51483B" fill="none" opacity="0.65">
              <path d="M660,160 L685,120 L710,160 M690,160 L715,110 L740,160 M725,160 L750,125 L775,160" strokeWidth="1.4"/>
              <path d="M620,270 L650,220 L680,270 M660,270 L690,210 L720,270" strokeWidth="1.4"/>
              <path d="M690,420 L720,360 L750,420 M730,420 L760,350 L790,420 M770,420 L800,370 L830,420" strokeWidth="1.4"/>
              <path d="M710,560 L740,490 L770,560 M750,560 L785,480 L820,560" strokeWidth="1.4"/>
              <path d="M650,710 L680,640 L710,710 M690,710 L725,630 L760,710 M740,710 L775,650 L810,710" strokeWidth="1.4"/>

              <text x="760" y="290" fill="#766A59" fontSize="12" fontFamily="var(--font-display)" letterSpacing="0.2em" transform="rotate(72 760 290)">
                SAHYADRI · WESTERN GHATS RIDGE
              </text>
            </g>

            {/* Ancient Cartographic Roads */}
            <g className="roads-group" stroke="#9F927E" strokeWidth="1.2" strokeDasharray="3 4" fill="none" opacity="0.75">
              <path d="M530,220 Q440,300 320,390" />
              <path d="M320,390 Q380,460 440,520" />
              <path d="M440,520 Q410,610 380,700" />
              <path d="M440,520 Q490,580 540,640" />
            </g>

            {/* Illustrated Landmarks */}
            <g className="landmarks" fill="none" stroke="#766A59" strokeWidth="1.2">
              <g transform="translate(290, 375)">
                <path d="M0,15 L15,2 L30,15 L30,28 L0,28 Z" fill="#EFE4CC" />
                <line x1="15" y1="2" x2="15" y2="-4" stroke="var(--color-terracotta)" strokeWidth="1.5" />
              </g>

              <g transform="translate(420, 505)">
                <path d="M0,18 L24,18 M4,18 L4,6 M12,18 L12,6 M20,18 L20,6 M0,6 L24,6 L12,0 Z" fill="#EFE4CC" />
              </g>

              <g transform="translate(565, 625)">
                <circle cx="12" cy="8" r="10" fill="#E3EDE4" stroke="var(--color-forest)" strokeWidth="1.2" />
                <path d="M12,18 L12,26" stroke="#51483B" strokeWidth="1.5" />
                <path d="M9,22 L15,22" stroke="#51483B" strokeWidth="1" />
              </g>

              <g transform="translate(350, 685)">
                <path d="M0,16 L16,4 L32,16 L32,26 L0,26 Z" fill="#EFE4CC" />
                <circle cx="16" cy="14" r="3" fill="var(--color-ochre)" stroke="none" />
              </g>
            </g>

            {/* Geographical Region Labels */}
            <text x="310" y="425" fill="#51483B" fontSize="13" fontFamily="var(--font-display)" fontWeight="600">Udupi</text>
            <text x="430" y="555" fill="#51483B" fontSize="13" fontFamily="var(--font-display)" fontWeight="600">Moodabidri</text>
            <text x="560" y="675" fill="#51483B" fontSize="13" fontFamily="var(--font-display)" fontWeight="600">Devarakadu</text>
            <text x="350" y="735" fill="#51483B" fontSize="13" fontFamily="var(--font-display)" fontWeight="600">Mangalore Coast</text>
            <text x="510" y="255" fill="#51483B" fontSize="13" fontFamily="var(--font-display)" fontWeight="600">Ilkal</text>

            {/* Interactive Markers */}
            {filteredNotes.map((note) => {
              const localizedMarkerNote = getLocalizedNote(note, activeLanguage?.id);
              const isSelected = activeNote.id === note.id;
              const isCompleted = note.status === 'completed';
              const isProtected = note.status === 'protected' || note.isProtected;

              return (
                <g
                  key={note.id}
                  transform={`translate(${note.coordinates.x}, ${note.coordinates.y})`}
                  className={`map-marker-group ${isSelected ? 'marker-selected' : ''}`}
                  onClick={() => setSelectedNote(note)}
                  onMouseEnter={() => setHoveredNote(note)}
                  onMouseLeave={() => setHoveredNote(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Map marker: ${localizedMarkerNote.title}, ${localizedMarkerNote.location}. Status: ${note.status}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNote(note);
                      onOpenStory(note);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="26"
                      fill="none"
                      stroke="var(--color-ink-900)"
                      strokeWidth="1.6"
                      strokeDasharray="3 3"
                      className="selected-ink-ring"
                    />
                  )}

                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "17" : "14"}
                    fill={isProtected ? "var(--color-forest)" : "var(--color-terracotta)"}
                    filter="url(#sealShadow)"
                    stroke="var(--color-paper-50)"
                    strokeWidth="2"
                    className="seal-circle"
                  />

                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "13" : "10"}
                    fill="none"
                    stroke="#FFF"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />

                  {isProtected ? (
                    <g transform="translate(-6, -6)">
                      <path
                        d="M3,5 L3,4 C3,2.34 4.34,1 6,1 C7.66,1 9,2.34 9,4 L9,5 M1.5,5 L10.5,5 C11.3,5 12,5.7 12,6.5 L12,11.5 C12,12.3 11.3,13 10.5,13 L1.5,13 C0.7,13 0,12.3 0,11.5 L0,6.5 C0,5.7 0.7,5 1.5,5 Z"
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="1.2"
                      />
                    </g>
                  ) : isCompleted ? (
                    <path
                      d="M-4,0 L-1,3 L5,-3"
                      fill="none"
                      stroke="#FFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  ) : (
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#FFF"
                      fontSize={isSelected ? "10" : "9"}
                      fontWeight="600"
                      fontFamily="var(--font-ui)"
                    >
                      {note.noteNumber}
                    </text>
                  )}

                  {isProtected && (
                    <g transform="translate(22, 4)">
                      <rect x="-4" y="-12" width="76" height="18" rx="2" fill="var(--color-forest-soft)" stroke="rgba(64,88,68,0.4)" strokeWidth="0.8" />
                      <text x="34" y="0" textAnchor="middle" fill="var(--color-forest)" fontSize="10" fontWeight="700" fontFamily="var(--font-ui)">
                        {t.mapScreen.legend.protected}
                      </text>
                    </g>
                  )}

                  {!isProtected && (
                    <text
                      x="0"
                      y={isSelected ? "34" : "28"}
                      textAnchor="middle"
                      fill="var(--color-ink-900)"
                      fontSize="11"
                      fontWeight={isSelected ? "700" : "500"}
                      fontFamily="var(--font-ui)"
                      className="marker-text-label"
                    >
                      {localizedMarkerNote.location}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Traveller Position Motif */}
            <g transform={`translate(${activeNote.coordinates.x - 30}, ${activeNote.coordinates.y - 25})`} className="traveller-motif">
              <circle cx="0" cy="0" r="10" fill="var(--color-ochre)" stroke="#FFF" strokeWidth="1.5" />
              <path d="M-5,0 L5,0 M0,-5 L0,5" stroke="var(--color-paper-50)" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="var(--color-paper-50)" />
              <text x="14" y="3" fill="var(--color-ink-900)" fontSize="9" fontWeight="700" fontFamily="var(--font-ui)">
                {t.mapScreen.currentWaypoint}
              </text>
            </g>

            {/* Compass Rose */}
            <g transform="translate(820, 90)" opacity="0.8">
              <circle cx="0" cy="0" r="42" stroke="var(--color-paper-200)" strokeWidth="1" />
              <circle cx="0" cy="0" r="30" stroke="var(--color-ink-500)" strokeWidth="0.8" />
              <line x1="0" y1="-38" x2="0" y2="38" stroke="var(--color-ink-500)" strokeWidth="0.8" />
              <line x1="-38" y1="0" x2="38" y2="0" stroke="var(--color-ink-500)" strokeWidth="0.8" />
              <polygon points="0,-36 5,0 0,6" fill="var(--color-terracotta)" />
              <polygon points="0,-36 -5,0 0,6" fill="#B35D3D" />
              <polygon points="0,36 5,0 0,-6" fill="var(--color-ink-700)" />
              <polygon points="0,36 -5,0 0,-6" fill="var(--color-ink-500)" />
              <text x="0" y="-42" textAnchor="middle" fill="var(--color-ink-900)" fontSize="11" fontWeight="700">N</text>
            </g>
          </svg>
        </div>

        {/* Side Narrative Preview Panel */}
        <aside className="story-preview-sheet parchment-panel transition-level-2-expand" aria-label="Field Note Preview">
          <div className="preview-top-row">
            <span className="journey-label">{activeNote.label}</span>
            <div className="status-indicator-tag">
              {activeNote.isProtected ? (
                <span className="badge-permission restricted">
                  <Lock size={12} />
                  {t.mapScreen.custodianProtected}
                </span>
              ) : activeNote.status === 'completed' ? (
                <span className="seal-verified">
                  <Check size={12} />
                  {t.mapScreen.visitedField}
                </span>
              ) : (
                <span className="badge-permission">
                  <MapPin size={12} />
                  {t.mapScreen.readyToListen}
                </span>
              )}
            </div>
          </div>

          <h3 className="preview-title">{activeNote.title}</h3>
          <div className="preview-location">{t.mapScreen.locPrefix} {activeNote.location}, {activeNote.region}</div>

          <blockquote className="preview-quote">
            “{activeNote.quote}”
          </blockquote>

          <div className="preview-custodian-bar">
            <div className="custodian-avatar-seal">
              <span>{activeNote.custodian.name[0]}</span>
            </div>
            <div>
              <div className="custodian-name">{activeNote.custodian.name}</div>
              <div className="custodian-role">{activeNote.custodian.role}</div>
            </div>
          </div>

          <div className="preview-actions">
            <button
              onClick={() => onOpenStory(activeNote)}
              className="btn btn-primary"
              aria-label={`Open full story for ${activeNote.title}`}
            >
              <span>{t.mapScreen.exploreBtn}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onOpenCustodian(activeNote)}
              className="btn btn-secondary"
            >
              {t.mapScreen.viewCustodianBtn}
            </button>
          </div>
        </aside>
      </div>

      {/* Map Legend Footer Bar */}
      <footer className="map-legend-bar" aria-label="Map legend">
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-sample standard-sample"></span>
            <span>{t.mapScreen.legend.standard}</span>
          </div>
          <div className="legend-item">
            <span className="legend-sample selected-sample"></span>
            <span>{t.mapScreen.legend.selected}</span>
          </div>
          <div className="legend-item">
            <span className="legend-sample completed-sample">✓</span>
            <span>{t.mapScreen.legend.completed}</span>
          </div>
          <div className="legend-item">
            <span className="legend-sample protected-sample"><Lock size={10}/></span>
            <span>{t.mapScreen.legend.protected}</span>
          </div>
          <div className="legend-item">
            <span className="legend-sample current-sample">◈</span>
            <span>{t.mapScreen.legend.traveller}</span>
          </div>
        </div>
      </footer>

      <style>{`
        .living-map-viewport {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 65px);
          overflow: hidden;
          background-color: var(--color-paper-50);
        }

        .map-toolbar {
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid var(--color-paper-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-paper-100);
          z-index: 10;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .map-heading {
          font-size: 1.4rem;
          margin-top: 0.15rem;
        }

        .map-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--color-paper-50);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-paper-200);
        }

        .filter-icon {
          color: var(--color-ink-500);
        }

        .filter-btn {
          border: none;
          background: transparent;
          font-size: 0.78rem;
          font-family: var(--font-ui);
          padding: 0.3rem 0.6rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          color: var(--color-ink-700);
          transition: all 150ms ease;
        }

        .filter-btn.active {
          background: var(--color-paper-200);
          color: var(--color-ink-900);
          font-weight: 600;
        }

        .zoom-controls {
          display: flex;
          gap: 0.3rem;
        }

        .map-action-btn {
          width: 30px;
          height: 30px;
          border: 1px solid var(--color-paper-200);
          background: var(--color-paper-50);
          color: var(--color-ink-900);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
        }

        .map-action-btn:hover {
          background: var(--color-paper-200);
        }

        .map-canvas-container {
          flex: 1;
          position: relative;
          display: flex;
          overflow: hidden;
        }

        .map-svg-wrapper {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
        }

        .illustrated-map-svg {
          width: 100%;
          height: 100%;
          max-height: calc(100vh - 130px);
          user-select: none;
        }

        .seal-circle {
          transition: transform 200ms ease, r 200ms ease;
        }

        .map-marker-group:hover .seal-circle {
          transform: scale(1.15);
        }

        .selected-ink-ring {
          animation: ringPulse 2.5s infinite ease-in-out;
        }

        @keyframes ringPulse {
          0%, 100% { stroke-width: 1.6; opacity: 0.8; }
          50% { stroke-width: 2.2; opacity: 1; }
        }

        /* Desktop Floating Story Preview Panel */
        .story-preview-sheet {
          position: absolute;
          right: 2rem;
          top: 2rem;
          bottom: 2rem;
          width: 380px;
          max-height: calc(100% - 4rem);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          z-index: 20;
          overflow-y: auto;
          box-shadow: var(--shadow-active);
          border: 1px solid var(--color-paper-300);
        }

        .preview-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .preview-title {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }

        .preview-location {
          font-size: 0.85rem;
          color: var(--color-ink-500);
          margin-bottom: 1.25rem;
        }

        .preview-quote {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-style: italic;
          color: var(--color-ink-900);
          line-height: 1.45;
          margin-bottom: 1.5rem;
          padding-left: 0.85rem;
          border-left: 2.5px solid var(--color-terracotta);
        }

        .preview-custodian-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--color-paper-50);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-paper-200);
          margin-bottom: 1.5rem;
        }

        .custodian-avatar-seal {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-paper-200);
          color: var(--color-ink-900);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-paper-300);
        }

        .custodian-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-ink-900);
        }

        .custodian-role {
          font-size: 0.78rem;
          color: var(--color-ink-500);
        }

        .preview-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Map Legend Footer Bar */
        .map-legend-bar {
          background-color: var(--color-paper-100);
          border-top: 1px solid var(--color-paper-200);
          padding: 0.5rem 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        .legend-items {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          font-size: 0.75rem;
          color: var(--color-ink-700);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .legend-sample {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #FFF;
        }

        .standard-sample { background-color: var(--color-terracotta); }
        .selected-sample { background-color: var(--color-terracotta); border: 2px solid var(--color-ink-900); }
        .completed-sample { background-color: var(--color-terracotta); }
        .protected-sample { background-color: var(--color-forest); }
        .current-sample { background-color: var(--color-ochre); }

        @media (max-width: 900px) {
          .story-preview-sheet {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            top: auto;
            width: 100%;
            max-height: 48vh;
            border-radius: 12px 12px 0 0;
            border-left: none;
            border-right: none;
            border-bottom: none;
            box-shadow: 0 -4px 25px rgba(41, 37, 31, 0.15);
          }

          .map-legend-bar {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
