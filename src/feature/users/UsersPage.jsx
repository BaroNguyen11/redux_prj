import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { fetchUsers, setPage, deleteUser, setSelectedUser } from './userSlice';
import VirtualList from '../../components/VirtualList';
import SortLimitControls from '../../components/SortLimitControls';
import UsersForm from './UserForm';
import { ChevronDown, Plus, User, Trash2 } from "lucide-react";
import UserCard from './UserCard';
import { ToastContainer, toast } from 'react-toastify';
const CLAY_BG = "bg-[#f0f2f5]";
const CLAY_TEXT = "text-slate-700";
const CLAY_FLOAT = "shadow-[inset_0px_-1px_7px_0px_hsl(214,72%,35%)]";
const CLAY_DENT = "shadow-[inset_0px_-1px_7px_0px_hsl(214,72%,35%)]";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { list, status, error, pagination, sorting } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify({
      limit: pagination.limit, sortBy: sorting.sortBy, order: sorting.order
    }));
  }, [pagination.limit, sorting]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, pagination.page, pagination.limit, sorting.sortBy, sorting.order]);


  const handlePageClick = (event) => dispatch(setPage(event.selected + 1));
  const handleViewDetails = (user) => {
    dispatch(setSelectedUser(user));
    setIsModalOpen(true);
  };
  const handleAddNew = () => {
    dispatch(setSelectedUser(null));
    setIsModalOpen(true);
  };
  const COLUMNS = 3;
  const chunkedList = useMemo(() => {
    if (!Array.isArray(list)) return [];
    const chunks = [];
    for (let i = 0; i < list.length; i += COLUMNS) {
      chunks.push(list.slice(i, i + COLUMNS));
    }
    return chunks;
  }, [list]);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setIsModalDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete));
      toast.success('Người dùng đã được xóa thành công!');
      setIsModalDeleteOpen(false);
      setUserToDelete(null);
    }
  };
  const renderRow = (rowItems) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 pb-12 h-full pt-10">
      {rowItems.map(user => (
        <div key={user.id} className="h-full">
          <UserCard user={user} onViewDetails={handleViewDetails} onDelete={handleDeleteClick} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className={`h-screen flex flex-col ${CLAY_BG} font-sans ${CLAY_TEXT} overflow-hidden selection:bg-indigo-200`}>
        <div className="z-30 px-4 py-4 shrink-0">
          <div className={`max-w-7xl mx-auto rounded-[30px] bg-white/80 backdrop-blur-md ${CLAY_FLOAT} px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border border-white`}>
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-[20px] bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-300 transform -rotate-6`}>
                <User size={28} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-800">SKIBIDI<span className="text-[hsl(214,97%,59%)]">TOILET</span></h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <SortLimitControls />
              <button
                onClick={handleAddNew}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl bg-[hsl(214,97%,59%)] text-white font-bold shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)] hover:scale-102 transition-all active:scale-97 cursor-pointer`}
              >
                <Plus size={22} strokeWidth={3} />
                <span>THÊM MỚI</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 px-4 pb-4 w-full max-w-7xl mx-auto flex flex-col">
          {status === 'failed' && (
            <div className="shrink-0 mx-auto max-w-lg rounded-[20px] bg-white shadow-xl p-4 mb-4 text-center text-red-500 border border-red-100 flex items-center justify-center gap-4">
              <span className="font-bold">⚠️ {error}</span>
              <button onClick={() => dispatch(fetchUsers())} className="px-4 py-1 rounded-lg bg-red-100 font-bold hover:bg-red-200">Thử lại</button>
            </div>
          )}
          <div className={`flex-1 flex flex-col min-h-0 rounded-2xl bg-[#f0f2f5] ${CLAY_DENT} p-6 border border-white/50 relative overflow-hidden`}>
            <div className="flex-1 relative min-h-0">
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
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-inner mb-6"><User size={64} /></div>
                  <p className="text-2xl font-black">TRỐNG TRƠN</p>
                </div>
              ) : (
                <VirtualList
                  items={chunkedList}
                  itemHeight={520}
                  renderItem={renderRow}
                  containerHeight="100%"
                />
              )}
            </div>
            <div className="   flex  justify-center cursor-pointer">
              <ReactPaginate
                breakLabel="..." nextLabel={<ChevronDown className="-rotate-90" size={24} />} previousLabel={<ChevronDown className="rotate-90 " size={24} />}
                onPageChange={handlePageClick} pageRangeDisplayed={3} marginPagesDisplayed={1}
                pageCount={pagination.pageCount || 1} forcePage={pagination.page - 1} renderOnZeroPageCount={null}

                containerClassName={`flex items-center gap-3 p-2 rounded-[20px] bg-white ${CLAY_FLOAT} `}
                pageLinkClassName="w-10 h-10 flex items-center justify-center rounded-[12px] bg-slate-50 text-slate-500 font-bold hover:bg-indigo-100 hover:text-indigo-600 transition-all active:scale-95"
                activeLinkClassName="!bg-indigo-500 !text-white shadow-lg shadow-indigo-300 transform scale-105 shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)]"
                previousLinkClassName="w-10 h-10 flex items-center justify-center rounded-[12px] bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all active:scale-95 shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)]"
                nextLinkClassName="w-10 h-10 flex items-center justify-center rounded-[12px] bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all active:scale-95 shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)]"
                breakLinkClassName="text-slate-300 font-black px-2 "
                disabledLinkClassName="opacity-30 cursor-not-allowed hover:scale-100 "
              />
            </div>

          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#f0f2f5]/80 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className={`relative bg-white shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)] rounded-2xl w-full max-w-2xl z-10 overflow-hidden animate-[fadeIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)] p-2`}>
              <div className="rounded-[40px] overflow-hidden bg-white h-full">
                <UsersForm onClose={() => setIsModalOpen(false)} />
              </div>
            </div>
          </div>
        )}
        {/* Modal xác nhận xóa */}
        {isModalDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay tối màu */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalDeleteOpen(false)}
            ></div>

            {/* Nội dung Modal */}
            <div className={`relative bg-white rounded-2xl w-full max-w-sm z-10 overflow-hidden animate-[fadeIn_0.2s_ease-out] p-6 shadow-2xl border border-white/20`}>
              <div className="flex flex-col items-center text-center">
                {/* Icon cảnh báo */}
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Trash2 size={32} />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h3>
                <p className="text-slate-500 mb-6">
                  Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa người dùng này không?
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setIsModalDeleteOpen(false)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95 cursor-pointer"
                  >
                    Xóa ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover limit={3} />
    </>
  );
};

export default UsersPage;