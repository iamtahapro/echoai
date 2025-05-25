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
  Terminal,
  Crown,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [requestCount, setRequestCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        const errorData = await response.json();
        if (errorData.limitReached) {
          setShowLimitModal(true);
          return;
        }
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      // Increment request count
      setRequestCount(prev => prev + 1);
      
      // Extract thinking and actual response
      const fullResponse = data.response;
      const thinkingMatch = fullResponse.match(/<think>([\s\S]*?)<\/think>/);
      const thinking = thinkingMatch ? thinkingMatch[1].trim() : '';
      const actualResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      addMessage('ai', actualResponse || fullResponse, thinking);
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

  const ThinkingButton = ({ thinking, messageId }: { thinking: string; messageId: string }) => {
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

  const CodeBlock = ({ code, language }: { code: string; language?: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast({
          title: "Code copied!",
          description: "Code has been copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/50 rounded-lg my-4 overflow-hidden shadow-lg"
      >
        <div className="flex items-center justify-between bg-orange-500/30 backdrop-blur-sm px-4 py-3 border-b border-orange-400/50">
          <div className="flex items-center space-x-2">
            <Code2 className="h-4 w-4 text-orange-300" />
            <span className="text-sm text-orange-100 font-semibold">
              {language || 'JavaScript'}
            </span>
          </div>
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="h-7 px-3 text-orange-200 hover:text-white hover:bg-orange-500/50 transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-sm">
          <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {code.trim()}
          </pre>
        </div>
      </motion.div>
    );
  };

  const detectLanguage = (code: string): string => {
    // Enhanced language detection
    if (code.includes('import React') || code.includes('useState') || code.includes('useEffect')) return 'React';
    if (code.includes('function') && (code.includes('const') || code.includes('let'))) return 'JavaScript';
    if (code.includes('def ') || code.includes('import ') && code.includes('from ')) return 'Python';
    if (code.includes('#include') || code.includes('int main')) return 'C++';
    if (code.includes('public class') || code.includes('public static void main')) return 'Java';
    if (code.includes('<?php') || code.includes('echo ')) return 'PHP';
    if (code.includes('<html') || code.includes('<div') || code.includes('<component')) return 'HTML';
    if (code.includes('.class') || code.includes('margin:') || code.includes('background:')) return 'CSS';
    if (code.includes('SELECT') || code.includes('INSERT') || code.includes('UPDATE')) return 'SQL';
    if (code.includes('npm ') || code.includes('yarn ') || code.includes('git ')) return 'Terminal';
    if (code.includes('import ') || code.includes('export ')) return 'JavaScript';
    return 'Code';
  };

  const formatMessage = (content: string) => {
    // Enhanced code detection
    const isEntirelyCode = /^[\s]*(?:function|const|let|var|class|import|export|def |#include|public class|<?php|\{|\[)[\s\S]*$/m.test(content.trim()) ||
                          (content.split('\n').length > 2 && /[\{\}\[\]\(\);]/.test(content) && !content.includes('explain') && !content.includes('Here'));
    
    if (isEntirelyCode) {
      const language = detectLanguage(content);
      return <CodeBlock code={content} language={language} />;
    }

    // Handle regular markdown code blocks
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push(
            <span key={`text-${lastIndex}`} 
              dangerouslySetInnerHTML={{ 
                __html: textBefore.replace(/\n/g, '<br>') 
              }} 
            />
          );
        }
      }

      // Add code block
      parts.push(
        <CodeBlock 
          key={`code-${match.index}`}
          code={match[2]} 
          language={match[1]} 
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push(
          <span key={`text-${lastIndex}`}
            dangerouslySetInnerHTML={{ 
              __html: remainingText.replace(/\n/g, '<br>') 
            }} 
          />
        );
      }
    }

    return parts.length > 0 ? <div>{parts}</div> : content;
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
            onClick={() => setMessages([])}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="text-xs text-white mb-3 px-2 font-medium">Recent Chats</div>
          <div className="space-y-2">
            {messages.length > 0 && (
              <div className="text-sm text-white p-3 rounded-lg bg-orange-500/20 border border-black cursor-pointer truncate hover:bg-orange-500/30 transition-colors">
                Current Chat
              </div>
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
              {/* Request Counter */}
              <div className="max-w-4xl mx-auto mb-4">
                <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span className="text-white text-sm">
                      Daily Requests: <span className="text-orange-400 font-semibold">{requestCount}/10</span>
                    </span>
                    {requestCount >= 8 && (
                      <span className="text-orange-300 text-xs">(Almost at limit!)</span>
                    )}
                  </div>
                </div>
              </div>
              
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
                          <div className={`${
                            message.type === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            <span className="text-sm font-semibold text-white mb-2 block">
                              {message.type === 'user' ? 'You' : 'Echo AI'}
                            </span>
                            
                            {/* Thinking Button for AI */}
                            {message.type === 'ai' && message.thinking && (
                              <ThinkingButton thinking={message.thinking} messageId={message.id} />
                            )}
                            
                            <div className="prose max-w-none text-white bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-black">
                              {formatMessage(message.content)}
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
            
                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-black to-orange-900 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-white mb-2 block">Echo AI</span>
                        <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-black">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
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

    {/* Upgrade Modal */}
    {showLimitModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-black to-orange-900/20 border border-orange-500/50 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Daily Limit Reached!
            </h3>
            
            <p className="text-gray-300 mb-6">
              You've used all 10 of your daily requests. Upgrade to unlock unlimited access and premium features!
            </p>
            
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                onClick={() => setShowLimitModal(false)}
              >
                Upgrade Now
              </Button>
              
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                onClick={() => setShowLimitModal(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            onClick={() => setShowLimitModal(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    )}
  );
}
