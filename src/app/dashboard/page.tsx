'use client';

import { useChatStore } from '@/store/chatStore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';


export default function DashboardPage() {
  const { chatrooms, createChatroom, deleteChatroom, searchQuery, setSearchQuery } = useChatStore();
  const [newChatroom, setNewChatroom] = useState('');
  const { toggle, dark } = useThemeStore();

  const handleCreate = () => {
    if (newChatroom.trim()) {
      createChatroom(newChatroom.trim());
      toast.success('Chatroom created!');
      setNewChatroom('');
    }
  };
   const handleDelete = (id: string) => {    
    deleteChatroom(id);
   toast.success('Chatroom deleted');
 
  };

  const filteredRooms = chatrooms.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <h1>Gemini AI Dashboard</h1>
        <div className="nav-actions">
          <input
            type="text"
            placeholder="Search chatrooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={toggle}>
            {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </nav>

      {/* MAIN DASHBOARD */}
      <div className="dashboard-container">
        {/* Create Chatroom Section */}
        <div className="create-box">
          <input
            type="text"
            placeholder="New chatroom name..."
            value={newChatroom}
            onChange={(e) => setNewChatroom(e.target.value)}
          />
          <button onClick={handleCreate}>+ Create</button>
        </div>

        {/* Chatroom Cards */}
        <div className="chatroom-grid">
          {filteredRooms.length === 0 && <p>No chatrooms found.</p>}
          {filteredRooms.map((room) => (
            <div key={room.id} className="chatroom-card">
              <div>
                <h3>{room.title}</h3>
                <p>{new Date(room.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="card-actions">
                <Link href={`/chat/${room.id}`}>
                  <button className="open-btn">Open</button>
                </Link>
             
                 <button className='delete-btn' onClick={() => handleDelete(room.id)} style={{ marginLeft: '1rem' }}>
           🗑
            </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
