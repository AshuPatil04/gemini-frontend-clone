import { create } from 'zustand';

interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
}

interface ChatStore {
  chatrooms: Chatroom[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
}

const LOCAL_KEY = 'chatrooms';

const getStoredChatrooms = (): Chatroom[] => {
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to parse chatrooms from localStorage:', e);
    return [];
  }
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chatrooms: typeof window !== 'undefined' ? getStoredChatrooms() : [],
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  createChatroom: (title) => {
    const newRoom: Chatroom = {
      id: Date.now().toString(),
      title,
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().chatrooms, newRoom];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    set({ chatrooms: updated });
  },

  deleteChatroom: (id) => {
    const updated = get().chatrooms.filter((room) => room.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    set({ chatrooms: updated });
  },
}));
