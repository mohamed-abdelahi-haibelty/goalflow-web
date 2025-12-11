"use client";

const LoadingComponent = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6 p-8 text-center">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-muted rounded-full border-t-primary animate-spin"></div>

        {/* Universal Loading Text */}
        <div>
          <h3 className="font-semibold text-lg text-foreground">Loading…</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your workspace.
          </p>
        </div>

        {/* Subtle animated dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
