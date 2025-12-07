import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLimit, setSorting, fetchUsers } from '../feature/users/userSlice';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownMenuItem
} from './ui/dropdown';
import { ChevronDown, ListFilter, ArrowUpDown, Layers } from "lucide-react";

const SortLimitControls = () => {
  const dispatch = useDispatch();
  const { pagination, sorting } = useSelector(state => state.users);

  const handleLimitChange = (val) => {
    dispatch(setLimit(val));
    dispatch(fetchUsers());
  };

  const handleSortChange = (val) => {
    dispatch(setSorting({ ...sorting, sortBy: val }));
    dispatch(fetchUsers());
  };

  const handleOrderChange = (val) => {
    dispatch(setSorting({ ...sorting, order: val }));
    dispatch(fetchUsers());
  };


  const sortLabels = {
    createdAt: "Ngày tạo",
    name: "Tên",
    email: "Email"
  };

  const orderLabels = {
    asc: "Tăng dần (A-Z)",
    desc: "Giảm dần (Z-A)"
  };

  const triggerClass = "flex items-center gap-2 px-3 rounded-xl bg-white border border-slate-100 text-slate-600 font-bold shadow-[inset_0px_-1px_7px_0px_hsl(214,72%,35%)] hover:text-indigo-600 hover:shadow-[inset_2px_2px_5px_#d1d5db,inset_-2px_-2px_5px_#ffffff] transition-all active:scale-95 outline-none min-w-[150px] justify-between cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-4">

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 hidden sm:inline-block">HIỂN THỊ:</span>
        <Dropdown>
          <DropdownTrigger className={triggerClass}>
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-indigo-400" />
              <span>{pagination.limit} user</span>
            </div>
            <ChevronDown size={14} className="opacity-50" />
          </DropdownTrigger>

          <DropdownContent className="bg-white rounded-xl border border-slate-100 shadow-xl p-2 min-w-[140px] ">
            {[10, 20, 50, 100].map((n) => (
              <DropdownMenuItem
                key={n}
                onClick={() => handleLimitChange(n)}
                className={`cursor-pointer rounded-lg font-medium ${pagination.limit === n ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
              >
                {n} user
              </DropdownMenuItem>
            ))}
          </DropdownContent>
        </Dropdown>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-slate-300 mx-2 hidden md:block shadow-sm"></div>

      {/* 2. CHỌN SẮP XẾP (SORT BY) */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 hidden sm:inline-block">SẮP XẾP:</span>

        {/* Dropdown Trường Sắp Xếp */}
        <Dropdown>
          <DropdownTrigger className={triggerClass}>
            <div className="flex items-center gap-2">
              <ListFilter size={16} className="text-pink-400" />
              <span>{sortLabels[sorting.sortBy] || 'Ngày tạo'}</span>
            </div>
            <ChevronDown size={14} className="opacity-50" />
          </DropdownTrigger>
          <DropdownContent className="bg-white rounded-xl border border-slate-100 shadow-xl p-2 min-w-[140px]">
            <DropdownMenuItem onClick={() => handleSortChange('createdAt')} className="cursor-pointer rounded-lg font-medium">Ngày tạo</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('name')} className="cursor-pointer rounded-lg font-medium">Tên</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('email')} className="cursor-pointer rounded-lg font-medium">Email</DropdownMenuItem>
          </DropdownContent>
        </Dropdown>

        {/* Dropdown Thứ Tự (ASC/DESC) */}
        <Dropdown>
          <DropdownTrigger className={`${triggerClass} min-w-40`}>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-emerald-400" />
              <span>{orderLabels[sorting.order]}</span>
            </div>
            <ChevronDown size={14} className="opacity-50" />
          </DropdownTrigger>
          <DropdownContent className="bg-white rounded-xl border border-slate-100 shadow-xl p-2 min-w-40">
            <DropdownMenuItem onClick={() => handleOrderChange('asc')} className="cursor-pointer rounded-lg font-medium">Tăng dần</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOrderChange('desc')} className="cursor-pointer rounded-lg font-medium">Giảm dần</DropdownMenuItem>

          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
};

export default SortLimitControls;