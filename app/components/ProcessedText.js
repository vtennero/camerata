// components/ProcessedText.js
import React from "react";

const ProcessedText = ({ processedText, refinedText }) => {
  return (
    <div>
      <h2>Processed Text:</h2>
      <p>{processedText}</p>
      <h2>Refined Text:</h2>
      <p>{refinedText}</p>
    </div>
  );
};

export default ProcessedText;
