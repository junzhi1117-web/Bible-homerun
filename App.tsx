
import React, { useState, useCallback } from 'react';
import { fullQuestionBank } from './constants/questions';
import type { Question, HitType, LastScoreInfo, TeamIcons, BattingStrategy, GameState } from './types';
import QuestionGrid from './components/QuestionGrid';
import Scoreboard from './components/Scoreboard';
import BaseballDiamond from './components/BaseballDiamond';
import QuestionModal from './components/QuestionModal';
import ResetButton from './components/ResetButton';
import TeamNameInput from './components/TeamNameInput';
import StrategyChoice from './components/StrategyChoice';
import CommentaryBox from './components/CommentaryBox';
import GameOver from './components/GameOver';

export type AnswerResult = 'correct' | 'incorrect' | 'foul';

// --- SOUND EFFECTS ---
const backgroundMusic = new Audio('https://storage.googleapis.com/tfjs-speech-commands-misc/Jalastram/background_music/playful.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;
backgroundMusic.preload = 'auto';

const batCrackSound = new Audio('https://storage.googleapis.com/tfjs-speech-commands-misc/Jalastram/sfx/hit_baseball.mp3');
batCrackSound.preload = 'auto';

const strikeoutSound = new Audio('https://storage.googleapis.com/tfjs-speech-commands-misc/Jalastram/sfx/swoosh.mp3');
strikeoutSound.preload = 'auto';

const crowdSighSound = new Audio('https://storage.googleapis.com/tfjs-speech-commands-misc/Jalastram/sfx/crowd_disappointed.mp3');
crowdSighSound.preload = 'auto';

const scoreCheerSound = new Audio('https://storage.googleapis.com/tfjs-speech-commands-misc/Jalastram/sfx/crowd_cheer.mp3');
scoreCheerSound.preload = 'auto';
// --- END SOUND EFFECTS ---

const selectRandomQuestions = (allQuestions: Question[], count: number): Question[] => {
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map((q, index) => ({ ...q, id: index + 1 }));
};

const hitTypeDescription: { [key in HitType]: string } = {
  '1B': '巧妙的一壘安打',
  '2B': '深遠的二壘安打',
  '3B': '貼著邊線的三壘安打',
  'HR': '石破天驚的全壘打',
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
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
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [battingStrategy, setBattingStrategy] = useState<BattingStrategy | null>(null);
  const [commentary, setCommentary] = useState('設定隊伍後，比賽即將開始！');


  const handleStartGame = useCallback((details: { names: { away: string; home: string }, icons: TeamIcons }) => {
    const selectedQuestions = selectRandomQuestions(fullQuestionBank, 64);
    setGameQuestions(selectedQuestions);
    
    setAnsweredQuestions(new Set());
    setScore({ home: 0, away: 0 });
    setHits({ home: 0, away: 0 });
    setInning(1);
    setTopOfInning(true);
    setOuts(0);
    setBases([false, false, false]);
    setBattingStrategy(null);
    setCommentary(`比賽開始！輪到 ${details.names.away} 進攻，請選擇打擊策略。`);

    setTeamNames(details.names);
    setTeamIcons(details.icons);
    setGameState('playing');
    backgroundMusic.play().catch(error => console.log("Audio play failed:", error));
  }, []);

  const handleChangeSide = useCallback(() => {
    setOuts(0);
    setBases([false, false, false]);
    setBattingStrategy(null);

    if (topOfInning) { // Top of inning ends, switch to bottom
      setTopOfInning(false);
      setCommentary(`第 ${inning} 局下半，輪到 ${teamNames.home} 進攻。`);
    } else { // Bottom of inning ends
      if (inning >= 3) {
        setGameState('gameover');
        const winner = score.home > score.away ? teamNames.home : teamNames.away;
        const tie = score.home === score.away;
        if (tie) {
            setCommentary(`三局惡戰，雙方平手！`);
        } else {
            setCommentary(`比賽結束！恭喜 ${winner} 以 ${Math.max(score.home, score.away)} 比 ${Math.min(score.home, score.away)} 獲勝！`);
        }
        backgroundMusic.pause();
        return;
      }
      setTopOfInning(true);
      setInning(prev => prev + 1);
      setCommentary(`第 ${inning + 1} 局上半，輪到 ${teamNames.away} 進攻。`);
    }
  }, [topOfInning, inning, teamNames, score]);

  const handleResetGame = useCallback(() => {
    setGameState('setup');
    setTeamIcons({ away: 'blue', home: 'red' });
    setCommentary('設定隊伍後，比賽即將開始！');
    
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }, []);

  const handleQuestionSelect = useCallback((question: Question) => {
    if (!answeredQuestions.has(question.id) && battingStrategy) {
      setCurrentQuestion(question);
    }
  }, [answeredQuestions, battingStrategy]);

  const handleCloseModal = useCallback(() => {
    setCurrentQuestion(null);
  }, []);

  const handleAnswer = useCallback((result: AnswerResult) => {
    if (!currentQuestion) return;

    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));
    const battingTeamName = topOfInning ? teamNames.away : teamNames.home;

    if (result === 'incorrect') {
      const outsToAdd = battingStrategy === 'power' ? 2 : 1;
      
      strikeoutSound.currentTime = 0;
      strikeoutSound.play().catch(console.error);
      crowdSighSound.currentTime = 0;
      crowdSighSound.play().catch(console.error);
      
      handleCloseModal();
      setIsStrikeout(true);
      const animationDuration = 1500;
      const outsComment = outsToAdd === 2 ? "一個致命的雙殺" : "遭到三振";
      setCommentary(`喔不！${battingTeamName} 的打者揮棒落空，造成${outsComment}出局！`);


      setTimeout(() => {
        const newOuts = outs + outsToAdd;
        if (newOuts >= 3) {
          handleChangeSide();
        } else {
          setOuts(newOuts);
          setCommentary(`輪到下一位打者，請選擇打擊策略。`);
        }
        setIsStrikeout(false);
        setBattingStrategy(null);
      }, animationDuration);

    } else if (result === 'foul') {
      setCommentary("界外球！打者還有一次機會。");
      handleCloseModal();
    } else if (result === 'correct') {
      batCrackSound.currentTime = 0;
      batCrackSound.play().catch(console.error);
      
      let effectiveHitType: HitType = currentQuestion.type;
      if (battingStrategy === 'power') {
        if (effectiveHitType === '1B') effectiveHitType = '2B';
        else effectiveHitType = 'HR';
      }

      setAnimationState({ type: effectiveHitType, startBases: bases });
      const animationDuration = 2000;

      setTimeout(() => {
        const startBases = [...bases];
        let runsScored = 0;
        let newBasesState: boolean[] = [false, false, false];

        switch (effectiveHitType) {
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
            newBasesState = [false, true, startBases[0]];
            break;
          case '1B':
            if (startBases[2]) runsScored++;
            newBasesState = [true, startBases[0], startBases[1]];
            break;
        }

        let commentaryText = `${battingTeamName} 的打者擊出了${hitTypeDescription[effectiveHitType]}！`;
        if (runsScored > 0) {
            commentaryText += ` 成功打下 ${runsScored} 分！全場歡聲雷動！`;
        }

        setBases(newBasesState);
        const battingTeam = topOfInning ? 'away' : 'home';
        
        setHits(prev => ({ ...prev, [battingTeam]: prev[battingTeam] + 1 }));

        if (runsScored > 0) {
          scoreCheerSound.currentTime = 0;
          scoreCheerSound.play().catch(console.error);
          setScore(prev => ({ ...prev, [battingTeam]: prev[battingTeam] + runsScored }));
          setLastScore({ team: battingTeam, runs: runsScored, key: Date.now() });
        }
        
        setCommentary(commentaryText);
        setAnimationState(null);
        setBattingStrategy(null);
      }, animationDuration);

      handleCloseModal();
    }
  }, [currentQuestion, bases, outs, topOfInning, battingStrategy, teamNames, handleCloseModal, handleChangeSide]);

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
              <CommentaryBox text={commentary} key={commentary} />
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
            <div className="lg:col-span-2 relative">
               <QuestionGrid 
                questions={gameQuestions} 
                answeredQuestions={answeredQuestions}
                onQuestionSelect={handleQuestionSelect}
              />
              {battingStrategy === null && gameState === 'playing' && (
                <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                    <StrategyChoice onSelect={setBattingStrategy} />
                </div>
              )}
            </div>
          </main>
          
          {currentQuestion && (
            <QuestionModal
              question={currentQuestion}
              onClose={handleCloseModal}
              onAnswer={handleAnswer}
            />
          )}

          {gameState === 'gameover' && (
            <GameOver finalCommentary={commentary} onPlayAgain={handleResetGame} />
          )}
        </>
      )}
    </div>
  );
};

export default App;