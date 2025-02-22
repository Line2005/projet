import React from "react";

export const SidebarLink = ({ href, icon: Icon, children, isActive }) => (
    <a
        href={href}
        className={`flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200 ${
            isActive
                ? 'bg-emerald-600/50 text-white'
                : 'text-emerald-100 hover:bg-emerald-600/30'
        }`}
    >
        <Icon className="h-4 w-4 xl:h-5 xl:w-5"/>
        <span className="text-sm xl:text-base">{children}</span>
    </a>
);