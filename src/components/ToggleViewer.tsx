import questionData from "../../questions.json";
import { useEffect, useState } from "react";

interface Questions {
  question: string;
  answers: {
    correctOption: string;
    incorrectOption: string;
  }[];
}

export const ToggleView = () => {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [toggleStates, setToggleStates] = useState<boolean[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  useEffect(() => {
    setQuestions(questionData as Questions[]);
    setToggleStates(new Array(questionData[0]?.answers.length).fill(false));
  }, []);

  const allCorrect = correctAnswers === toggleStates.length;

  const getBackgroundColour = () => {
    const ratio = toggleStates.length > 0 ? correctAnswers / toggleStates.length : 0;
    if (ratio == 1) return "linear-gradient(180deg, #76E0C2 0%, #59CADA 100%)";
    if (ratio >= 0.66) return "linear-gradient(180deg, #fee351 0%, #ffb900 100%)";
    if (ratio >= 0.33) return "linear-gradient(180deg, #ffce55 0%, #ff9700 100%)";
    return "linear-gradient(180deg, #F6B868 0%, #EE6B2D 100%)";
  };

  const toggleAnswer = (index: number) => {
    if (allCorrect) return;

    setToggleStates((prev) => {
      const newStates = [...prev];
      const wasCorrect = newStates[index];
      newStates[index] = !newStates[index];

      setCorrectAnswers((prevCorrect) => (wasCorrect ? prevCorrect - 1 : prevCorrect + 1));

      return newStates;
    });
  };

  return (
    questions.length > 0 && (
      <div
        style={{
          background: getBackgroundColour(),
          transition: "background 0.5s ease",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h1 style={{ paddingBottom: "0.5em" }}>{questions[0].question}:</h1>
          {questions[0].answers.map((answer, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                borderRadius: "100px",
                border: "2px solid white",
                boxShadow: "0px 4px 4px 0px #00000040",
                position: "relative",
                width: "600px",
                height: "32px",
                padding: "1em",
                marginBottom: "16px",
                pointerEvents: allCorrect ? "none" : "auto",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  color: toggleStates[index] ? "white" : "#9F938B",
                  borderRadius: "40px",
                  transition: "transform 0.3s ease",
                  transform: allCorrect || toggleStates[index] ? "translateX(100%)" : "translateX(0)",
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  cursor: allCorrect ? "not-allowed" : "pointer",
                  height: "100%",
                  color: toggleStates[index] ? "white" : "#9F938B",
                }}
                onClick={() => toggleAnswer(index)}
              >
                {answer.incorrectOption}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  cursor: allCorrect ? "not-allowed" : "pointer",
                  color: toggleStates[index] ? "#9F938B" : "white",
                }}
                onClick={() => toggleAnswer(index)}
              >
                {answer.correctOption}
              </div>
            </div>
          ))}
          <h2 style={{ paddingTop: "0.5em" }}>The answer is {allCorrect ? "correct!" : "incorrect"}</h2>
        </div>
      </div>
    )
  );
};
