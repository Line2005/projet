import React from 'react';
import { FileText, HelpCircle, Users, BarChart2, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
    <aside
        className={`fixed top-0 left-0 h-full w-64 bg-emerald-700 transition-transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40`}
    >
        <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">EcoCommunity</h2>
            <nav>
                <a href="/projects" className="block mb-2">Projects</a>
                <a href="/requests" className="block mb-2">Help Requests</a>
                <a href="/settings" className="block mb-2">Settings</a>
            </nav>
        </div>
        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute bottom-4 left-4 text-white">
            <LogOut /> Logout
        </button>
    </aside>
);

export default Sidebar;
