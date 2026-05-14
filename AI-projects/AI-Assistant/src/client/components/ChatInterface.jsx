import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatInterface = () => {
    const [messages, setMessage] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    console.log('API Key:', import.meta.env.VITE_GEMINI_API_KEY)
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessage(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const prompt = `You are a helpful study assistant. Help students understand concepts, don't just give answers.
            Student question: ${input}
            Provide a clear explaination that helps them learn.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const aiMessage = { role: 'assistant', content: text};
            setMessage(prev => [...prev, aiMessage]);
}catch (error){
    console.error('Error:', error);
    const errorMessage = {
        role:'assistant',
        content: 'Sorry, I encountered an error.Please try again'
    };
    setMessage(prev => [...prev, errorMessage]);
   
}finally {
    setLoading(false);
}};
return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>AI Study Assistant</h1>
        <p>Ask me anything to help you learn!</p>
      </div>

      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p>👋 Hi! I'm your AI study assistant.</p>
            <p>Ask me to explain concepts, solve problems, or help you understand your homework!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage)
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'AI Assistant'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div style={styles.loading}>
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={styles.input}
          disabled={loading}
        />
        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  chatBox: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    minHeight: '400px',
    maxHeight: '500px',
    overflowY: 'auto',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  emptyState: {
    textAlign: 'center',
    color: '#666',
    padding: '40px 20px',
  },
  message: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '6px',
  },
  userMessage: {
    backgroundColor: '#e3f2fd',
    marginLeft: '20%',
  },
  aiMessage: {
    backgroundColor: '#fff',
    marginRight: '20%',
    border: '1px solid #e0e0e0',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  inputForm: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
export default ChatInterface;
