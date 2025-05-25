import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";
import { 
  Code, 
  Lightbulb, 
  Bug, 
  GraduationCap, 
  Globe, 
  Zap,
  Play,
  Rocket,
  CheckCircle,
  Send
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Code className="h-8 w-8 text-white" />,
      title: "Code Generation",
      description: "Generate clean, efficient code in any programming language. From simple functions to complex algorithms, Echo AI delivers production-ready code instantly.",
      color: "bg-echo-orange"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-white" />,
      title: "Code Explanation",
      description: "Understand complex code with detailed explanations. Echo AI breaks down algorithms, explains logic, and helps you learn programming concepts effectively.",
      color: "bg-echo-amber"
    },
    {
      icon: <Bug className="h-8 w-8 text-white" />,
      title: "Debug & Optimize",
      description: "Find and fix bugs quickly. Echo AI analyzes your code, identifies issues, and suggests optimizations to improve performance and maintainability.",
      color: "bg-green-500"
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-white" />,
      title: "Learn & Improve",
      description: "Perfect for beginners and experienced developers. Get personalized learning suggestions and best practices to level up your coding skills.",
      color: "bg-purple-500"
    },
    {
      icon: <Globe className="h-8 w-8 text-white" />,
      title: "Multi-Language",
      description: "Support for all major programming languages including Python, JavaScript, Java, C++, Go, Rust, and many more. Switch between languages seamlessly.",
      color: "bg-blue-500"
    },
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: "Lightning Fast",
      description: "Get instant responses powered by advanced AI technology. No waiting, no delays - just fast, accurate code assistance when you need it most.",
      color: "bg-red-500"
    }
  ];

  const languages = [
    { name: "Python", icon: "🐍", color: "text-blue-400" },
    { name: "JavaScript", icon: "⚡", color: "text-yellow-400" },
    { name: "Java", icon: "☕", color: "text-red-500" },
    { name: "React", icon: "⚛️", color: "text-blue-400" },
    { name: "C++", icon: "#️⃣", color: "text-purple-400" },
    { name: "Go", icon: "🐹", color: "text-blue-300" }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Use wouter's navigation instead of direct window location
      window.location.href = "/chat";
    }
    // If not authenticated, the AuthModal will handle the login
  };

  return (
    <div className="min-h-screen bg-echo-dark text-white">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-white">AI-Powered</span><br />
                <span className="echo-orange">Code Assistant</span>
              </h1>
              <p className="text-xl text-echo-gray leading-relaxed">
                Generate clean, efficient code in seconds. Echo AI explains complex algorithms, 
                debugs your programs, and supports all programming languages. 
                <span className="echo-amber font-semibold"> Perfect for beginners and pros alike.</span>
              </p>
            </div>
            
            <div className="flex justify-center">
              {isAuthenticated ? (
                <Button
                  onClick={handleGetStarted}
                  className="bg-echo-orange hover:bg-echo-amber text-white px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 animate-pulse-glow"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Coding Now
                </Button>
              ) : (
                <AuthModal>
                  <Button
                    className="bg-echo-orange hover:bg-echo-amber text-white px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 animate-pulse-glow"
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Coding Now
                  </Button>
                </AuthModal>
              )}
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-echo-gray">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-echo-orange" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-echo-orange" />
                <span>Beginner Friendly</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-echo-orange" />
                <span>Multi-Language</span>
              </div>
            </div>
          </motion.div>
          
          {/* Demo Chat Interface */}
          <motion.div 
            className="bg-echo-surface rounded-2xl shadow-2xl border border-gray-800 overflow-hidden animate-float"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-echo-gray text-sm ml-4">Echo AI Chat</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 h-96 overflow-y-auto">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="message-bubble bg-echo-orange text-white px-4 py-3 rounded-2xl rounded-tr-md max-w-xs">
                  <span>Can you help me create a Python function to sort a list?</span>
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex justify-start">
                <div className="message-bubble bg-gray-800 text-white px-4 py-3 rounded-2xl rounded-tl-md max-w-xs">
                  <div className="space-y-3">
                    <p>I'll help you create that! Here's a clean Python function:</p>
                    <Card className="bg-gray-900 border-gray-700 p-3">
                      <code className="text-green-400 text-sm font-mono">
                        def sort_list(items):<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;return sorted(items)
                      </code>
                    </Card>
                    <p className="text-sm text-echo-gray">This function takes any list and returns a sorted version. Want me to explain how it works?</p>
                  </div>
                </div>
              </div>
              
              {/* Typing Indicator */}
              <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-echo-orange rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-echo-orange rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-echo-orange rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 text-sm text-gray-400">
                  Ask Echo AI anything...
                </div>
                <div className="bg-echo-orange p-3 rounded-lg">
                  <Send className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-echo-dark">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Powerful Features for</span><br />
              <span className="echo-orange">Every Developer</span>
            </h2>
            <p className="text-xl text-echo-gray max-w-3xl mx-auto">
              From code generation to debugging, Echo AI provides intelligent assistance 
              that adapts to your coding style and experience level.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="feature-card bg-echo-surface p-8 border-gray-800 h-full">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-echo-gray leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-echo-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">About</span><br />
                <span className="echo-orange">Echo AI</span>
              </h2>
              <div className="space-y-6 text-lg text-echo-gray leading-relaxed">
                <p>
                  Echo AI is revolutionizing how developers write, understand, and improve code. 
                  Our intelligent assistant combines cutting-edge AI technology with deep 
                  programming knowledge to provide instant, accurate coding assistance.
                </p>
                <p>
                  Whether you're a complete beginner taking your first steps into programming 
                  or an experienced developer tackling complex projects, Echo AI adapts to 
                  your skill level and provides personalized guidance.
                </p>
                <p>
                  Our mission is simple: <span className="echo-amber font-semibold">make coding accessible, 
                  enjoyable, and efficient for everyone.</span> We believe that great code 
                  shouldn't be limited by experience level or available resources.
                </p>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold echo-orange">50K+</div>
                  <div className="text-echo-gray">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold echo-orange">1M+</div>
                  <div className="text-echo-gray">Code Snippets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold echo-orange">25+</div>
                  <div className="text-echo-gray">Languages</div>
                </div>
              </div>
              <Link href="/about">
                <Button variant="outline" className="border-echo-orange text-echo-orange hover:bg-echo-orange hover:text-white">
                  Learn More
                </Button>
              </Link>
            </motion.div>
            
            {/* Languages Showcase */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900 p-8 border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-echo-gray">
                    <span>Supported Languages</span>
                    <span className="echo-orange">25+ Languages</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {languages.map((lang) => (
                      <Card key={lang.name} className="bg-echo-surface p-3 text-center border-gray-700">
                        <div className="text-xl mb-2">{lang.icon}</div>
                        <div className="text-white">{lang.name}</div>
                      </Card>
                    ))}
                  </div>
                  
                  <Card className="mt-6 p-4 bg-echo-dark border-echo-orange">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-echo-orange rounded-full animate-pulse"></div>
                      <span className="text-sm echo-orange font-semibold">Ultra-Fast Response</span>
                    </div>
                    <div className="text-xs text-echo-gray">
                      Average response time: <span className="echo-amber">0.8 seconds</span>
                    </div>
                  </Card>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-echo-dark">
        <motion.div 
          className="max-w-4xl mx-auto px-4 text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-white">Ready to Transform</span><br />
            <span className="echo-orange">Your Coding Experience?</span>
          </h2>
          <p className="text-xl text-echo-gray max-w-2xl mx-auto">
            Join thousands of developers who are already coding smarter, faster, 
            and more efficiently with Echo AI. Get started in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-echo-orange hover:bg-echo-amber text-white px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 animate-pulse-glow"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Get Started Free
            </Button>
            <Button
              variant="outline"
              className="border-2 border-echo-orange text-echo-orange hover:bg-echo-orange hover:text-white px-8 py-4 text-lg font-bold transition-all duration-300"
            >
              <span className="mr-2">❓</span>
              Have Questions?
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-echo-surface border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-echo-orange rounded-lg flex items-center justify-center">
                  <Zap className="text-white h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-white">Echo AI</span>
              </div>
              <p className="text-echo-gray text-sm">
                Intelligent code assistance for developers of all skill levels. 
                Making programming accessible and efficient.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Product</h4>
              <div className="space-y-2 text-sm text-echo-gray">
                <a href="#features" className="block hover:text-echo-orange transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-echo-orange transition-colors">Pricing</a>
                <a href="#" className="block hover:text-echo-orange transition-colors">API</a>
                <a href="#" className="block hover:text-echo-orange transition-colors">Documentation</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <div className="space-y-2 text-sm text-echo-gray">
                <Link href="/about">
                  <span className="block hover:text-echo-orange transition-colors cursor-pointer">About</span>
                </Link>
                <span className="block hover:text-echo-orange transition-colors cursor-pointer">Blog</span>
                <span className="block hover:text-echo-orange transition-colors cursor-pointer">Careers</span>
                <span className="block hover:text-echo-orange transition-colors cursor-pointer">Contact</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Support</h4>
              <div className="space-y-2 text-sm text-echo-gray">
                <a href="#" className="block hover:text-echo-orange transition-colors">Help Center</a>
                <a href="#" className="block hover:text-echo-orange transition-colors">Community</a>
                <a href="#" className="block hover:text-echo-orange transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-echo-orange transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-echo-gray">
            <p>&copy; 2024 Echo AI. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-echo-orange transition-colors">
                <span>𝕏</span>
              </a>
              <a href="#" className="hover:text-echo-orange transition-colors">
                <span>📱</span>
              </a>
              <a href="#" className="hover:text-echo-orange transition-colors">
                <span>💬</span>
              </a>
              <a href="#" className="hover:text-echo-orange transition-colors">
                <span>💼</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
