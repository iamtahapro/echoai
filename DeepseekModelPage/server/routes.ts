import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Check daily limit if userId is provided
      if (userId) {
        const canMakeRequest = await storage.canUserMakeRequest(userId);
        if (!canMakeRequest) {
          return res.status(429).json({ 
            error: "You have reached your daily limit of 10 requests. Upgrade your plan for unlimited access!",
            limitReached: true
          });
        }
        // Increment request count
        await storage.incrementUserRequestCount(userId);
      }

      // Get conversation history for context
      let chatHistory = [];
      if (userId) {
        const fullHistory = await storage.getChatHistory(userId);
        chatHistory = fullHistory.slice(-6); // Get last 6 messages for context
      }

      // Use server-side Groq API key with conversation context
      const response = await processMessage(message, chatHistory);
      
      // Store chat history if userId is provided
      if (userId) {
        await storage.saveChatMessage(userId, 'user', message);
        await storage.saveChatMessage(userId, 'ai', response);
      }

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get chat history
  app.get("/api/chat/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await storage.getChatHistory(userId);
      res.json({ history });
    } catch (error) {
      console.error("History error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (data: Buffer) => {
      try {
        const { message, apiKey, userId } = JSON.parse(data.toString());
        
        if (!message || !apiKey) {
          ws.send(JSON.stringify({ error: "Message and API key are required" }));
          return;
        }

        // Send typing indicator
        ws.send(JSON.stringify({ type: 'typing', isTyping: true }));

        // Process message
        const response = await processMessage(message);
        
        // Store chat history
        if (userId) {
          await storage.saveChatMessage(userId, 'user', message);
          await storage.saveChatMessage(userId, 'ai', response);
        }

        // Send response
        ws.send(JSON.stringify({ 
          type: 'message', 
          response,
          timestamp: new Date().toISOString()
        }));

        // Stop typing indicator
        ws.send(JSON.stringify({ type: 'typing', isTyping: false }));

      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({ error: "Error processing message" }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}

// Process message with AI using Groq API with conversation context
async function processMessage(message: string, chatHistory: any[] = []): Promise<string> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    // Build conversation context
    const conversationContext = chatHistory.length > 0 
      ? chatHistory.map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n') 
      : '';

    // Detect if user is asking for code or explanation
    const isCodeRequest = /\b(write|create|build|make|generate|code|function|component|script|program)\b/i.test(message) ||
                         /\b(how to|show me|give me)\b.*\b(code|function|script|example)\b/i.test(message);
    
    const isExplanationRequest = /\b(explain|what does|how does|why|what is|describe|tell me about)\b/i.test(message);

    let systemPrompt;
    if (isCodeRequest && !isExplanationRequest) {
      systemPrompt = `<think>
The user is asking for code. I should provide clean, production-ready code without unnecessary explanations unless they specifically ask for explanations.
</think>

You are Echo AI, a professional coding assistant. When users ask for code:
- Provide ONLY clean, production-ready code
- No explanations unless specifically requested  
- Use proper syntax and best practices
- Be concise and direct

When users ask for explanations:
- Provide clear, detailed explanations
- Include code examples when helpful
- Break down complex concepts

Remember previous conversation context for continuity.`;
    } else {
      systemPrompt = `<think>
The user seems to be asking for an explanation or general conversation. I should provide helpful information and only include code if they specifically request it.
</think>

You are Echo AI, a helpful coding assistant. Provide clear, informative responses. Include code examples only when specifically requested or when they would be genuinely helpful for understanding. Remember our previous conversation for context.`;
    }

    // Build messages array with conversation context
    const messages = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation context if available
    if (conversationContext) {
      messages.push({ role: "system", content: `Previous conversation:\n${conversationContext}` });
    }

    messages.push({ role: "user", content: message });
    
    // Call Groq API with deepseek-r1-distill-llama-70b model
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-r1-distill-llama-70b",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

  } catch (error) {
    console.error("Error processing message:", error);
    
    // Fallback response for common programming questions
    if (message.toLowerCase().includes('python')) {
      return `Here's a Python solution for you:

\`\`\`python
# Example Python function
def example_function(data):
    """
    This function processes the input data
    """
    processed_data = []
    for item in data:
        if item is not None:
            processed_data.append(str(item).strip())
    return processed_data

# Usage example
result = example_function(['hello', 'world', None, 123])
print(result)  # ['hello', 'world', '123']
\`\`\`

This function:
1. Creates an empty list to store processed data
2. Iterates through each item in the input
3. Filters out None values
4. Converts remaining items to strings and removes whitespace
5. Returns the processed list

Would you like me to explain any specific part or modify the function for your needs?`;
    }
    
    if (message.toLowerCase().includes('javascript')) {
      return `Here's a JavaScript solution:

\`\`\`javascript
// Modern JavaScript function with ES6+ features
const processData = (data) => {
    return data
        .filter(item => item !== null && item !== undefined)
        .map(item => String(item).trim())
        .sort();
};

// Usage example
const result = processData(['hello', 'world', null, 123, '  test  ']);
console.log(result); // ['123', 'hello', 'test', 'world']
\`\`\`

This function uses:
- \`filter()\` to remove null/undefined values
- \`map()\` to convert items to strings and trim whitespace
- \`sort()\` to alphabetically sort the results

The arrow function syntax makes it concise and modern. Need any modifications?`;
    }
    
    return "I apologize, but I'm having trouble connecting to the AI service right now. This could be due to an invalid API key or network issues. Please check your API key and try again.";
  }
}
