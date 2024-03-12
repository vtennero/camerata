// components/ProcessedText.js
import React from "react";

const ProcessedText = ({ processedText }) => {
  return (
    <div>
      <h2>Processed Text:</h2>
      <p>{processedText}</p>
    </div>
  );
};

export default ProcessedText;
