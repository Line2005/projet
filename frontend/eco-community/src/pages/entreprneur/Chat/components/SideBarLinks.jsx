import React from "react";

export const SidebarLink = ({ href, icon: Icon, children, isActive }) => (
    <a
        href={href}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
                ? 'bg-emerald-600/50 text-white'
                : 'text-emerald-100 hover:bg-emerald-600/30'
        }`}
    >
        <Icon className="h-5 w-5"/>
        <span>{children}</span>
    </a>
);
