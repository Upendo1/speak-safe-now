import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SavedReport = {
  id: string;
  message: string;
  severity: "safe" | "harmful" | "dangerous";
  guidance: string;
  created_at: string;
};

const History = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReports((data || []) as SavedReport[]);
    } catch (error: any) {
      console.error("Load error:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analyzer
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Saved Reports</h1>
          <p className="text-lg text-muted-foreground">
            Your evidence history - keep these safe
          </p>
        </header>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading reports...</p>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No saved reports yet</p>
            <Button asChild>
              <Link to="/">Analyze a Message</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const config = getSeverityConfig(report.severity);
              const Icon = config.icon;
              
              return (
                <Card
                  key={report.id}
                  className={`p-6 border-2 ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <Icon className={`h-8 w-8 ${config.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`font-semibold ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                      <div className="bg-card/50 rounded-lg p-4 mb-3">
                        <p className="text-sm text-foreground italic break-words">
                          "{report.message}"
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Guidance:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {report.guidance}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
