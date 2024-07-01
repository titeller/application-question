import { StyleSheet, Button, ScrollView, TextStyle } from "react-native";
import { useEffect, useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { allQuestions } from "@/constants/question";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questions, setQuestions] = useState<TypeQuestions>([]);
  const [answers, setAnwsers] = useState<TypeAnswers>([]);
  const [score, setScore] = useState<string | null>();
  useEffect(() => {
    const questionGenerated = allQuestions
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setQuestions(questionGenerated);
    setIsLoading(false);
  }, []);

  const onAnswerSelected = (optionAnswer: TypeQuestionAnswer): void => {
    const isAnswerExisted = answers.some(
      (answer) => answer.id === questions[currentQuestion].id
    );
    if (!isAnswerExisted) {
      setAnwsers([
        ...answers,
        {
          id: questions[currentQuestion].id,
          answer: optionAnswer,
        },
      ]);
    } else {
      const updateAnswers = answers.map((answer) => {
        if (answer.id === questions[currentQuestion].id) {
          return {
            ...answer,
            answer: optionAnswer,
          };
        }
        return answer;
      });
      setAnwsers(updateAnswers);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const onBackPressed = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const onCalculateScore = () => {
    const scoreCounted = answers.reduce((accumulator, answer) => {
      const question = questions.find((question) => question.id === answer.id);
      if (question?.answer === answer.answer) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
    const scorePercentage = Math.ceil((scoreCounted / questions.length) * 100);

    setScore(scorePercentage.toString());
  };

  const onTryAgain = () => {
    setIsLoading(true);
    const questionGenerated = allQuestions
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setQuestions(questionGenerated);
    setCurrentQuestion(0);
    setAnwsers([]);
    setScore(null);
    setIsLoading(false);
  };

  const getOptionResultColor = (
    question: IQuestion,
    option: string
  ): TextStyle => {
    const userAnswer = answers.find((answer) => answer.id === question.id);
    if (option === userAnswer?.answer && question.answer === userAnswer?.answer)
      return {
        color: "green",
        fontWeight: 800,
      };
    else if (
      option === userAnswer?.answer &&
      question.answer !== userAnswer?.answer
    )
      return {
        color: "red",
        fontWeight: 800,
      };

    if (option !== userAnswer?.answer && option === question.answer)
      return {
        color: "green",
        fontWeight: 800,
      };
    return {
      color: "gray",
    };
  };

  const questionDisplay = questions[currentQuestion];

  return (
    <ThemedView style={styles.container}>
      {isLoading && <ThemedText>Loading...</ThemedText>}
      {!score && !isLoading && (
        <>
          <ThemedView style={styles.currentQuestion}>
            <ThemedText type="defaultSemiBold">{`Question ${
              currentQuestion + 1
            }/${questions.length}`}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.questionContainer}>
            <ThemedText>{questionDisplay.question}</ThemedText>
            {questionDisplay.options.map((option, index) => (
              <ThemedView key={index} style={styles.questionOption}>
                <Button
                  title={option}
                  onPress={() => onAnswerSelected(option)}
                />
              </ThemedView>
            ))}
            <ThemedView style={styles.questionFooter}>
              {currentQuestion > 0 && (
                <ThemedView style={styles.questionFooterLeft}>
                  <Button title="Back" color="#555" onPress={onBackPressed} />
                </ThemedView>
              )}
              {answers.length === questions.length && (
                <ThemedView style={styles.questionFooterRight}>
                  <Button
                    title="Check your score"
                    color="green"
                    onPress={onCalculateScore}
                  />
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>
        </>
      )}
      {score && !isLoading && (
        <ScrollView>
          <ThemedView style={styles.scoreContainer}>
            <TabBarIcon
              name="ribbon"
              color="green"
              style={{ fontSize: 72, marginBottom: 10 }}
            />
            <ThemedText style={styles.scoreTitle} type="defaultSemiBold">
              Your score
            </ThemedText>
            <ThemedText
              style={styles.score}
              type="title"
            >{`${score} / 100`}</ThemedText>
            <Button title="Try Again" onPress={onTryAgain} />
            <ThemedView
              style={{
                alignItems: "flex-start",
                flex: 1,
                marginTop: 20,
                paddingHorizontal: 10,
              }}
            >
              <ThemedView
                style={{
                  flex: 1,
                  gap: 10,
                }}
              >
                <ThemedText type="defaultSemiBold">Question results</ThemedText>
                {questions.map((question) => (
                  <ThemedView
                    style={{
                      ...styles.questionResult,
                    }}
                    key={question.id}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{
                        fontSize: 13,
                      }}
                    >
                      {question.question}
                    </ThemedText>
                    {question.options.map((option, index) => (
                      <ThemedText
                        key={index}
                        style={{
                          ...styles.questionOption,
                          fontSize: 13,
                          ...getOptionResultColor(question, option),
                        }}
                      >
                        {option}
                      </ThemedText>
                    ))}
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  currentQuestion: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  questionContainer: {
    flex: 1,
    padding: 10,
  },
  questionOption: {
    marginTop: 10,
  },
  questionFooter: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  questionFooterLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  questionFooterRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  scoreContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
  },
  scoreTitle: {
    marginBottom: 10,
  },
  score: {
    marginBottom: 30,
  },
  questionResult: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#e9e9e9",
  },
});
