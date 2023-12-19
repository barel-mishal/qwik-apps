/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import SuccessSharacter from '~/media/photos/success_character.png?jsx';
import FailedCharacter from '~/media/photos/failed_character.png?jsx';
import { $, type Signal, component$, useSignal, useComputed$, type QRL, useVisibleTask$, Fragment, useTask$ } from '@builder.io/qwik';
import { routeAction$ } from '@builder.io/qwik-city';
import getQuiz from '~/trivia-game/services/quiz';
import { TriviaGame, type TriviaPlaying, type TriviaGameInterface, type TriviaGameOver } from '~/trivia-game/types/types';
import SplashLogo from '~/media/photos/splash_logo.png';
import Logo from '~/media/photos/logo.png';

export const useLoadTriviaGame = routeAction$(async () => {
  // TODO: PLACE QUIZE 4/10
  // TODO: PRODUCTION
  return await getQuiz();
}); 

export default component$(() => {
  const signalState = useSignal<TriviaGameInterface>({
    state: TriviaGame.start
  });
  const endGame = $((state: TriviaPlaying) => {
    const currectlyAnswered = state.questions.filter(question => question.correct_answer === question.answered).length;
    const numQuestions = state.questions.length;
    const newState: TriviaGameOver = {
      score: currectlyAnswered === state.questions.length,
      summaryAnswered: `${currectlyAnswered}/${numQuestions}`,
      state: TriviaGame.stop
    }
    signalState.value = newState;
  });
  const stop = $(async () => {
    if (signalState.value.state !== TriviaGame.playing) return;
    const isFinished = signalState.value.currentQuestion + 1 === signalState.value.questions.length;
    if (isFinished) {
      await endGame(signalState.value);
    }
  });
  const triviaGame = useLoadTriviaGame();
  const startGame = $(async () => {
    const value = await triviaGame.submit();
    if (value.status !== 200) return;
    signalState.value = {
      state: TriviaGame.playing,
      currentQuestion: 0,
      questions: value.value.result
    };
  });  
  return (
    <div class={''}>
      {signalState.value.state === TriviaGame.start 
      && <Start key={'TriviaStart'} play={signalState as Signal<TriviaGameInterface>} startGame={startGame} />}
      
      {signalState.value.state === TriviaGame.playing 
      && <Playing key={'TriviaPlaying'} play={signalState as Signal<TriviaPlaying>} stop={stop} endGame={endGame} />}

      {signalState.value.state === TriviaGame.stop 
      && <EndGame key={'TriviaEndGame'} state={signalState.value as TriviaGameOver} startGame={startGame} srcLogoPhoto={Logo} srcCharacter={SplashLogo} textResult={signalState.value.score ? 'GREAT JOB' : 'FAILED'} textSummary={signalState.value.summaryAnswered} />}
    </div>
  );
});

export const Start = component$((props: {
    play: Signal<TriviaGameInterface>,
    startGame: QRL<() => Promise<void>>
  }) => {
  return (
    <div class={'h-screen grid grid-rows-[1fr,90px] gap-2 p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 from-0% to-blue-800 to-70%'}>
      <img src={SplashLogo} class="place-self-center p-2" width={297} height={459} alt="" />
      <button class={'p-2 bg-blue-50 text-blue-950 rounded-2xl text-3xl font-extrabold tracking-wider'} onClick$={props.startGame}>START</button>
    </div>
  );
});

export const Playing = component$((props: {play: Signal<TriviaPlaying>, stop: QRL<() => void>, endGame: QRL<(state: TriviaPlaying) => void>}) => {  
  const computeQuestion = useComputed$(() => {
    return props.play.value.questions?.at(props.play.value?.currentQuestion);
  });
  
  const computeNext = useComputed$(() => {
    const next = props.play.value.currentQuestion + 1;
    if (next === props.play.value.questions?.length) return props.play.value?.currentQuestion;
    return next;
  });
  const next = $(() => {
    const newState = {
      ...props.play.value,
      currentQuestion: computeNext.value
    }
    props.play.value = newState
  });
  const selectAnswer = $((answer: string) => {
    const newQuestion: TriviaPlaying['questions'][number] = {
      ...computeQuestion.value!,
      answered: answer
    }
    const newQuestions = props.play.value.questions.map((question, index) => {
      if (index === props.play.value.currentQuestion) {
        return newQuestion;
      }
      return question;
    });
    props.play.value = {
      ...props.play.value,
      questions: newQuestions
    }
  });
  const time = useSignal<number>(props.play.value.questions.length * 10);
  // eslint-disable-next-line qwik/no-use-visible-task
  useTask$(({track}) => {  
    const value = track(() => time.value);    
    if (value === 0) 
    props.endGame(props.play.value);
  });
  return (
    <div class={'grid'}>
        <div class="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 from-0% to-blue-800 to-70%">
          <nav class="p-4">
            <ul class="grid grid-cols-[auto,auto,1fr] gap-2 items-center">
              <li class="text-white no-underline font-bold text-2xl">Question</li>
              <li class="text-white no-underline font-bold text-2xl">{props.play.value.questions.length}</li>
              <li class="justify-self-end"><img src={Logo} width={436/8} height={429/8} alt="" /></li>
            </ul>
          </nav>
        </div>
      <div class={'grid p-4 gap-7'}>
        <p class="text-slate-800 text-sm">Level: <span class={`font-bold ${getColorMatchingDifficulty(props.play.value)}`}>{getDifficulty(props.play.value)?.toUpperCase()}</span></p>
        <h2 class="text-3xl font-normal tracking-wide text-slate-700">{decode(computeQuestion.value?.question ?? "")}</h2>
        <div class={'flex flex-col gap-4'}>
          {computeQuestion.value?.answers.map((answer) => {
            return <button key={answer} class={'min-h-[80px] rounded-2xl text-2xl font-bold text-slate-700 bg-slate-200 text-left p-4'} onClick$={[$(() => selectAnswer(answer)), next, props.stop]}>{decode(answer)}</button>
          })}
        </div>

        <button onClick$={[next, props.stop]} class={'rounded-full border-sky-700 border-[10px] text-3xl font-extrabold text-sky-700 w-32 h-32 place-self-center'}>
          <TimerQuestion time={time} />
        </button>
      </div>
    </div>
  );
});

export const TimerQuestion = component$((props: {
  time: Signal<number>
  }) => {
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({cleanup}) => {
      const interval = setInterval(() => {
        props.time.value = props.time.value - 1;
      }, 1000);
      return cleanup(() => {
        clearInterval(interval);
      });
    }, {strategy: 'document-ready'});
  return (
    <Fragment key={'time.value'}>
      {props.time.value}
    </Fragment>
  );
});

export const getColorMatchingDifficulty = (state: TriviaGameInterface) => {
  if (state.state === TriviaGame.playing) {
    const difficulty = getDifficulty(state)
    return difficulty === 'easy' ? 'text-green-500' : difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
  }
  return ''
}
export const decode = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
export const getDifficulty = (state: TriviaGameInterface) => {
  if (state.state === TriviaGame.playing)
  return state.questions[state.currentQuestion].difficulty
}

export const EndGame = (props: {
    state: TriviaGameOver, 
    startGame: () => void, 
    srcLogoPhoto: string, 
    srcCharacter: string, 
    textResult: 'FAILED' | 'GREAT JOB',
    textSummary: string
  }) => {

  return <div class={`h-screen tracking-wider`}>
  <div class={`${props.state.score ? 'bg-green-600' : 'bg-red-600' }`}>
    <nav class="p-4">
      <ul class="grid grid-cols-1 gap-2 items-center ">
        <li class="justify-self-end"><img src={props.srcLogoPhoto} width={436/8} height={429/8} alt="" /></li>
      </ul>
    </nav>
  </div>
  <div class="grid gap-2 mt-8 place-items-center p-2 tracking-wider text-center [text-wrap:balance]">
    <h3 class={`text-6xl ${props.state.score ? 'text-green-600' : 'text-red-600' } font-extrabold`}>{props.textResult}</h3>
    <p class="text-2xl text-gray-800">{props.textSummary}</p>
    <p class="text-gray-800 text-">{props.state.summaryAnswered}</p>
    {props.state.score ? 
    <SuccessSharacter class=" place-self-center p-2" alt="" /> 
    : <FailedCharacter class=" place-self-center p-2" alt="" />}
    
    

    <button class="p-4 text-blue-50 bg-blue-950 rounded-2xl text-2xl font-extrabold tracking-wider" onClick$={props.startGame}>Start New Game</button>
  </div>
  </div>
}