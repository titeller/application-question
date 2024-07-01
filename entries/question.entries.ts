type TypeQuestionId = number;
type TypeQuestion = string;
type TypeQuestionAnswer = string;
type TypeQuestionOptions = string[];

interface IQuestion {
  id: TypeQuestionId;
  question: TypeQuestion;
  answer: TypeQuestionAnswer;
  options: TypeQuestionOptions;
}

type TypeQuestions = IQuestion[];

interface Answer {
  id: TypeQuestionId;
  answer: TypeQuestionAnswer;
}

type TypeAnswers = Answer[];