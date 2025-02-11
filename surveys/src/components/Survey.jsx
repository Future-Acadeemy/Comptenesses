import React, { useState } from "react";
import Result from "./Result";
import { questions } from "../data/Questions";
import { options } from "../data/Questions";
import { useSurveyStore } from "../store/useSurveyStore";
import { useNavigate } from "react-router-dom";
import { interpretations } from "../data/Questions";
import { interpretScore } from "../services/Services";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";

const Survey = () => {
  const {
    answers,
    setAnswer,
    showResult,
    setShowResult,
    scores,
    updateScores,
  } = useSurveyStore();
  const navigate = useNavigate();
  const { userInfo } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const scoresWithInterpretations = Object.entries(scores).reduce(
    (acc, [section, score]) => {
      acc[section] = {
        score,
        interpretation: interpretScore(section, score),
      };
      return acc;
    },
    {}
  );

  const userInfoWithScores = {
    ...userInfo,
    scoresWithInterpretations,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateScores();
    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/submit",
    //     userInfoWithScores
    //   );
    //   setMessage(response.data.message);
    // } catch (error) {
    //   setMessage("Error submitting data: " + error.message);
    //   console.error("Submission error:", error);
    // } finally {
    //   setLoading(false);
    // }
    navigate("/report");
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <form className="space-y-8" onSubmit={handleSubmit}>
        {Object.entries(questions).map(([section, qs]) => (
          <div key={section} className="p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Section {section}
            </h2>
            <table className="w-full border-collapse border border-gray-300 text-left">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-gray-300 px-4 py-3">Question</th>
                  {options.map((option) => (
                    <th
                      key={option.value}
                      className="border border-gray-300 px-4 py-3 text-center"
                    >
                      {option.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qs.map((q, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-3">{q}</td>
                    {options.map((option) => (
                      <td
                        key={option.value}
                        className="border border-gray-300 px-4 py-3 text-center"
                      >
                        <input
                          type="radio"
                          name={`section-${section}-question-${index}`}
                          value={option.value}
                          checked={answers[section][index] === option.value}
                          onChange={(e) =>
                            setAnswer(section, index, e.target.value)
                          }
                          required
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Survey;
