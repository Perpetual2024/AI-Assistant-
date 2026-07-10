import { useState } from "react";

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = {
            role: "user",
            content: input,
        };

        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            {
                                role: "system",
                                content:
                                    "You are a helpful study assistant. Explain concepts clearly without simply giving away the answers.",
                            },
                            ...updatedMessages,
                        ],
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Something went wrong.");
            }

            const aiMessage = {
                role: "assistant",
                content: data.choices[0].message.content,
            };

            setMessages([...updatedMessages, aiMessage]);
        } catch (error) {
            console.error(error);

            setMessages([
                ...updatedMessages,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong. Please try again later.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

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
                        <p>
                            Ask me to explain concepts, solve problems, or help
                            you understand your homework!
                        </p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            ...(msg.role === "user"
                                ? styles.userMessage
                                : styles.aiMessage),
                        }}
                    >
                        <strong>
                            {msg.role === "user" ? "You" : "AI Assistant"}
                        </strong>
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
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    style={styles.input}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },

    header: {
        textAlign: "center",
        marginBottom: "20px",
    },

    chatBox: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        minHeight: "400px",
        maxHeight: "500px",
        overflowY: "auto",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
    },

    emptyState: {
        textAlign: "center",
        color: "#666",
        padding: "40px 20px",
    },

    message: {
        marginBottom: "15px",
        padding: "10px",
        borderRadius: "6px",
    },

    userMessage: {
        backgroundColor: "#e3f2fd",
        marginLeft: "20%",
    },

    aiMessage: {
        backgroundColor: "#161616",
        marginRight: "20%",
        border: "1px solid #ddd",
    },

    loading: {
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
    },

    inputForm: {
        display: "flex",
        gap: "10px",
    },

    input: {
        flex: 1,
        padding: "12px",
        fontSize: "16px",
        border: "1px solid #ddd",
        borderRadius: "4px",
    },

    button: {
        padding: "12px 24px",
        fontSize: "16px",
        backgroundColor: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default ChatInterface;