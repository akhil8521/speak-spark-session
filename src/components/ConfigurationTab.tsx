import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Settings, User, ArrowRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PromptEnhancementModal from "./PromptEnhancementModal";
import APIKeyWarningModal from "./APIKeyWarningModal";

const ConfigurationTab = () => {
  const navigate = useNavigate();
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant designed to provide clear, accurate, and engaging responses. Always maintain a professional yet friendly tone.");
  const [hubspotKey, setHubspotKey] = useState("");
  const [sttEnabled, setSttEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(false);

  const handleOpenSession = () => {
    if (!hubspotKey.trim()) {
      setShowApiWarning(true);
      return;
    }
    navigate("/session");
  };

  const handleEnhancePrompt = () => {
    setShowEnhanceModal(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Avatar Configuration</h1>
          <p className="text-muted-foreground">Configure your AI avatar settings and system prompts</p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* STT/TTS Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Voice Settings
                </CardTitle>
                <CardDescription>Configure speech-to-text and text-to-speech options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Speech-to-Text (STT)</Label>
                    <p className="text-xs text-muted-foreground">Enable voice input recognition</p>
                  </div>
                  <Switch checked={sttEnabled} onCheckedChange={setSttEnabled} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Text-to-Speech (TTS)</Label>
                    <p className="text-xs text-muted-foreground">Enable voice output synthesis</p>
                  </div>
                  <Switch checked={ttsEnabled} onCheckedChange={setTtsEnabled} />
                </div>
              </CardContent>
            </Card>

            {/* Avatar Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Avatar Setup
                </CardTitle>
                <CardDescription>Configure your AI avatar appearance and voice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="avatar-url">Avatar Video URL</Label>
                  <Input
                    id="avatar-url"
                    placeholder="https://example.com/avatar-video.mp4"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="user-name">Display Name</Label>
                  <Input
                    id="user-name"
                    placeholder="Enter avatar name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - User Config & System Prompt */}
          <div className="space-y-6">
            {/* User Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>User Configuration</CardTitle>
                <CardDescription>API keys and integration settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="hubspot-key">HubSpot API Key</Label>
                  <Input
                    id="hubspot-key"
                    type="password"
                    placeholder="Enter your HubSpot API key"
                    value={hubspotKey}
                    onChange={(e) => setHubspotKey(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for avatar sessions and data integration
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Prompt */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>System Prompt</CardTitle>
                <CardDescription>Define your AI avatar's personality and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your system prompt here..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <Button 
                  onClick={handleEnhancePrompt}
                  variant="outline" 
                  className="w-full"
                  disabled={!systemPrompt.trim()}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enhance Prompt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!hubspotKey.trim() && (
                  <div className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">HubSpot API key required</span>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleOpenSession}
                size="lg"
                className="gap-2"
                disabled={!hubspotKey.trim()}
              >
                Open Avatar Session
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <PromptEnhancementModal 
        open={showEnhanceModal}
        onOpenChange={setShowEnhanceModal}
        originalPrompt={systemPrompt}
        onApplyPrompt={(enhancedPrompt) => {
          setSystemPrompt(enhancedPrompt);
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

export default ConfigurationTab;