import React from "react";
import TweetInput from "./components/TweetPage";
import FollowButton from "./components/FollowButton";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-900 flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold">Roast Generator</h1>
      <p className="text-sm mb-6 text-gray-300">Bring your eba come, make we warm am</p>
      <TweetInput />
      <FollowButton />
    </div>
  );
}

export default App;
