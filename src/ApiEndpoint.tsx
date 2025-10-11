import { useState } from "react";
import { Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ApiEndpointProps {
  name: string;
  method: string;
  path: string;
  description: string;
  params: string[];
}

export const ApiEndpoint = ({ name, method, path, description, params }: ApiEndpointProps) => {
  const [copied, setCopied] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  const handleCopy = () => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    toast.success("Endpoint copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
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
    
    // Here you would make the actual API call
    console.log("Executing:", fullUrl, paramValues);
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "POST":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PUT":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "DELETE":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Card className="p-5 bg-secondary/50 border-primary/10 hover:border-primary/30 transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={`font-mono ${getMethodColor(method)}`}>
                {method}
              </Badge>
              <h4 className="text-lg font-semibold">{name}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            {/* Endpoint Path */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-border">
              <code className="text-sm font-mono flex-1 text-primary">{path}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-7 w-7 p-0"
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
                    onChange={(e) =>
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
