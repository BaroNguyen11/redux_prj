
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { fetchUsers, setPage, deleteUser, setSelectedUser } from './userSlice';
import VirtualList from '../../components/VirtualList';
import SortLimitControls from '../../components/SortLimitControls';
import UsersForm from './UserForm';
import { ChevronDown, Plus, RefreshCw, User, Mail, Phone, MapPin, Trash2 } from "lucide-react";

// STYLE CONFIG
const CLAY_BG = "bg-[#f0f2f5]";
const CLAY_TEXT = "text-slate-700";
const CLAY_FLOAT = "shadow-[10px_10px_20px_#d1d5db,-10px_-10px_20px_#ffffff]";
const CLAY_PUFFY = "shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.05),inset_5px_5px_10px_rgba(255,255,255,0.8)]";
const CLAY_DENT = "shadow-[inset_5px_5px_10px_#d1d5db,inset_-5px_-5px_10px_#ffffff]";
const blades = Array.from({ length: 12 });
// --- AVATAR ---
const UserAvatar = ({ name, avatar }) => {
  const [error, setError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const clayAvatarClass = `w-24 h-24 rounded-full border-[6px] border-white ${CLAY_FLOAT} flex items-center justify-center overflow-hidden bg-indigo-100`;

  if (avatar && !error) {
    return (
      <div className={clayAvatarClass}>
        <img src={avatar} alt={name} onError={() => setError(true)} className="w-full h-full object-cover" />

      </div>
    );
  }
  return (
    <div className={`${clayAvatarClass} text-4xl font-black text-indigo-500`}>
      {initial}

    </div>
  );
};

// --- USER CARD (UX Mới) ---
const UserCard = ({ user, onViewDetails, onDelete }) => (
  <div className={`w-full max-w-[350px] mx-auto rounded-[40px] bg-white ${CLAY_FLOAT} p-6 flex flex-col h-full group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 relative overflow-hidden border border-white cursor-pointer`} onClick={() => onViewDetails(user)}>

    {/* Decor Blobs */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

    {/* HEADER ACTIONS (Nút Xóa góc phải) */}
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(user.id); }} // Chặn sự kiện click vào card
        className="w-10 h-10 rounded-full bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all shadow-sm hover:shadow-md cursor-pointer"
        title="Xóa nhanh"
      >
        <Trash2 size={18} />
      </button>
    </div>

    {/* AVATAR */}
    <div className="flex justify-center -mt-2 mb-4 relative z-10 pointer-events-none">
      <UserAvatar name={user.name} avatar={user.avatar} />
    </div>

    {/* INFO */}
    <div className="text-center mb-6 relative z-10 pointer-events-none">
      <h2 className="text-2xl font-extrabold text-slate-800 truncate px-2">{user.name}</h2>
      <p className="text-sm font-bold text-indigo-400 mt-1 truncate px-4 uppercase tracking-wide">{user.job || 'Freelancer'}</p>
      <div className="flex justify-center gap-2 mt-3">
        <span className={`text-[11px] font-bold px-4 py-2 rounded-full bg-slate-100 text-slate-500 ${CLAY_PUFFY}`}>{user.company || 'Unknown'}</span>
      </div>
    </div>

    {/* CONTACT MINI */}
    <div className={`space-y-3 text-sm text-slate-600 flex-1 p-5 rounded-[25px] bg-[#f8f9fc] ${CLAY_DENT} mb-4 pointer-events-none`}>
      <div className="flex items-center gap-3"><Mail size={16} className="text-indigo-400 shrink-0" /><span className="truncate">{user.email}</span></div>
      <div className="flex items-center gap-3"><Phone size={16} className="text-pink-400 shrink-0" /><span className="truncate">{user.phone}</span></div>
    </div>

    {/* FOOTER: Xem thêm */}
    <div className="mt-auto pt-2 flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
      <span className="text-xs font-bold mb-1">Xem chi tiết</span>
      <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
    </div>
  </div>
);

// --- MAIN PAGE ---
const UsersPage = () => {
  const dispatch = useDispatch();
  const { list, status, error, pagination, sorting } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify({
      limit: pagination.limit, sortBy: sorting.sortBy, order: sorting.order
    }));
  }, [pagination.limit, sorting]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, pagination.page, pagination.limit, sorting.sortBy, sorting.order]);

  const handlePageClick = (event) => dispatch(setPage(event.selected + 1));
  const handleDelete = (id) => { if (window.confirm('Xóa vĩnh viễn?')) dispatch(deleteUser(id)); };

  // Mở Modal xem chi tiết (Truyền user vào, mặc định là View Mode)
  const handleViewDetails = (user) => {
    dispatch(setSelectedUser(user));
    setIsModalOpen(true);
  };

  // Mở Modal thêm mới (Truyền null vào, mặc định là Edit Mode)
  const handleAddNew = () => {
    dispatch(setSelectedUser(null));
    setIsModalOpen(true);
  };

  const COLUMNS = 3;
  const chunkedList = useMemo(() => {
    if (!Array.isArray(list)) return [];
    const chunks = [];
    for (let i = 0; i < list.length; i += COLUMNS) chunks.push(list.slice(i, i + COLUMNS));
    return chunks;
  }, [list]);

  const renderRow = (rowItems) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 pb-12 h-full pt-10">
      {rowItems.map(user => (
        <div key={user.id} className="h-full">
          {/* Truyền hàm xem chi tiết */}
          <UserCard user={user} onViewDetails={handleViewDetails} onDelete={handleDelete} />
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${CLAY_BG} font-sans ${CLAY_TEXT} pb-20`}>
      <div className="sticky top-4 z-30 px-4 mb-8">
        <div className={`max-w-7xl mx-auto rounded-[30px] bg-white/80 backdrop-blur-md ${CLAY_FLOAT} px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 border border-white`}>
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-[20px] bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-300 transform -rotate-6`}><User size={28} strokeWidth={3} /></div>
            <div><h1 className="text-3xl font-black tracking-tighter text-slate-800">SKIBIDI<span className="text-indigo-500">TOILET</span></h1></div>
          </div>
          <div className="flex items-center gap-6">
            <SortLimitControls />
            <button onClick={handleAddNew} className={`flex items-center gap-2 px-8 py-3 rounded-lg bg-[hsl(214,97%,59%)] text-white font-bold shadow-lg shadow-[#787e7e] hover:shadow-[#0d4b97] hover:-translate-y-1 transition-all active:scale-95 cursor-pointer`}>
              <Plus size={22} strokeWidth={3} /><span>THÊM MỚI</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Error & Loading (Giữ nguyên logic cũ, chỉ đổi UI nếu cần) */}
        {status === 'failed' && <div className="text-center text-red-500 font-bold mb-4">Lỗi: {error}</div>}

        <div className={`rounded-[50px] bg-[#f0f2f5] ${CLAY_DENT} p-6 min-h-[700px] flex flex-col relative overflow-hidden border border-white/50`}>
          <div className="flex-1 relative">
            {status === 'loading' && (!list || list.length === 0) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 backdrop-blur-sm">

                <svg 
                  viewBox="25 25 50 50" 
                  className="w-[3.25em] origin-center animate-spin" 
                >
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="20" 
                    className="fill-none stroke-[hsl(214,97%,59%)] stroke-2 stroke-round animate-dash" 
                  />
                </svg>
                <p className="mt-4 text-[hsl(214,97%,59%)] font-medium tracking-widest text-sm">LOADING...</p>
              </div>
            ) : (!list || list.length === 0) ? (
              <div className="text-center py-20 font-bold text-slate-300 text-2xl">TRỐNG</div>
            ) : (
              <VirtualList items={chunkedList} itemHeight={520} renderItem={renderRow} containerHeight={680} />
            )}
          </div>
          {/* Pagination (Giữ nguyên code cũ) */}
          <div className="mt-8 flex justify-center cursor-pointer">
            <ReactPaginate
              breakLabel="..." nextLabel={<ChevronDown className="-rotate-90" size={24} />} previousLabel={<ChevronDown className="rotate-90" size={24} />}
              onPageChange={handlePageClick} pageRangeDisplayed={3} marginPagesDisplayed={1} pageCount={pagination.pageCount || 1} forcePage={pagination.page - 1} renderOnZeroPageCount={null}
              containerClassName={`flex items-center gap-3 p-3 rounded-[25px] bg-white ${CLAY_FLOAT}`}
              pageLinkClassName="w-12 h-12 flex items-center justify-center rounded-[16px] bg-slate-50 text-slate-500 font-bold hover:bg-indigo-100 hover:text-indigo-600 transition-all active:scale-95"
              activeLinkClassName="!bg-indigo-500 !text-white shadow-lg shadow-indigo-300 transform scale-110"
              previousLinkClassName="w-12 h-12 flex items-center justify-center rounded-[16px] bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all active:scale-95"
              nextLinkClassName="w-12 h-12 flex items-center justify-center rounded-[16px] bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all active:scale-95"
              breakLinkClassName="text-slate-300 font-black px-2" disabledLinkClassName="opacity-30 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#f0f2f5]/80 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className={`relative bg-white ${CLAY_FLOAT} rounded-[50px] w-full max-w-2xl z-10 overflow-hidden animate-[fadeIn_0.3s_ease-out] p-2`}>
            <div className="rounded-[40px] overflow-hidden bg-white">
              <UsersForm onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;