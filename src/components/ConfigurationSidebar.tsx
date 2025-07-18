
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Settings, User, AlertTriangle } from "lucide-react";
import PromptEnhancementModal from "./PromptEnhancementModal";
import APIKeyWarningModal from "./APIKeyWarningModal";
import { SharedConfig } from "./CombinedAvatarInterface";

interface ConfigurationSidebarProps {
  config: SharedConfig;
  onConfigUpdate: (updates: Partial<SharedConfig>) => void;
}

const ConfigurationSidebar = ({ config, onConfigUpdate }: ConfigurationSidebarProps) => {
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(false);

  const handleEnhancePrompt = () => {
    setShowEnhanceModal(true);
  };

  return (
    <div className="p-4 space-y-4">
      {/* API Key Warning */}
      {!config.hubspotKey.trim() && (
        <Card className="border-warning bg-warning/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">HubSpot API key required</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">API Configuration</CardTitle>
          <CardDescription className="text-sm">Integration settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="hubspot-key" className="text-sm">HubSpot API Key</Label>
            <Input
              id="hubspot-key"
              type="password"
              placeholder="Enter your HubSpot API key"
              value={config.hubspotKey}
              onChange={(e) => onConfigUpdate({ hubspotKey: e.target.value })}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Speech-to-Text</Label>
              <p className="text-xs text-muted-foreground">Enable voice input</p>
            </div>
            <Switch 
              checked={config.sttEnabled} 
              onCheckedChange={(checked) => onConfigUpdate({ sttEnabled: checked })} 
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Text-to-Speech</Label>
              <p className="text-xs text-muted-foreground">Enable voice output</p>
            </div>
            <Switch 
              checked={config.ttsEnabled} 
              onCheckedChange={(checked) => onConfigUpdate({ ttsEnabled: checked })} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Avatar Setup */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Avatar Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="avatar-url" className="text-sm">Avatar Video URL</Label>
            <Input
              id="avatar-url"
              placeholder="https://example.com/avatar.mp4"
              value={config.avatarUrl}
              onChange={(e) => onConfigUpdate({ avatarUrl: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="user-name" className="text-sm">Display Name</Label>
            <Input
              id="user-name"
              placeholder="Enter avatar name"
              value={config.userName}
              onChange={(e) => onConfigUpdate({ userName: e.target.value })}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">System Prompt</CardTitle>
          <CardDescription className="text-sm">Define AI behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter your system prompt..."
            value={config.systemPrompt}
            onChange={(e) => onConfigUpdate({ systemPrompt: e.target.value })}
            className="min-h-[120px] resize-none text-sm"
          />
          <Button 
            onClick={handleEnhancePrompt}
            variant="outline" 
            size="sm"
            className="w-full"
            disabled={!config.systemPrompt.trim()}
          >
            <Sparkles className="h-3 w-3 mr-2" />
            Enhance Prompt
          </Button>
        </CardContent>
      </Card>

      {/* Modals */}
      <PromptEnhancementModal 
        open={showEnhanceModal}
        onOpenChange={setShowEnhanceModal}
        originalPrompt={config.systemPrompt}
        onApplyPrompt={(enhancedPrompt) => {
          onConfigUpdate({ systemPrompt: enhancedPrompt });
          setShowEnhanceModal(false);
        }}
      />

      <APIKeyWarningModal 
        open={showApiWarning}
        onOpenChange={setShowApiWarning}
      />
    </div>
  );
};

export default ConfigurationSidebar;
