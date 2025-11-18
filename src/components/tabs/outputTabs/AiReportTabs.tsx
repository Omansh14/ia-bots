import { Bot } from "lucide-react";

export const AIReportsTab = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Bot className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">AI Reports</h3>
        <p className="text-muted-foreground">
          AI-generated insights and recommendations will appear here
        </p>
      </div>
    </div>
  );
};