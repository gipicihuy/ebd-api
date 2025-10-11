import { useState } from "react";
import { Code2, Shield, Trophy, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiEndpoint } from "@/components/ApiEndpoint";
import { toast } from "sonner";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("");

  const stalkerEndpoints = [
    {
      name: "FF Stalk",
      method: "GET",
      path: "/api/stalker/ff",
      description: "Track and analyze Free Fire player statistics",
      params: ["playerId", "region"],
    },
    {
      name: "TikTok Stalk",
      method: "GET",
      path: "/api/stalker/tiktok",
      description: "Retrieve TikTok user profile and engagement data",
      params: ["username"],
    },
    {
      name: "Roblox Stalk",
      method: "GET",
      path: "/api/stalker/roblox",
      description: "Get detailed Roblox user information and game stats",
      params: ["userId"],
    },
  ];

  const rucoyEndpoints = [
    {
      name: "Leaderboard",
      method: "GET",
      path: "/api/rucoy/leaderboard",
      description: "Fetch top players rankings and statistics",
      params: ["limit", "server"],
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Glow Effect */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Code2 className="w-10 h-10 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Eberardos API
            </h1>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-1.5 border-primary/30 bg-primary/10">
            v1.0.7 Beta
          </Badge>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Modern API suite for game statistics and social media tracking
          </p>
        </header>

        {/* Summary Section */}
        <Card className="glass-effect mb-8 p-6 border-primary/20">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                API Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This API provides comprehensive endpoints for tracking player statistics across multiple platforms 
                and games. Access real-time data for Free Fire, TikTok, Roblox profiles, and Rucoy Online leaderboards. 
                All endpoints support JSON responses and require proper authentication headers.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">4</div>
                  <div className="text-sm text-muted-foreground">Endpoints</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">2</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">REST</div>
                  <div className="text-sm text-muted-foreground">Protocol</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">JSON</div>
                  <div className="text-sm text-muted-foreground">Format</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* API Categories */}
        <Accordion
          type="single"
          collapsible
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="space-y-4"
        >
          {/* Stalker Category */}
          <AccordionItem
            value="stalker"
            className="glass-effect rounded-xl border-primary/20 overflow-hidden shadow-card"
          >
            <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-3 text-left">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">Stalker</h3>
                  <p className="text-sm text-muted-foreground">
                    Social media and game profile tracking endpoints
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mt-4">
                {stalkerEndpoints.map((endpoint, index) => (
                  <ApiEndpoint key={index} {...endpoint} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rucoy Online Category */}
          <AccordionItem
            value="rucoy"
            className="glass-effect rounded-xl border-primary/20 overflow-hidden shadow-card"
          >
            <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-3 text-left">
                <Trophy className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">Rucoy Online</h3>
                  <p className="text-sm text-muted-foreground">
                    Game statistics and leaderboard data
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mt-4">
                {rucoyEndpoints.map((endpoint, index) => (
                  <ApiEndpoint key={index} {...endpoint} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Footer */}
        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>© 2024 Eberardos API • Built with modern web technologies</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
