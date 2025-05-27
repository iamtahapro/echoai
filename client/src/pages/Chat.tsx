import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Zap, 
  Plus,
  MoreHorizontal,
  Copy, 
  Check,
  User,
  Bot,
  ArrowUp,
  ArrowRight,
  Sparkles,
  Code2,
  Terminal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Component for the thinking toggle button
const ThinkingButton = ({ thinking, messageId, expandedThinking, setExpandedThinking }: { 
  thinking: string; 
  messageId: string; 
  expandedThinking: string | null; 
  setExpandedThinking: (id: string | null) => void; 
}) => {
  const isExpanded = expandedThinking === messageId;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3"
    >
      <Button
        onClick={() => setExpandedThinking(isExpanded ? null : messageId)}
        variant="ghost"
        size="sm"
        className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 border border-orange-500/30 transition-all duration-200"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="h-3 w-3 mr-1" />
        </motion.div>
        <span className="text-xs">
          {isExpanded ? 'Hide' : 'View'} AI Thinking
        </span>
      </Button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 overflow-hidden"
          >
            <div className="text-xs text-orange-200 font-mono leading-relaxed whitespace-pre-wrap">
              {thinking}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Component for code blocks with copy functionality
const CodeBlock = ({ code, language = 'javascript' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group bg-black border border-orange-500/30 rounded-lg overflow-hidden my-3">
      <div className="flex items-center justify-between bg-orange-500/10 px-4 py-2 border-b border-orange-500/30">
        <span className="text-orange-300 text-xs font-mono">{language}</span>
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-orange-300 hover:text-orange-100 hover:bg-orange-500/20"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="p-4 bg-black">
        <pre className="text-orange-400 text-sm font-mono overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// AI Thinking Animation Component
const AIThinkingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-4"
    >
      {/* AI Avatar */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-r from-black to-orange-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-5 w-5 text-white" />
        </motion.div>
      </div>
      
      {/* Thinking Message */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-white mb-2 block">Echo AI</span>
        <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-black">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-orange-400 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-orange-400 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-orange-400 rounded-full"
            />
            <span className="text-orange-300 text-sm ml-2">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                AI is thinking...
              </motion.span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Function to render message content with code blocks
const renderMessageContent = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push(
        <span key={lastIndex} className="whitespace-pre-wrap">
          {content.slice(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add code block
    const language = match[1] || 'code';
    const code = match[2];
    parts.push(
      <CodeBlock key={match.index} code={code} language={language} />
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(
      <span key={lastIndex} className="whitespace-pre-wrap">
        {content.slice(lastIndex)}
      </span>
    );
  }
  
  return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{content}</span>;
};

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  thinking?: string;
  timestamp: Date;
}

export default function Chat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[][]>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full p-4 gap-4 overflow-hidden bg-echo-dark">
      {/* Sidebar Panel (top on mobile, left on desktop) */}
      <div className="w-full md:w-1/3 h-1/2 md:h-full bg-gray-800 p-4 rounded-2xl shadow-lg overflow-y-auto">
        {/* You can render chat history, user info, buttons etc here */}
        Sidebar Content
      </div>

      {/* Chat Panel (bottom on mobile, right on desktop) */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full bg-gray-900 p-4 rounded-2xl shadow-lg overflow-y-auto">
        {/* Render your chat messages here */}
        Chat Output
      </div>
    </div>
  );
}


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('echo-ai-chat-history');
    const savedCurrentIndex = localStorage.getItem('echo-ai-current-chat-index');
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
        
        if (savedCurrentIndex && parsedHistory.length > 0) {
          const index = parseInt(savedCurrentIndex);
          if (index >= 0 && index < parsedHistory.length) {
            setCurrentChatIndex(index);
            setMessages(parsedHistory[index] || []);
          } else {
            setMessages(parsedHistory[0] || []);
          }
        } else if (parsedHistory.length > 0) {
          setMessages(parsedHistory[0] || []);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    } else {
      // Initialize with empty chat if no history exists
      const initialHistory = [[]];
      setChatHistory(initialHistory);
      setCurrentChatIndex(0);
      localStorage.setItem('echo-ai-chat-history', JSON.stringify(initialHistory));
      localStorage.setItem('echo-ai-current-chat-index', '0');
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const updatedHistory = [...chatHistory];
      updatedHistory[currentChatIndex] = messages;
      setChatHistory(updatedHistory);
      localStorage.setItem('echo-ai-chat-history', JSON.stringify(updatedHistory));
      localStorage.setItem('echo-ai-current-chat-index', currentChatIndex.toString());
    }
  }, [messages, currentChatIndex, chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addSystemMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addMessage = (type: 'user' | 'ai', content: string, thinking?: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      thinking,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    return message.id;
  };

  const startNewChat = () => {
    // Save current chat if it has messages
    const updatedHistory = [...chatHistory];
    if (messages.length > 0) {
      updatedHistory[currentChatIndex] = messages;
    }
    
    // Create new empty chat
    updatedHistory.push([]);
    const newIndex = updatedHistory.length - 1;
    
    setChatHistory(updatedHistory);
    setCurrentChatIndex(newIndex);
    setMessages([]);
    
    // Save to localStorage
    localStorage.setItem('echo-ai-chat-history', JSON.stringify(updatedHistory));
    localStorage.setItem('echo-ai-current-chat-index', newIndex.toString());
  };

  const loadChat = (index: number) => {
    if (index >= 0 && index < chatHistory.length) {
      // Save current chat before switching
      const updatedHistory = [...chatHistory];
      if (messages.length > 0) {
        updatedHistory[currentChatIndex] = messages;
        setChatHistory(updatedHistory);
        localStorage.setItem('echo-ai-chat-history', JSON.stringify(updatedHistory));
      }
      
      // Load selected chat
      setCurrentChatIndex(index);
      setMessages(chatHistory[index] || []);
      localStorage.setItem('echo-ai-current-chat-index', index.toString());
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userId: user?.uid,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract thinking from response if it exists
      let thinking = '';
      let cleanResponse = data.response;
      
      if (data.response.includes('<think>')) {
        const thinkMatch = data.response.match(/<think>(.*?)<\/think>/s);
        if (thinkMatch) {
          thinking = thinkMatch[1].trim();
          cleanResponse = data.response.replace(/<think>.*?<\/think>/s, '').trim();
        }
      }
      
      addMessage('ai', cleanResponse, thinking || undefined);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('ai', "I apologize, but I encountered an error processing your request. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatMessage = (content: string) => {
    // Simple code block detection and formatting
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    let formattedContent = content;
    
    // Replace code blocks
    formattedContent = formattedContent.replace(codeBlockRegex, (match, language, code) => {
      return `<div class="code-block bg-gray-900 border border-gray-700 rounded-lg p-4 my-3 font-mono text-sm overflow-x-auto">
        ${language ? `<div class="text-echo-orange text-xs mb-2">${language}</div>` : ''}
        <pre class="text-green-400 whitespace-pre-wrap">${code.trim()}</pre>
      </div>`;
    });
    
    // Replace inline code
    formattedContent = formattedContent.replace(inlineCodeRegex, '<code class="bg-gray-800 px-2 py-1 rounded text-green-400 font-mono text-sm">$1</code>');
    
    // Replace newlines with <br> for other text
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    return formattedContent;
  };

  const updateCharCount = () => {
    const count = input.length;
    return `${count}/4000`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-black pt-16 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/90 backdrop-blur-sm h-[calc(100vh-4rem)] flex flex-col border-r border-black">
        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            onClick={startNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="text-xs text-white mb-3 px-2 font-medium">Recent Chats</div>
          <div className="space-y-2">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p className="text-sm">No chat history yet</p>
                <p className="text-xs mt-1">Start a conversation!</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    index === currentChatIndex
                      ? 'bg-orange-500/30 border border-orange-500/50'
                      : 'bg-black/50 hover:bg-orange-500/20 border border-transparent'
                  }`}
                  onClick={() => loadChat(index)}
                >
                  <div className="text-sm text-white font-medium mb-1">
                    Chat {index + 1}
                  </div>
                  <div className="text-xs text-gray-400">
                    {chat.length > 0 ? `${chat.length} messages` : 'Empty chat'}
                  </div>
                  {chat.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {chat[0]?.content.substring(0, 30)}...
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-black">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {user?.email || 'User'}
              </div>
              <div className="text-xs text-white">Connected</div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-echo-orange rounded-lg flex items-center justify-center">
              <Sparkles className="text-white h-4 w-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Echo AI</h1>
              <p className="text-sm text-gray-500">Your intelligent coding assistant</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black via-orange-900/30 to-black">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="text-center max-w-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/30">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  How can I help you code today?
                </h2>
                <p className="text-white mb-12 text-lg">
                  I'm Echo AI, your intelligent coding assistant. I can help you generate code, 
                  explain algorithms, debug issues, and much more.
                </p>
                
                {/* Suggestion Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div 
                    className="p-6 border border-black bg-orange-500/20 backdrop-blur-sm rounded-xl hover:border-orange-500 hover:bg-orange-500/30 cursor-pointer transition-all duration-300 shadow-lg"
                    onClick={() => setInput("Create a Python function to sort a list of dictionaries by a specific key")}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Code2 className="h-6 w-6 text-orange-400" />
                      <span className="font-semibold text-white">Code Generation</span>
                    </div>
                    <p className="text-sm text-white text-left">Generate clean, efficient code in any language</p>
                  </div>
                  
                  <div 
                    className="p-6 border border-black bg-orange-500/20 backdrop-blur-sm rounded-xl hover:border-orange-500 hover:bg-orange-500/30 cursor-pointer transition-all duration-300 shadow-lg"
                    onClick={() => setInput("Explain how React hooks work and when to use them")}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Terminal className="h-6 w-6 text-orange-400" />
                      <span className="font-semibold text-white">Code Explanation</span>
                    </div>
                    <p className="text-sm text-white text-left">Understand complex algorithms and concepts</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="px-4 py-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                    >
                      <div className={`flex items-start space-x-4 ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                            : 'bg-gradient-to-r from-black to-orange-900'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-5 w-5 text-white" />
                          ) : (
                            <Sparkles className="h-5 w-5 text-white" />
                          )}
                        </div>
                        
                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                          {/* Thinking Toggle - only for AI messages with thinking */}
                          {message.type === 'ai' && message.thinking && (
                            <ThinkingButton 
                              thinking={message.thinking} 
                              messageId={message.id} 
                              expandedThinking={expandedThinking}
                              setExpandedThinking={setExpandedThinking}
                            />
                          )}
                          
                          <div className={`${
                            message.type === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            <span className="text-sm font-semibold text-white mb-2 block">
                              {message.type === 'user' ? 'You' : 'Echo AI'}
                            </span>
                            <div className="prose max-w-none text-white bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-black">
                              {renderMessageContent(message.content)}
                            </div>
                            
                            {/* Action Buttons */}
                            {message.type === 'ai' && (
                              <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white hover:text-orange-300 hover:bg-orange-500/10 h-8 px-3 border border-black"
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                >
                                  {copiedId === message.id ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                  <span className="ml-1 text-xs">Copy</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white hover:text-orange-300 hover:bg-orange-500/10 h-8 px-3 border border-black"
                                  onClick={() => setInput("Continue with this solution")}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                  <span className="ml-1 text-xs">Continue</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
            
                {/* Enhanced Loading Animation */}
                {isLoading && <AIThinkingAnimation />}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t border-black bg-gradient-to-r from-black via-orange-900/40 to-black p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message Echo AI..."
                className="w-full min-h-[60px] max-h-[200px] p-4 pr-12 bg-black/80 backdrop-blur-sm border border-black text-white placeholder-white/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-lg"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute bottom-2 right-2 w-10 h-10 p-0 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-black"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-white">
              <span>Echo AI can make mistakes. Consider checking important information.</span>
              <span className={input.length > 3500 ? 'text-red-400' : 'text-white'}>{updateCharCount()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
