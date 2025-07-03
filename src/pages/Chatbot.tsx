import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.name}! I'm your AI mental wellness companion. I'm here to provide support, guidance, and a listening ear whenever you need it. How are you feeling today?`,
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "I hear you, and I want you to know that your feelings are completely valid. Sometimes just acknowledging how we feel is the first step toward healing.",
      "Thank you for sharing that with me. It takes courage to open up about our inner experiences. What would help you feel more supported right now?",
      "I'm here to listen and support you. Remember, it's okay to have difficult days - they don't define your worth or your future.",
      "That sounds challenging. You're doing great by reaching out and talking about it. What small step could you take today to care for yourself?",
      "I appreciate you trusting me with your thoughts. Sometimes talking through our feelings can help us see them from a new perspective.",
      "Your mental health matters, and so do you. What brings you comfort or peace when you're feeling this way?",
      "It's wonderful that you're taking time to check in with yourself. Self-awareness is a powerful tool for wellbeing.",
      "I'm glad you're here. Remember, seeking support is a sign of strength, not weakness. What would make you feel most supported right now?",
    ];

    // Simple keyword-based responses for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return "I'm sorry you're feeling sad. It's okay to feel this way - sadness is a natural human emotion. Would you like to talk about what's contributing to these feelings? Sometimes sharing can help lighten the emotional load.";
    }
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return "Anxiety can feel overwhelming, but you're not alone in this. Try taking a few deep breaths with me. What specific thoughts or situations are making you feel anxious today?";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      return "I'm so glad to hear you're feeling good! It's important to celebrate these positive moments. What's contributing to your happiness today?";
    }
    
    if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
      return "Feeling stressed is your body's way of telling you that you need care and attention. Let's work together to identify what's causing this stress and find healthy ways to manage it.";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-purple-700 dark:text-purple-300 font-medium">
              AI Mental Wellness Assistant
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Safe Space for Conversation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Share your thoughts and feelings in a judgment-free environment
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Messages */}
          <div className="h-96 lg:h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                      : 'bg-gradient-to-r from-teal-500 to-green-500'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-xs lg:max-w-md ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm lg:text-base">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Share your thoughts or feelings..."
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-4 w-4" />
              <span>AI responses are for support only and don't replace professional help</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💬 Be Open</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Share your genuine feelings. This is a safe, judgment-free space.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">🎯 Be Specific</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              The more details you share, the better I can understand and support you.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">⚡ Take Your Time</h3>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              There's no rush. Process your thoughts at your own pace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;