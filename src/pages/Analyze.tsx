import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, ShieldX, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type AnalysisResult = {
  severity: "safe" | "harmful" | "dangerous";
  guidance: string;
};

const Analyze = () => {
  const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [saving, setSaving] = useState(false);

  const analyzeMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message to analyze");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-message", {
        body: { message },
      });

      if (error) throw error;

      setResult(data as AnalysisResult);
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze message");
    } finally {
      setAnalyzing(false);
    }
  };

  const saveEvidence = async () => {
    if (!result) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("saved_reports").insert({
        message,
        severity: result.severity,
        guidance: result.guidance,
      });

      if (error) throw error;

      toast.success("Evidence saved successfully");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Failed to save evidence");
    } finally {
      setSaving(false);
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "safe":
        return {
          icon: ShieldCheck,
          label: "Safe",
          color: "text-safe",
          bg: "bg-safe-bg",
          border: "border-safe",
        };
      case "harmful":
        return {
          icon: ShieldAlert,
          label: "Harmful",
          color: "text-warning",
          bg: "bg-warning-bg",
          border: "border-warning",
        };
      case "dangerous":
        return {
          icon: ShieldX,
          label: "Dangerous",
          color: "text-danger",
          bg: "bg-danger-bg",
          border: "border-danger",
        };
      default:
        return {
          icon: ShieldCheck,
          label: "Unknown",
          color: "text-muted-foreground",
          bg: "bg-muted",
          border: "border-border",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            SpeakSafe AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Detect online harassment and get instant guidance on what to do next
          </p>
        </header>

        <Card className="p-6 md:p-8 mb-6 shadow-lg">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Paste the message you received
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the message you want to analyze..."
                className="min-h-[150px] resize-none text-base"
              />
            </div>

            <Button
              onClick={analyzeMessage}
              disabled={analyzing || !message.trim()}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Check Message"
              )}
            </Button>
          </div>
        </Card>

        {result && (
          <Card
            className={`p-6 md:p-8 shadow-lg border-2 ${
              getSeverityConfig(result.severity).bg
            } ${getSeverityConfig(result.severity).border} animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {(() => {
                  const Icon = getSeverityConfig(result.severity).icon;
                  return (
                    <Icon
                      className={`h-12 w-12 ${
                        getSeverityConfig(result.severity).color
                      }`}
                    />
                  );
                })()}
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {getSeverityConfig(result.severity).label}
                  </h2>
                  <p className="text-sm text-muted-foreground">Analysis Result</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  What to do:
                </h3>
                <p className="text-foreground leading-relaxed">{result.guidance}</p>
              </div>

              {result.severity !== "safe" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={saveEvidence}
                    disabled={saving}
                    variant="default"
                    className="flex-1"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save as Evidence
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/resources">View Resources</Link>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        <nav className="flex gap-4 justify-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/resources">Resources</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/history">Saved Reports</Link>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Analyze;
