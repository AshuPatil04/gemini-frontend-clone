'use client';

import { useParams } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import { useMessageStore } from '@/store/messageStore';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { Message } from '@/types';

export default function ChatroomPage() {
  const { chatroomId } = useParams();
  const chatroom = useChatStore((s) =>
    s.chatrooms.find((c) => c.id === chatroomId)
  );

  const { messages, addMessage } = useMessageStore();
  const [input, setInput] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingOld, setLoadingOld] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 
  const simulateGeminiResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      const aiReply: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'This is a simulated Gemini response 🤖',
        timestamp: new Date().toISOString(),
      };
      addMessage(aiReply);
      setIsTyping(false);
    }, 1500);
  };

  const sendMessage = () => {
    if (!input.trim() && !imageData) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim() || '',
      image: imageData || undefined,
      timestamp: new Date().toISOString(),
    };

    addMessage(msg);
    setInput('');
    setImageData(null);
    simulateGeminiResponse();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  
  useEffect(() => {
    const div = chatBoxRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (div.scrollTop === 0 && !loadingOld) {
        setLoadingOld(true);
        toast('Loading older messages...');
        setTimeout(() => {
          const dummyOld = Array.from({ length: 5 }).map((_, i) => ({
            id: `old-${Date.now() + i}`,
            sender: 'ai' as const,
            text: `Old message ${i + 1}`,
            timestamp: new Date().toISOString(),
          }));
          dummyOld.reverse().forEach(addMessage);
          setLoadingOld(false);
        }, 1000);
      }
    };

    div.addEventListener('scroll', handleScroll);
    return () => div.removeEventListener('scroll', handleScroll);
  }, [loadingOld]);

  if (!chatroom) return <div className="container">Chatroom not found</div>;

 return (


  <div className="chatroom-layout">
    {/* Header */}
    <div className="chatroom-header">
      <Link href="/dashboard">
        <button className="back-btn">← Back</button>
      </Link>
      <h2>{chatroom.title}</h2>
    </div>

    {/* Main chat area */}
    <div className="chat-scrollable-area" ref={chatBoxRef}>
      {messages.map((msg) => (
        <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
          <div
            className="chat-content"
            onClick={() => {
              navigator.clipboard.writeText(msg.text || '');
              toast.success('Message copied!');
            }}
            title="Click to copy"
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.image && <img src={msg.image} alt="img" className="chat-img" />}
          </div>
          <div className="chat-time">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
      {isTyping && <div className="chat-bubble ai">Gemini is typing...</div>}
      <div ref={bottomRef} />
    </div>

    {/* Input box fixed at bottom */}
    <div className="chat-input-fixed">
      <div className="chat-input-row">
        <textarea
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="chat-file-row">
        <label htmlFor="file-upload" className="file-label">📎 Attach Files</label>
        <input id="file-upload" type="file" onChange={handleImageUpload} hidden />
        {imageData && <img src={imageData} alt="preview" className="preview-img" />}
      </div>
    </div>
  </div>



);

}
