import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatInterface = () => {
    const [messages, setMessage] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessage(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const model = genAI.getGenerativeModel({model: 'gemini-pro'});
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
    <div className="container">
        <div className="header">
            <h1>AI Study Buddy</h1>
            <p>Ask me anything , lets Learn together!</p>
        </div>

        <div  className="chatBox">
            {messages.length === 0 && (
                <div className="emptyState">
                    <p>Hi! I'm Perpe your AI study assistant.</p>
                    <p>Ask me to explain concepts, solve problems, or help you understand your homework!</p>
                </div>
            )}
            {messages.map((msg, idx)) => (
                <div 
                key={idx}
                style={{}}>

                </div>
            )}
        </div>
    </div>
)