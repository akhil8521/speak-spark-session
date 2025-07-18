
import { useState } from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { ConfigurationSidebar } from "./ConfigurationSidebar";
import { AvatarSessionMain } from "./AvatarSessionMain";

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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Configuration</h2>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ConfigurationSidebar 
              config={config} 
              onConfigUpdate={updateConfig} 
            />
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <AvatarSessionMain config={config} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CombinedAvatarInterface;
