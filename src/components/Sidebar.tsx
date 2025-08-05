'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {


const router = useRouter();

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('token'); // or any other login flag
    localStorage.removeItem('user');  // if stored

    // Redirect to login
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      <div className="logo">Gemini</div>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard">📂 Dashboard</Link>
          </li>
          <li>
            <Link href="#">🧠 AI Tools</Link>
          </li>
          <li>
            <Link href="#">⚙️ Settings</Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
    </aside>
  );
}
