import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLimit, setSorting, fetchUsers } from '../feature/users/userSlice';

const SortLimitControls = () => {
  const dispatch = useDispatch();
  const { pagination, sorting } = useSelector(state => state.users);

  const handleLimitChange = (e) => {
    dispatch(setLimit(Number(e.target.value)));
    dispatch(fetchUsers());
  };

  const handleSortChange = (e) => {
    dispatch(setSorting({ ...sorting, sortBy: e.target.value }));
    dispatch(fetchUsers());
  };

  const handleOrderChange = (e) => {
    dispatch(setSorting({ ...sorting, order: e.target.value }));
    dispatch(fetchUsers());
  };

  // Class chung cho các thẻ select để tái sử dụng
  const selectClass = "bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none shadow-sm hover:border-indigo-400 transition-colors cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Chọn số lượng */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hiển thị:</label>
        <select value={pagination.limit} onChange={handleLimitChange} className={selectClass}>
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} dòng</option>)}
        </select>
      </div>

      <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>

      {/* Chọn sắp xếp */}
      <div className="flex items-center gap-2">
         <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sắp xếp:</label>
         <div className="flex gap-2">
            <select value={sorting.sortBy} onChange={handleSortChange} className={selectClass}>
                <option value="createdAt">Ngày tạo</option>
                <option value="name">Tên</option>
                <option value="email">Email</option>
            </select>

            <select value={sorting.order} onChange={handleOrderChange} className={selectClass}>
                <option value="desc">Mới nhất / Z-A</option>
                <option value="asc">Cũ nhất / A-Z</option>
            </select>
         </div>
      </div>
    </div>
  );
};
export default SortLimitControls;