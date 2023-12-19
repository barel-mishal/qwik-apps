import { type QuizQuestionReady, type QuizResponse } from "../types/types"
import { server$ } from "@builder.io/qwik-city";

export const tenQuestions = [
    {
      "type": "multiple choice",
      "difficulty": "easy",
      "category": "General Knowledge",
      "question": "What is the capital of France?",
      "correct_answer": "Paris",
      "incorrect_answers": ["London", "Berlin", "Madrid"]
    },
    {
      "type": "true/false",
      "difficulty": "medium",
      "category": "Science",
      "question": "Water boils at 100 degrees Celsius.",
      "correct_answer": "True",
      "incorrect_answers": ["False"]
    },
    {
      "type": "multiple choice",
      "difficulty": "hard",
      "category": "History",
      "question": "Who was the first Roman Emperor?",
      "correct_answer": "Augustus",
      "incorrect_answers": ["Julius Caesar", "Nero", "Caligula"]
    },
    {
      "type": "multiple choice",
      "difficulty": "easy",
      "category": "Entertainment",
      "question": "Who wrote 'Harry Potter'?",
      "correct_answer": "J.K. Rowling",
      "incorrect_answers": ["J.R.R. Tolkien", "Roald Dahl", "Stephen King"]
    },
    {
      "type": "true/false",
      "difficulty": "medium",
      "category": "Science",
      "question": "The human skeleton is made up of less than 100 bones.",
      "correct_answer": "False",
      "incorrect_answers": ["True"]
    },
    {
      "type": "multiple choice",
      "difficulty": "easy",
      "category": "General Knowledge",
      "question": "What is the largest planet in our Solar System?",
      "correct_answer": "Jupiter",
      "incorrect_answers": ["Earth", "Saturn", "Neptune"]
    },
    {
      "type": "multiple choice",
      "difficulty": "hard",
      "category": "Technology",
      "question": "In what year was the first iPhone released?",
      "correct_answer": "2007",
      "incorrect_answers": ["2005", "2006", "2008"]
    },
    {
      "type": "multiple choice",
      "difficulty": "medium",
      "category": "Geography",
      "question": "Which country has the longest coastline in the world?",
      "correct_answer": "Canada",
      "incorrect_answers": ["Russia", "Australia", "USA"]
    },
    {
      "type": "true/false",
      "difficulty": "easy",
      "category": "Science",
      "question": "Light travels faster than sound.",
      "correct_answer": "True",
      "incorrect_answers": ["False"]
    },
    {
      "type": "multiple choice",
      "difficulty": "medium",
      "category": "Art",
      "question": "Who painted the Mona Lisa?",
      "correct_answer": "Leonardo da Vinci",
      "incorrect_answers": ["Vincent Van Gogh", "Pablo Picasso", "Michelangelo"]
    }
  ]

const getQuiz = server$(async () => {
    
    const data = await fetch("https://opentdb.com/api.php?amount=10&category=18").then<QuizResponse>((res) => {
        return res.json()
    }).catch((err) => {
        console.error(err);
        return {
            "response_code": 1,
            "results": tenQuestions
          } as QuizResponse
    });
    
    const  shuffleArray = <T>(array: T[]) => {
        return [...array].sort(() => Math.random() - 0.5);
    }
    
    const  getAnswers = (question: QuizResponse['results'][number]) => {
        return shuffleArray([...question.incorrect_answers, question.correct_answer])
    }
    
    const  getQuestionTime = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return 60;
            case "medium":
                return 90;
            case "hard":
                return 120;
            default:
                return 30;
        }
    }
    
    const getQuestion = (question: QuizResponse['results'][number]): QuizQuestionReady =>  {
        return {
            ...question,
            answers: shuffleArray(getAnswers(question)),
            answered: "",
            questionTime: getQuestionTime(question.difficulty),
        }
    }

    return {result: data.results.map(getQuestion)}
})

export default getQuiz;