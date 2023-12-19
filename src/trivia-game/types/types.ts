
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface QuizResponse {
    response_code: number;
    results: QuizQuestion[];
  }
  
interface QuizQuestion {
    type: string;
    difficulty: 'medium' | 'hard' | 'easy';
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }
  
  export interface QuizQuestionReady extends QuizQuestion {
    answers: string[];
    answered: string;
    questionTime: number;
  }

  export const TriviaGame = {
    start:'start',
    playing:'playing',
    stop:'stop',
    loading:'loading',
  } as const;

  export interface TriviaStart {
    state: typeof TriviaGame.start,
  }
  export interface TriviaPlaying {
    state: typeof TriviaGame.playing,
    questions: QuizQuestionReady[],
    currentQuestion: number,
  }
  export interface TriviaGameOver {
    state: typeof TriviaGame.stop,
    score: boolean,
    summaryAnswered: string;
  }
  export interface TriviaLoading {
    state: typeof TriviaGame.loading,
  }
  
  export type TriviaGameInterface = TriviaStart | TriviaPlaying | TriviaGameOver | TriviaLoading;

  