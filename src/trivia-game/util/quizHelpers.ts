import { TriviaGame, type TriviaGameInterface } from "../types/types"

export const numberOfQuestions = (state: TriviaGameInterface) => {
    if (state.state === TriviaGame.playing)
    return `${state.currentQuestion + 1}/${state.questions.length}`
  }
export const getDifficulty = (state: TriviaGameInterface) => {
    if (state.state === TriviaGame.playing)
    return state.questions[state.currentQuestion].difficulty
  }
export const getColorMatchingDifficulty = (state: TriviaGameInterface) => {
    if (state.state === TriviaGame.playing) {
      const difficulty = getDifficulty(state)
      return difficulty === 'easy' ? 'text-green-500' : difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
    }
    return ''
  }