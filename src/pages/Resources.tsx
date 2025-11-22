import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mail, Globe, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const helplines = [
    {
      name: "Tanzania Police Gender and Children's Desk",
      phone: "116",
      description: "24/7 emergency line for reporting violence and harassment",
    },
    {
      name: "Tanzania Women Lawyers Association (TAWLA)",
      phone: "+255 22 2134486",
      email: "tawla@tawla.or.tz",
      description: "Legal aid and counseling for women",
    },
    {
      name: "Sauti ya Wanawake Foundation",
      phone: "+255 754 333 333",
      description: "Support for survivors of gender-based violence",
    },
    {
      name: "KIWOHEDE",
      phone: "+255 22 2700883",
      website: "www.kiwohede.org",
      description: "Women's health and development organization",
    },
  ];

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
          <h1 className="text-4xl font-bold text-foreground mb-3">Help Resources</h1>
          <p className="text-lg text-muted-foreground">
            Tanzania helplines and organizations that can support you
          </p>
        </header>

        <div className="space-y-4">
          {helplines.map((helpline, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {helpline.name}
              </h3>
              <p className="text-muted-foreground mb-4">{helpline.description}</p>
              <div className="space-y-2">
                {helpline.phone && (
                  <div className="flex items-center gap-3 text-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <a
                      href={`tel:${helpline.phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      {helpline.phone}
                    </a>
                  </div>
                )}
                {helpline.email && (
                  <div className="flex items-center gap-3 text-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <a
                      href={`mailto:${helpline.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {helpline.email}
                    </a>
                  </div>
                )}
                {helpline.website && (
                  <div className="flex items-center gap-3 text-foreground">
                    <Globe className="h-4 w-4 text-primary" />
                    <a
                      href={`https://${helpline.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {helpline.website}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Emergency Notice
          </h3>
          <p className="text-foreground leading-relaxed">
            If you are in immediate danger, call <strong>112</strong> (emergency
            services) or <strong>116</strong> (police gender desk) right away. Your
            safety is the top priority.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
