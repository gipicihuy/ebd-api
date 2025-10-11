import { useState } from "react";
// Hanya Shield dan Trophy yang dipertahankan karena digunakan di AccordionTrigger
import { Shield, Trophy } from "lucide-react"; 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Import Card, Button, dan toast dihapus karena tidak digunakan di level komponen Index
import { Badge } from "@/components/ui/badge"; 
// Jalur impor ini hanya berfungsi jika ApiEndpoint.tsx ada di src/components/
import { ApiEndpoint } from "@/components/ApiEndpoint"; 

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("");

  const stalkerEndpoints = [
    {
      // name dipertahankan untuk data tetapi dihapus dari destructuring di ApiEndpoint
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
      params: ["limit", "offset", "sort_by"],
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none z-0"></div>
      <div className="relative z-10 container mx-auto p-4 md:p-8 lg:p-12">
        {/* Header Section */}
        <header className="text-center mb-12 space-y-3 pt-8">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-base font-medium">
            v1.0.7 Beta
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-primary">
            Eberardos API Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Modern API suite for game statistics and social media tracking.
          </p>
        </header>

        {/* Main Content (Accordion) */}
        {/* Catatan: Komponen Card digunakan di ApiEndpoint, bukan di sini. */}
        <Accordion
          type="single"
          collapsible
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full max-w-4xl mx-auto space-y-4"
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
                  <h3 className="text-xl font-semibold">Social & Game Stalker</h3>
                  <p className="text-sm text-muted-foreground">
                    Access Free Fire, TikTok, and Roblox profile data
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
