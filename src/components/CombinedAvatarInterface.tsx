
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ConfigurationSidebar from "./ConfigurationSidebar";
import AvatarSessionMain from "./AvatarSessionMain";

export interface SharedConfig {
  systemPrompt: string;
  hubspotKey: string;
  sttEnabled: boolean;
  ttsEnabled: boolean;
  avatarUrl: string;
  userName: string;
}

const CombinedAvatarInterface = () => {
  const [config, setConfig] = useState<SharedConfig>({
    systemPrompt: "You are a helpful AI assistant designed to provide clear, accurate, and engaging responses. Always maintain a professional yet friendly tone.",
    hubspotKey: "",
    sttEnabled: true,
    ttsEnabled: true,
    avatarUrl: "",
    userName: "",
  });

  const updateConfig = (updates: Partial<SharedConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Configuration Full Page Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vw] h-[80vh] max-w-none p-0 overflow-y-auto">
          <DialogHeader className="border-b p-4">
            <DialogTitle>Configuration</DialogTitle>
          </DialogHeader>
          <ConfigurationSidebar 
            config={config} 
            onConfigUpdate={updateConfig} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Main Content */}
      <div className="flex-1">
        <AvatarSessionMain config={config} />
      </div>
    </div>
  );
};

export default CombinedAvatarInterface;
