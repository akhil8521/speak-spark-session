
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Type, 
  Send, 
  Trash2, 
  Save, 
  StopCircle,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SharedConfig } from "./CombinedAvatarInterface";

interface Message {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface AvatarSessionMainProps {
  config: SharedConfig;
}

const AvatarSessionMain = ({ config }: AvatarSessionMainProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isMicMode, setIsMicMode] = useState(true);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionStartTime = useRef<Date>(new Date());

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - sessionStartTime.current.getTime()) / 1000);
      setSessionDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMicToggle = () => {
    if (!isMicMode || !config.sttEnabled) return;
    
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Speak now to interact with your avatar",
      });
    } else {
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: "Hello, I'd like to know more about your services.",
        timestamp: new Date(),
        isVoice: true
      };
      
      setMessages(prev => [...prev, voiceMessage]);
      
      if (config.ttsEnabled) {
        setTimeout(() => {
          setIsAvatarSpeaking(true);
          const avatarResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'avatar',
            content: "Hello! I'd be happy to help you learn about our services. We offer comprehensive AI-powered solutions for business automation and customer engagement.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, avatarResponse]);
          
          setTimeout(() => setIsAvatarSpeaking(false), 3000);
        }, 1000);
      }
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    if (config.ttsEnabled) {
      setTimeout(() => {
        setIsAvatarSpeaking(true);
        const avatarResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'avatar',
          content: "Thank you for your message. I understand your inquiry and I'm here to provide detailed assistance with any questions you might have.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, avatarResponse]);
        
        setTimeout(() => setIsAvatarSpeaking(false), 2500);
      }, 800);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    toast({
      title: "Conversation cleared",
      description: "Chat history has been reset",
    });
  };

  const handleSaveConversation = () => {
    toast({
      title: "Conversation saved",
      description: "Your chat history has been saved successfully",
    });
  };

  const handleEndSession = () => {
    toast({
      title: "Session ended",
      description: "Your conversation has been automatically saved",
    });
    setMessages([]);
    sessionStartTime.current = new Date();
    setSessionDuration(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(sessionDuration)}
            </Badge>
            <Badge className={`${config.hubspotKey.trim() ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}`}>
              {config.hubspotKey.trim() ? 'Connected' : 'No API Key'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClearHistory} size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button variant="outline" onClick={handleSaveConversation} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="destructive" onClick={handleEndSession} size="sm" className="gap-2">
              <StopCircle className="h-4 w-4" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Center - Video Frame */}
        <div className="flex-1 flex items-center justify-center bg-black relative">
          <div className={`relative rounded-lg overflow-hidden ${isAvatarSpeaking ? 'avatar-speaking' : ''}`}>
            <video
              ref={videoRef}
              className="w-96 h-72 bg-gray-800 rounded-lg"
              poster="/placeholder.svg"
              src={config.avatarUrl || ""}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full"></div>
                </div>
                <p className="text-sm">{config.userName || "Avatar will appear here"}</p>
              </div>
            </div>
          </div>

          {/* Floating Mic Control */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
              variant={isRecording ? "mic-active" : "mic"}
              size="icon-lg"
              onClick={handleMicToggle}
              disabled={!isMicMode || !config.sttEnabled}
              className="h-16 w-16 rounded-full shadow-lg"
            >
              {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Chat */}
        <div className="w-96 border-l bg-card flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <h3 className="font-semibold">Conversation</h3>
            <p className="text-sm text-muted-foreground">{messages.length} messages</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Start a conversation with your avatar</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.isVoice && (
                        <Mic className="h-3 w-3 opacity-70" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t space-y-3">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={isMicMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsMicMode(true)}
                className="gap-1"
                disabled={!config.sttEnabled}
              >
                <Mic className="h-3 w-3" />
                Voice
              </Button>
              <Button
                variant={!isMicMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsMicMode(false)}
                className="gap-1"
              >
                <Type className="h-3 w-3" />
                Text
              </Button>
            </div>

            {/* Text Input (when text mode) */}
            {!isMicMode && (
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendText();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSendText} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSessionMain;
