import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Send, Paperclip, Smile, Image as ImageIcon, Phone, X } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CONTACTS = [
  { id: 1, name: "Mayank Kumar", status: "online", avatar: "MK" },
  { id: 2, name: "Illesh Pandey", status: "offline", avatar: "IP" },
  { id: 3, name: "Samar Singh", status: "online", avatar: "SS" },
  { id: 4, name: "Vedang Bulbul", status: "online", avatar: "VB" }
];

export function ChatRoom({ vendorId, onClose }: { vendorId?: string; onClose?: () => void }) {
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Record<number, Array<{ text: string; sent: boolean; timestamp: Date }>>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newSentMessage = {
      text: newMessage,
      sent: true,
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newSentMessage]
    }));

    setNewMessage("");

    setTimeout(() => {
      const responseMessage = {
        text: `Response from ${selectedContact.name}`,
        sent: false,
        timestamp: new Date()
      };

      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), responseMessage]
      }));
    }, 1000);
  };

  return (
    <div className="flex h-[600px] max-w-4xl w-full bg-background rounded-lg shadow-2xl overflow-hidden border border-border">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-border bg-muted/10">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {CONTACTS.map(contact => (
            <div
              key={contact.id}
              className={cn(
                "p-4 cursor-pointer transition-colors hover:bg-muted/20",
                selectedContact.id === contact.id && "bg-muted/30"
              )}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                  {contact.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{contact.name}</span>
                    <Badge variant={contact.status === "online" ? "default" : "secondary"}>
                      {contact.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {selectedContact.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{selectedContact.name}</h3>
              <Badge variant={selectedContact.status === "online" ? "default" : "secondary"}>
                {selectedContact.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(messages[selectedContact.id] || []).map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.sent ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.sent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-muted/5">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setNewMessage((prev) => prev + emojiData.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}