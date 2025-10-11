import React, { useState } from "react";
import { Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ApiEndpointProps {
  // 'name: string;' dihapus untuk memperbaiki error TS6133
  method: string;
  path: string;
  description: string;
  params: string[];
}

// 'name' dihapus dari destructuring props
export const ApiEndpoint = ({ method, path, description, params }: ApiEndpointProps) => {
  const [copied, setCopied] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  const handleCopy = () => {
    // Memastikan navigator.clipboard tersedia
    if (navigator.clipboard) {
        navigator.clipboard.writeText(path);
        setCopied(true);
        toast.success("Endpoint copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    } else {
        // Fallback untuk lingkungan tanpa navigator.clipboard
        toast.error("Clipboard access denied or not available");
    }
  };

  const handleExecute = () => {
    const missingParams = params.filter(param => !paramValues[param]);
    
    if (missingParams.length > 0) {
      toast.error(`Please fill in all parameters: ${missingParams.join(", ")}`);
      return;
    }

    // Build query string
    const queryParams = new URLSearchParams(paramValues).toString();
    const fullUrl = `${path}?${queryParams}`;
    
    toast.success("Executing API request...", {
      description: fullUrl,
    });
    
    // Panggilan API sebenarnya akan ditempatkan di sini
  };

  // Fungsi untuk mendapatkan warna Badge berdasarkan metode HTTP
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'POST':
        return 'bg-green-600 hover:bg-green-700';
      case 'PUT':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'DELETE':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <Card className="glass-effect p-6 space-y-5 border-primary/20 transition-all duration-300 hover:border-primary/50 shadow-card">
      {/* Header Method & Path */}
      <div className="flex items-center gap-3">
        <Badge 
          className={`px-3 py-1 text-sm font-bold ${getMethodColor(method)}`}
        >
          {method.toUpperCase()}
        </Badge>
        <h4 className="text-lg font-mono text-foreground font-medium flex-1 overflow-auto whitespace-nowrap">
          {path}
        </h4>
      </div>

      {/* Description */}
      <p className="text-muted-foreground">{description}</p>

      <div className="space-y-4">
        {/* Endpoint URL Section */}
        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-muted-foreground">Endpoint URL</h5>
          <div className="flex items-center rounded-lg bg-background/50 border border-border overflow-hidden">
            <span className="p-3 text-sm font-mono text-primary/80 truncate flex-1">
              {path}
            </span>
            <div className="border-l border-border">
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-foreground/70 hover:text-primary transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Parameters */}
        {params.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-muted-foreground">Parameters</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {params.map((param) => (
                <div key={param} className="space-y-1.5">
                  <label className="text-sm font-medium font-mono text-foreground">
                    {param}
                  </label>
                  <Input
                    placeholder={`Enter ${param}`}
                    value={paramValues[param] || ""}
                    // Perbaikan: Tambahkan tipe eksplisit untuk event e
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setParamValues({ ...paramValues, [param]: e.target.value })
                    }
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execute Button */}
        <Button
          onClick={handleExecute}
          className="w-full bg-gradient-primary hover:opacity-90 shadow-crimson transition-all font-semibold"
        >
          <Play className="w-4 h-4 mr-2" />
          Execute
        </Button>
      </div>
    </Card>
  );
};
