import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatContact {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  specialty?: string;
  type: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
  isRead: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const mockContacts: ChatContact[] = [
  {
    id: '1',
    name: 'Δρ. Νίκος Αντωνίου',
    username: 'dr.nikos.ant',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face&q=90',
    specialty: 'Νευροχειρουργική',
    type: 'doctor',
    lastMessage: 'Ευχαριστώ για τις πληροφορίες!',
    lastMessageTime: '2λ',
    unreadCount: 2,
    isOnline: true,
    isVerified: true,
    isRead: false,
  },
  {
    id: '2',
    name: 'Ευαγγελισμός Hospital',
    username: 'evangelismos',
    avatar_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=300&fit=crop&crop=center&q=90',
    type: 'hospital',
    lastMessage: 'Το πρόγραμμα εφημεριών είναι έτοιμο',
    lastMessageTime: '15λ',
    unreadCount: 0,
    isOnline: true,
    isVerified: true,
    isRead: true,
  },
  {
    id: '3',
    name: 'Ελένη Κωνσταντίνου',
    username: 'eleni.nurse',
    avatar_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face&q=90',
    specialty: 'Νοσηλευτική',
    type: 'nurse',
    lastMessage: 'Θα είμαι στη βάρδια αύριο πρωί',
    lastMessageTime: '1ω',
    unreadCount: 0,
    isOnline: false,
    isVerified: true,
    isRead: true,
  },
  {
    id: '4',
    name: 'Δρ. Γιώργος Παπαγεωργίου',
    username: 'dr.papageorgiou',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face&q=90',
    specialty: 'Ορθοπεδική',
    type: 'doctor',
    lastMessage: 'Στείλε μου τις ακτινογραφίες',
    lastMessageTime: '3ω',
    unreadCount: 1,
    isOnline: true,
    isVerified: true,
    isRead: false,
  },
  {
    id: '5',
    name: 'Δρ. Αναστασία Βλάχου',
    username: 'dr.vlachou',
    avatar_url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face&q=90',
    specialty: 'Δερματολογία',
    type: 'doctor',
    lastMessage: 'Η βιοψία ήρθε αρνητική 🎉',
    lastMessageTime: '5ω',
    unreadCount: 0,
    isOnline: false,
    isVerified: true,
    isRead: true,
  },
  {
    id: '6',
    name: 'ΑΧΕΠΑ Θεσσαλονίκη',
    username: 'axepa.thess',
    avatar_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300&h=300&fit=crop&crop=center&q=90',
    type: 'hospital',
    lastMessage: 'Νέα θέση ειδικευόμενου ανοιχτή',
    lastMessageTime: '1μ',
    unreadCount: 0,
    isOnline: true,
    isVerified: true,
    isRead: true,
  },
];

const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', senderId: 'me', content: 'Καλημέρα! Είδα το post σας για τη νευροχειρουργική επέμβαση.', timestamp: '10:30', isRead: true },
    { id: 'm2', senderId: '1', content: 'Καλημέρα! Ναι, ήταν μια πολύ απαιτητική υπόθεση. Χρειάστηκε 12 ώρες.', timestamp: '10:32', isRead: true },
    { id: 'm3', senderId: 'me', content: 'Εντυπωσιακό! Μπορείτε να μοιραστείτε κάποιες λεπτομέρειες για την τεχνική;', timestamp: '10:35', isRead: true },
    { id: 'm4', senderId: '1', content: 'Φυσικά! Χρησιμοποιήσαμε νεύρο-πλοήγηση και intraoperative MRI. Θα σας στείλω το case study.', timestamp: '10:38', isRead: true },
    { id: 'm5', senderId: '1', content: 'Ευχαριστώ για τις πληροφορίες!', timestamp: '10:40', isRead: false },
  ],
};

export function CommunityChat() {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const filteredContacts = mockContacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  if (selectedContact) {
    const messages = mockMessages[selectedContact.id] || [];
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem-3.5rem)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-3 py-2.5 border-b border-border/50 bg-background/95 backdrop-blur-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedContact(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={selectedContact.avatar_url} className="object-cover" />
              <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {selectedContact.isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold truncate">{selectedContact.name}</span>
              {selectedContact.isVerified && (
                <svg className="h-3.5 w-3.5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedContact.isOnline ? 'Online' : selectedContact.specialty || selectedContact.type}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.senderId === 'me' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                    msg.senderId === 'me'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary rounded-bl-md'
                  )}
                >
                  <p>{msg.content}</p>
                  <div className={cn(
                    "flex items-center gap-1 mt-0.5",
                    msg.senderId === 'me' ? 'justify-end' : 'justify-start'
                  )}>
                    <span className={cn(
                      "text-[10px]",
                      msg.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {msg.timestamp}
                    </span>
                    {msg.senderId === 'me' && (
                      msg.isRead
                        ? <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                        : <Check className="h-3 w-3 text-primary-foreground/70" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-t border-border/50 bg-background">
          <Input
            placeholder="Γράψτε μήνυμα..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 rounded-full h-9 text-sm"
          />
          <Button
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-3.5rem)]">
      {/* Chat List Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <h2 className="text-lg font-bold mb-2">Μηνύματα</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Αναζήτηση..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-full text-sm"
          />
        </div>
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar_url} className="object-cover" />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "text-sm truncate",
                      contact.unreadCount > 0 ? 'font-bold' : 'font-medium'
                    )}>
                      {contact.name}
                    </span>
                    {contact.isVerified && (
                      <svg className="h-3.5 w-3.5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{contact.lastMessageTime}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={cn(
                    "text-xs truncate pr-2",
                    contact.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}>
                    {contact.lastMessage}
                  </p>
                  {contact.unreadCount > 0 && (
                    <Badge className="h-5 min-w-5 rounded-full text-[10px] px-1.5 bg-primary text-primary-foreground flex-shrink-0">
                      {contact.unreadCount}
                    </Badge>
                  )}
                  {contact.unreadCount === 0 && contact.isRead && (
                    <CheckCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
