import React, { useState, useEffect } from 'react';
import { NavigationHeader } from './components/NavigationHeader';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { LivingMap } from './components/LivingMap';
import { StoryScroll } from './components/StoryScroll';
import { CustodianProfile } from './components/CustodianProfile';
import { JourneyComplete } from './components/JourneyComplete';
import { FIELD_NOTES, LANGUAGES } from './data/fieldNotesData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES[0]); // defaults to English
  const [notes, setNotes] = useState(FIELD_NOTES);
  const [selectedNote, setSelectedNote] = useState(FIELD_NOTES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track viewport width for mobile bottom-sheet behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handlers for screen transitions
  const handleOpenStory = (note) => {
    setSelectedNote(note);
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, status: n.status === 'protected' ? 'protected' : 'selected' } : n));
    setCurrentScreen(4); // Screen 04: Story Scroll
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleOpenCustodian = (note) => {
    if (note) setSelectedNote(note);
    setCurrentScreen(5); // Screen 05: Custodian Profile
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleCompleteJourney = () => {
    if (selectedNote && selectedNote.status !== 'protected') {
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, status: 'completed' } : n));
    }
    setCurrentScreen(6); // Screen 06: Journey Complete
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleReturnToMap = () => {
    setCurrentScreen(3); // Screen 03: Living Map
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleStartNewRegion = () => {
    const nextNote = notes.find(n => n.id === 'field-note-09') || notes[0];
    setSelectedNote(nextNote);
    setCurrentScreen(3);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className={`app-root ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast-mode' : ''}`}>
      <NavigationHeader
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
        isPlayingAudio={isPlayingAudio}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      <main className="main-content" id="main-content" role="main">
        {currentScreen === 1 && (
          <WelcomeScreen
            onBegin={() => setCurrentScreen(2)}
            activeLanguage={activeLanguage}
          />
        )}

        {currentScreen === 2 && (
          <LanguageScreen
            activeLanguage={activeLanguage}
            setActiveLanguage={setActiveLanguage}
            onConfirm={() => setCurrentScreen(3)}
          />
        )}

        {currentScreen === 3 && (
          <LivingMap
            fieldNotes={notes}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            onOpenStory={handleOpenStory}
            onOpenCustodian={handleOpenCustodian}
            isMobile={isMobile}
            activeLanguage={activeLanguage}
          />
        )}

        {currentScreen === 4 && (
          <StoryScroll
            note={selectedNote}
            activeLanguage={activeLanguage}
            onBackToMap={handleReturnToMap}
            onOpenCustodian={() => handleOpenCustodian(selectedNote)}
            onCompleteJourney={handleCompleteJourney}
            onAudioPlayStateChange={setIsPlayingAudio}
          />
        )}

        {currentScreen === 5 && (
          <CustodianProfile
            note={selectedNote}
            activeLanguage={activeLanguage}
            onBackToStory={() => setCurrentScreen(4)}
            onCompleteJourney={handleCompleteJourney}
          />
        )}

        {currentScreen === 6 && (
          <JourneyComplete
            completedNotes={notes.filter(n => n.status === 'completed')}
            activeLanguage={activeLanguage}
            onReturnToMap={handleReturnToMap}
            onStartNewRegion={handleStartNewRegion}
          />
        )}
      </main>

      <style>{`
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--color-paper-50);
          color: var(--color-ink-900);
        }

        .high-contrast-mode {
          --color-paper-50: #FAF8F2;
          --color-paper-100: #FFFFFF;
          --color-paper-200: #B8A682;
          --color-ink-900: #000000;
          --color-ink-700: #1C1914;
          --color-ink-500: #3D3528;
          --color-terracotta: #872E14;
          --color-forest: #214326;
        }

        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `}</style>
    </div>
  );
}
