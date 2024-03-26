export const SidebarContent = (persona) => {
  return (
    <div className="lg:w-1/3 bg-gray-100 p-4 flex flex-col items-center justify-center space-y-4">
      <div className="w-64 h-64 bg-gray-300 flex items-center justify-center overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={`${persona.persona}.png`}
          alt={`${persona.persona}`}
          style={{ aspectRatio: "1 / 1" }}
          o
        />
      </div>

      <div className="text-center text-lg font-semibold">{`${persona.persona}`}</div>

      <div className="text-center text-gray-600">{persona.persona}</div>
    </div>
  );
};
