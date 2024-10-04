"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/ui/Navbar";

const queryClient = new QueryClient();

const fetchDailies = async ({ pageParam = 1 }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/dailies?page=${pageParam}&pageSize=30`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

const fetchRollingDaily = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/dailies/rolling-daily`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

const DailiesComponent = () => {
  const {
    data: rollingDaily,
    isLoading: isLoadingRolling,
    isError: isErrorRolling,
  } = useQuery({
    queryKey: ["rollingDaily"],
    queryFn: fetchRollingDaily,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["dailies"],
      queryFn: fetchDailies,
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
    });

  if (status === "loading" || isLoadingRolling) return <div>Loading...</div>;
  if (status === "error" || isErrorRolling) return <div>An error occurred</div>;

  const renderDailyEntry = (entry, isRolling = false) => (
    <div
      key={isRolling ? "rolling" : entry.date}
      className={`bg-gray-800 p-4 border border-gray-700 mb-4 rounded-lg ${
        isRolling ? "border-blue-500" : ""
      }`}
    >
      <h3 className="text-xl mb-2 text-gray-100 font-bold">
        {isRolling ? "Today" : entry.date}
      </h3>
      <div className="text-gray-300 space-y-2">
        {entry.key_activities && (
          <section>
            <h4 className="font-semibold text-gray-200">Key Activities:</h4>
            <p>{entry.key_activities}</p>
          </section>
        )}
        {entry.mood_trends && (
          <section>
            <h4 className="font-semibold text-gray-200">Mood Trends:</h4>
            <p>{entry.mood_trends}</p>
          </section>
        )}
        {entry.goal_progress && (
          <section>
            <h4 className="font-semibold text-gray-200">Goal Progress:</h4>
            <p>{entry.goal_progress}</p>
          </section>
        )}
        {(entry.limc_emotion ||
          entry.limc_cognitive ||
          entry.limc_social_ref ||
          entry.limc_concerns) && (
          <section>
            <h4 className="font-semibold text-gray-200">LIMC Analysis:</h4>
            <ul className="list-disc list-inside pl-4">
              {entry.limc_emotion && (
                <li>Emotional Tone: {entry.limc_emotion}</li>
              )}
              {entry.limc_cognitive && (
                <li>Cognitive Processes: {entry.limc_cognitive}</li>
              )}
              {entry.limc_social_ref && (
                <li>Social References: {entry.limc_social_ref}</li>
              )}
              {entry.limc_concerns && (
                <li>Personal Concerns: {entry.limc_concerns}</li>
              )}
            </ul>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {rollingDaily && (
        <div className="mb-6">{renderDailyEntry(rollingDaily, true)}</div>
      )}

      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.dailies.map((daily) => renderDailyEntry(daily))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="px-4 py-2 bg-blue-600 text-white"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
};

const MindChronicle = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <DailiesComponent />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MindChronicle />
    </QueryClientProvider>
  );
};

export default App;
