import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, X, Loader2 } from "lucide-react";

interface PromptEnhancementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalPrompt: string;
  onApplyPrompt: (enhancedPrompt: string) => void;
}

const PromptEnhancementModal = ({ 
  open, 
  onOpenChange, 
  originalPrompt, 
  onApplyPrompt 
}: PromptEnhancementModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  const handleEnhance = async () => {
    setIsLoading(true);
    
    // Simulate API call for prompt enhancement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const enhanced = `${originalPrompt}

Enhanced with advanced conversational abilities:
- Contextual awareness and memory retention
- Adaptive communication style based on user preferences  
- Proactive information gathering and clarification
- Emotional intelligence and empathy in responses
- Professional expertise in relevant domains
- Clear, structured responses with actionable insights`;

    setEnhancedPrompt(enhanced);
    setShowComparison(true);
    setIsLoading(false);
  };

  const handleApply = () => {
    onApplyPrompt(enhancedPrompt);
  };

  const handleCancel = () => {
    setShowComparison(false);
    setEnhancedPrompt("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Enhance System Prompt
          </DialogTitle>
          <DialogDescription>
            AI-powered prompt optimization to improve your avatar's conversational abilities
          </DialogDescription>
        </DialogHeader>

        {!showComparison && !isLoading && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
                  {originalPrompt}
                </p>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleEnhance} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Enhance Prompt
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Enhancing your prompt...</p>
          </div>
        )}

        {showComparison && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline">Before</Badge>
                    Original Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm bg-muted p-4 rounded-md max-h-60 overflow-y-auto">
                    {originalPrompt}
                  </div>
                </CardContent>
              </Card>

              {/* After */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground">After</Badge>
                    Enhanced Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm bg-accent p-4 rounded-md max-h-60 overflow-y-auto">
                    {enhancedPrompt}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleApply} className="gap-2">
                <Check className="h-4 w-4" />
                Apply Enhanced Prompt
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PromptEnhancementModal;