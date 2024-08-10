import { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

function TweetInput() {
  const [tweet, setTweet] = useState("");
  const [language, setLanguage] = useState("English");
  const [comeback, setComeback] = useState("");
  const [loading, setLoading] = useState(false);
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    fetch('/si.txt')
      .then(response => response.text())
      .then(text => {
        setInstruction(text);
      });
  }, []);

  const generateComeback = async () => {
    setLoading(true);
    
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        safetySettings,
        systemInstruction: instruction,
      });


    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chatSession.sendMessage(`reply this bully tweet: ${tweet} using ${language}`);
    setComeback(result.response.text());
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(comeback);
    alert("Copied to clipboard!");
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <textarea
        className="w-full p-3 mb-4 border rounded-md"
        rows="5"
        placeholder="Paste the tweet here..."
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
      ></textarea>

      <select
        className="w-full p-3 mb-4 border rounded-md"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="English">English</option>
        <option value="Pidgin">Pidgin</option>
        <option value="Yoruba">Yoruba</option>
      </select>

      <button
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex justify-center items-center ${
          loading ? "opacity-50" : ""
        }`}
        onClick={generateComeback}
        disabled={loading}
      >
        {loading && (
          <svg
            className="animate-spin mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        )}
        {loading ? "Cooking..." : "Cook that MF!"}
      </button>

      {comeback && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner">
          <p>{comeback}</p>
          <button
            className="mt-3 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

export default TweetInput;
