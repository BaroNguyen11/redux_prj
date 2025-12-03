import React, { useState } from 'react';
const CLAY_FLOAT = "shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)]";
const CLAY_DENT = "shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)]";
const CLAY_PUFFY = "shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)]";
import { ChevronDown, Mail, Phone, MapPin, Trash2 } from "lucide-react";
const UserAvatar = ({ name, avatar }) => {
    const [error, setError] = useState(false);
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    const clayAvatarClass = `w-24 h-24 rounded-full border-[6px] border-white ${CLAY_FLOAT} flex items-center justify-center overflow-hidden bg-indigo-100 relative`;

    if (avatar && !error) {
        return (
            <div className={clayAvatarClass}>
                <img src={avatar} alt={name} onError={() => setError(true)} className="w-full h-full object-cover" />
                {/* Lớp phủ bóng kính */}
                <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),inset_5px_5px_15px_rgba(255,255,255,0.6)] pointer-events-none"></div>
            </div>
        );
    }
    return (
        <div className={`${clayAvatarClass} text-4xl font-black text-indigo-500`}>
            {initial}
            <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),inset_5px_5px_15px_rgba(255,255,255,0.6)] pointer-events-none"></div>
        </div>
    );
};
const UserCard = ({ user, onViewDetails, onDelete }) => (
    <div
        className={`w-full max-w-[350px] mx-auto rounded-[40px] bg-white ${CLAY_FLOAT} p-6 flex flex-col h-full group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 relative overflow-hidden border border-white cursor-pointer`}
        onClick={() => onViewDetails(user)}
    >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
        <div className="absolute top-4 right-4 z-20">
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
                className="w-10 h-10 rounded-full bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all shadow-[inset_0px_-2px_4px_0px_hsl(214,72%,35%)] cursor-pointer active:scale-95"
                title="Xóa nhanh"
            >
                <Trash2 size={18} strokeWidth='3'/>
            </button>
        </div>
        <div className="flex justify-center -mt-2 mb-4 relative z-10 pointer-events-none">
            <UserAvatar name={user.name} avatar={user.avatar} />
        </div>
        <div className="text-center mb-6 relative z-10 pointer-events-none">
            <h2 className="text-2xl font-extrabold text-slate-800 truncate px-2" title={user.name}>{user.name}</h2>
            <p className="text-sm font-bold text-indigo-400 mt-1 truncate px-4 uppercase tracking-wide" title={user.job}>{user.job || 'Freelancer'}</p>
            <div className="flex justify-center gap-2 mt-3">
                <span className={`text-[11px] font-bold px-4 py-2 rounded-full bg-slate-100 text-slate-500 ${CLAY_PUFFY}`}>{user.company || 'Unknown'}</span>
            </div>
        </div>
        <div className={`space-y-3 text-sm text-slate-600 flex-1 p-5 rounded-[25px] bg-[#f8f9fc] ${CLAY_DENT} mb-4 pointer-events-none`}>
            <div className="flex items-center gap-3"><Mail size={16} className="text-indigo-400 shrink-0" /><span className="truncate" title={user.email}>{user.email}</span></div>
            <div className="flex items-center gap-3"><Phone size={16} className="text-pink-400 shrink-0" /><span className="truncate">{user.phone}</span></div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-emerald-400 shrink-0" /><span className="truncate">{user.city || 'N/A'}</span></div>
        </div>
        <div className="mt-auto pt-2 flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
            <span className="text-xs font-bold mb-1">Xem chi tiết</span>
            <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
        </div>
    </div>

);

export default UserCard;