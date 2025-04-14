'use client';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50 dark:bg-slate-900 relative">
      <div className="absolute inset-0 bg-[url('/noise.jpg')] bg-repeat opacity-10 dark:opacity-5" />
      <div
        className="absolute inset-0 pointer-events-none
          [background-image:linear-gradient(90deg,rgba(241,194,125,0.15)_1px,transparent_1px),linear-gradient(180deg,rgba(241,194,125,0.15)_1px,transparent_1px)]
          dark:[background-image:linear-gradient(90deg,rgba(251,191,36,0.2)_1px,transparent_1px),linear-gradient(180deg,rgba(251,191,36,0.2)_1px,transparent_1px)]
          [background-size:20px_20px]"
      />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="inline-block h-12 w-12 rounded bg-amber-600 dark:bg-amber-500 mb-6"></div>
          <div className="flex items-center justify-center space-x-2">
            <div
              className="h-2 w-2 bg-amber-600 dark:bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="h-2 w-2 bg-amber-600 dark:bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="h-2 w-2 bg-amber-600 dark:bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
          <p className="mt-2 text-amber-800 dark:text-amber-200 font-medium">
            Loading ChessClouds<span className="inline-block">...</span>
          </p>
        </div>
      </div>
    </div>
  );
}
