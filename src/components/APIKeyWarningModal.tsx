import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Settings } from "lucide-react";

interface APIKeyWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const APIKeyWarningModal = ({ open, onOpenChange }: APIKeyWarningModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <DialogTitle className="text-xl">HubSpot API Key Required</DialogTitle>
          <DialogDescription className="text-center">
            You need to configure your HubSpot API key before starting an avatar session. 
            This is required for data integration and session management.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              How to get your API key:
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Log in to your HubSpot account</li>
              <li>Go to Settings → Integrations → API Key</li>
              <li>Create or copy your private app token</li>
              <li>Paste it in the User Configuration section</li>
            </ol>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Got it, I'll configure it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyWarningModal;