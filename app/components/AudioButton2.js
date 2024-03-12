function AudioButton2() {
  return (
    <button
      className="bg-red-500 h-24 w-12 rounded-full flex items-center justify-center text-white shadow-lg"
      aria-label="Activate microphone"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14a4 4 0 100-8 4 4 0 000 8zm0 7v3m8-3a8 8 0 10-16 0m8-3v-3a8 8 0 010-16v16z"
        />
      </svg>
    </button>
  );
}

export default AudioButton2;
