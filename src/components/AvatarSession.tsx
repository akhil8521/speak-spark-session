import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
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

interface Message {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

const AvatarSession = () => {
  const navigate = useNavigate();
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
    if (!isMicMode) return;
    
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording
      toast({
        title: "Recording started",
        description: "Speak now to interact with your avatar",
      });
    } else {
      // Stop recording and simulate voice message
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: "Hello, I'd like to know more about your services.",
        timestamp: new Date(),
        isVoice: true
      };
      
      setMessages(prev => [...prev, voiceMessage]);
      
      // Simulate avatar response
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

    // Simulate avatar response
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
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Config
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(sessionDuration)}
              </Badge>
              <Badge className="bg-success text-success-foreground">
                Active Session
              </Badge>
            </div>
          </div>
          <Button variant="destructive" onClick={handleEndSession} className="gap-2">
            <StopCircle className="h-4 w-4" />
            End Session
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Controls */}
        <div className="w-80 border-r bg-card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Avatar Controls</h3>
            
            {/* Mic Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Button
                  variant={isRecording ? "mic-active" : "mic"}
                  size="icon-lg"
                  onClick={handleMicToggle}
                  disabled={!isMicMode}
                  className="h-16 w-16"
                >
                  {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
              </div>
              
              <p className="text-center text-sm text-muted-foreground">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Session Actions */}
          <div className="space-y-3">
            <Button variant="outline" onClick={handleClearHistory} className="w-full gap-2">
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
            <Button variant="outline" onClick={handleSaveConversation} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Conversation
            </Button>
          </div>
        </div>

        {/* Center - Video Frame */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className={`relative rounded-lg overflow-hidden ${isAvatarSpeaking ? 'avatar-speaking' : ''}`}>
            <video
              ref={videoRef}
              className="w-96 h-72 bg-gray-800 rounded-lg"
              poster="/placeholder.svg"
            >
              <source src="" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full"></div>
                </div>
                <p className="text-sm">Avatar will appear here</p>
              </div>
            </div>
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

export default AvatarSession;