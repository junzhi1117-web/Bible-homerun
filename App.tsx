
import React, { useState, useCallback } from 'react';
import { questions } from './constants/questions';
import type { Question, HitType, LastScoreInfo, TeamIcons } from './types';
import QuestionGrid from './components/QuestionGrid';
import Scoreboard from './components/Scoreboard';
import BaseballDiamond from './components/BaseballDiamond';
import QuestionModal from './components/QuestionModal';
import ResetButton from './components/ResetButton';
import TeamNameInput from './components/TeamNameInput';

export type AnswerResult = 'correct' | 'incorrect' | 'foul';

// --- SOUND EFFECTS ---
// Cheerful, looping background music for the game
const backgroundMusic = new Audio('https://storage.googleapis.com/primordial-audio/music/docs-music/serene-and-peaceful-11-seconds-191983.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3; // Keep it subtle
backgroundMusic.preload = 'auto';

// A pleasant chime for every correct answer (successful hit)
const hitSuccessSound = new Audio('https://storage.googleapis.com/primordial-audio/sound-effects/docs-sound-effects/interface-hint-notification-91118.mp3');
hitSuccessSound.preload = 'auto';

// An exciting crowd cheer when runs are scored
const scoreCheerSound = new Audio('https://storage.googleapis.com/primordial-audio/sound-effects/docs-sound-effects/stadium-crowd-and-whistle-39446.mp3');
scoreCheerSound.preload = 'auto';
// --- END SOUND EFFECTS ---

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'setup' | 'playing'>('setup');
  const [teamNames, setTeamNames] = useState({ away: '客隊 (Away)', home: '主隊 (Home)' });
  const [teamIcons, setTeamIcons] = useState<TeamIcons>({ away: 'blue', home: 'red' });
  const [score, setScore] = useState<{ home: number; away: number }>({ home: 0, away: 0 });
  const [hits, setHits] = useState<{ home: number; away: number }>({ home: 0, away: 0 });
  const [inning, setInning] = useState<number>(1);
  const [topOfInning, setTopOfInning] = useState<boolean>(true);
  const [outs, setOuts] = useState<number>(0);
  const [bases, setBases] = useState<boolean[]>([false, false, false]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [animationState, setAnimationState] = useState<{ type: HitType; startBases: boolean[] } | null>(null);
  const [lastScore, setLastScore] = useState<LastScoreInfo>(null);
  const [isStrikeout, setIsStrikeout] = useState<boolean>(false);

  const handleStartGame = useCallback((details: { names: { away: string; home: string }, icons: TeamIcons }) => {
    setTeamNames(details.names);
    setTeamIcons(details.icons);
    setGameState('playing');
    backgroundMusic.play().catch(error => console.log("Audio play failed:", error));
  }, []);

  const handleChangeSide = useCallback(() => {
    setOuts(0);
    setBases([false, false, false]);

    if (topOfInning) {
      setTopOfInning(false);
    } else {
      setTopOfInning(true);
      setInning(prev => prev + 1);
    }
  }, [topOfInning]);

  const handleResetGame = useCallback(() => {
    setScore({ home: 0, away: 0 });
    setHits({ home: 0, away: 0 });
    setInning(1);
    setTopOfInning(true);
    setOuts(0);
    setBases([false, false, false]);
    setAnsweredQuestions(new Set());
    setCurrentQuestion(null);
    setAnimationState(null);
    setLastScore(null);
    setIsStrikeout(false);
    setGameState('setup');
    setTeamIcons({ away: 'blue', home: 'red' });
    
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }, []);

  const handleQuestionSelect = useCallback((question: Question) => {
    if (!answeredQuestions.has(question.id)) {
      setCurrentQuestion(question);
    }
  }, [answeredQuestions]);

  const handleCloseModal = useCallback(() => {
    setCurrentQuestion(null);
  }, []);

  const handleAnswer = useCallback((result: AnswerResult) => {
    if (!currentQuestion) return;

    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));

    if (result === 'incorrect') {
      handleCloseModal();
      setIsStrikeout(true);
      const animationDuration = 1500;
      setTimeout(() => {
        const newOuts = outs + 1;
        if (newOuts >= 3) {
          handleChangeSide();
        } else {
          setOuts(newOuts);
        }
        setIsStrikeout(false);
      }, animationDuration);
    } else if (result === 'foul') {
      handleCloseModal();
    } else if (result === 'correct') {
      hitSuccessSound.currentTime = 0;
      hitSuccessSound.play().catch(console.error);

      setAnimationState({ type: currentQuestion.type, startBases: bases });
      const animationDuration = 2000;

      setTimeout(() => {
        const hitType = currentQuestion.type;
        const startBases = [...bases];
        let runsScored = 0;
        let newBasesState: boolean[] = [false, false, false];

        switch (hitType) {
          case 'HR':
            runsScored = 1 + startBases.filter(Boolean).length;
            newBasesState = [false, false, false];
            break;
          case '3B':
            runsScored = startBases.filter(Boolean).length;
            newBasesState = [false, false, true];
            break;
          case '2B':
            if (startBases[2]) runsScored++;
            if (startBases[1]) runsScored++;
            const runnerOnFirstAdvancesToThird = startBases[0];
            newBasesState = [false, true, runnerOnFirstAdvancesToThird];
            break;
          case '1B':
            if (startBases[2]) runsScored++;
            const runnerFromSecondToThird = startBases[1];
            const runnerFromFirstToSecond = startBases[0];
            newBasesState = [true, runnerFromFirstToSecond, runnerFromSecondToThird];
            break;
        }

        setBases(newBasesState);
        const battingTeam = topOfInning ? 'away' : 'home';
        
        setHits(prev => ({
          ...prev,
          [battingTeam]: prev[battingTeam] + 1,
        }));

        if (runsScored > 0) {
          scoreCheerSound.currentTime = 0;
          scoreCheerSound.play().catch(console.error);

          setScore(prev => ({
            ...prev,
            [battingTeam]: prev[battingTeam] + runsScored,
          }));
          setLastScore({ team: battingTeam, runs: runsScored, key: Date.now() });
        }
        
        setAnimationState(null);
      }, animationDuration);

      handleCloseModal();
    }
  }, [currentQuestion, bases, outs, topOfInning, handleCloseModal, handleChangeSide]);

  const battingTeam = topOfInning ? 'away' : 'home';

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center font-sans">
      {gameState === 'setup' ? (
        <TeamNameInput onStartGame={handleStartGame} />
      ) : (
        <>
          <header className="w-full max-w-7xl text-center mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-gray-800">
              聖經全壘打
            </h1>
            <p className="text-lg text-gray-500">Bible Home Run</p>
          </header>

          <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Scoreboard score={score} hits={hits} outs={outs} inning={inning} topOfInning={topOfInning} lastScore={lastScore} teamNames={teamNames} />
              <BaseballDiamond 
                bases={bases} 
                animationState={animationState} 
                lastScore={lastScore} 
                isStrikeout={isStrikeout}
                teamIcons={teamIcons}
                battingTeam={battingTeam}
              />
              <ResetButton onReset={handleResetGame} />
            </div>
            <div className="lg:col-span-2">
              <QuestionGrid 
                questions={questions} 
                answeredQuestions={answeredQuestions}
                onQuestionSelect={handleQuestionSelect} 
              />
            </div>
          </main>
          
          {currentQuestion && (
            <QuestionModal
              question={currentQuestion}
              onClose={handleCloseModal}
              onAnswer={handleAnswer}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
