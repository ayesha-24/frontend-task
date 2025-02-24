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
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 650);

  useEffect(() => {
    setQuestions(questionData as Questions[]);
    setToggleStates(new Array(questionData[0]?.answers.length).fill(false));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 650);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ paddingBottom: "0.5em" }}>{questions[0].question}:</h1>
          {questions[0].answers.map((answer, index) => (
            <div key={index} className="toggleContainer">
              <div
                className="slider"
                style={{
                  borderRadius: isMobile ? (toggleStates[index] ? "0 0 40px 40px" : "40px 40px 0 0") : "40px",
                  transform:
                    allCorrect || toggleStates[index]
                      ? isMobile
                        ? "translateY(100%)"
                        : "translateX(100%)"
                      : isMobile
                      ? "translateY(0)"
                      : "translateX(0)",
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
