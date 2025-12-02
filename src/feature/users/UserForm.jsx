
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser, fetchUsers } from './userSlice';
import { Save, X, User, Briefcase, MapPin, Edit3, Hash, Palette } from "lucide-react";

// --- STYLE CONSTANTS ---
const CLAY_IN_SHADOW = "shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]";
const CLAY_BTN = "shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] hover:scale-[1.02] active:scale-[0.98] transition-all";

// --- SUB-COMPONENTS ---

// 1. Input thường
const InputGroup = ({ label, name, type = "text", value, onChange, disabled, width = "w-full", placeholder = "" }) => (
    <div className={width}>
        <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-3">{label}</label>
        <input
            type={type} name={name} value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-5 py-4 rounded-[20px] 
                ${disabled ? 'bg-transparent border-2 border-slate-100 text-slate-500 cursor-not-allowed' : `bg-[#f7f9fc] ${CLAY_IN_SHADOW} text-slate-700`} 
                font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-200`}
        />
    </div>
);

// 2. Select Dropdown
const SelectGroup = ({ label, name, value, onChange, disabled, options, width = "w-full" }) => (
    <div className={width}>
        <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-3">{label}</label>
        <div className="relative">
            <select
                name={name} value={value || ''} onChange={onChange} disabled={disabled}
                className={`w-full px-5 py-4 rounded-[20px] appearance-none
                    ${disabled ? 'bg-transparent border-2 border-slate-100 text-slate-500 cursor-not-allowed' : `bg-[#f7f9fc] ${CLAY_IN_SHADOW} text-slate-700`} 
                    font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-200`}
            >
                <option value="">-- Chọn --</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
        </div>
    </div>
);

// 3. 👇 COLOR PICKER XỊN (Mới làm lại) 👇
const ColorPickerGroup = ({ label, name, value, onChange, disabled, width = "w-full" }) => (
    <div className={width}>
        <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-3">{label}</label>

        {/* Container mô phỏng Input */}
        <div className={`relative w-full px-2 py-2 rounded-[20px] flex items-center gap-3
            ${disabled ? 'bg-transparent border-2 border-slate-100 cursor-not-allowed' : `bg-[#f7f9fc] ${CLAY_IN_SHADOW} cursor-pointer hover:ring-2 hover:ring-indigo-100`} 
            transition-all`}
        >
            {/* Vòng tròn hiển thị màu */}
            <div
                className="w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 transition-colors duration-300"
                style={{ backgroundColor: value || '#000000' }}
            ></div>

            {/* Mã màu Hex */}
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mã màu</span>
                <span className={`text-sm font-bold ${disabled ? 'text-slate-400' : 'text-slate-700'} uppercase font-mono`}>
                    {value || '#000000'}
                </span>
            </div>

            {/* Input thật (bị ẩn đi nhưng phủ lên toàn bộ để bấm vào đâu cũng mở bảng màu) */}
            <input
                type="color"
                name={name}
                value={value || '#000000'}
                onChange={onChange}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />

            {/* Icon trang trí */}
            {!disabled && <Palette size={18} className="absolute right-5 text-slate-400 pointer-events-none" />}
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const UsersForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const { selectedUser, status } = useSelector((state) => state.users);
    const isLoading = status === 'loading';
    const [isEditing, setIsEditing] = useState(false);

    const genreOptions = ["male", "female", "other"];
    const jobTypeOptions = ["Consultant", "Full-time", "Part-time", "Freelance", "Contract"];

    const initialForm = {
        name: '', email: '', phone: '', avatar: '', color: '#6366f1',
        password: '', dob: '', genre: '',
        job: '', company: '', typeofjob: '', jd: '', desc: '',
        country: '', city: '', state: '', street: '', address: '', building: '', zipcode: '', timezone: '',
        music: '', fincode: '', ip: ''
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                ...initialForm,
                ...selectedUser,
                dob: selectedUser.dob ? selectedUser.dob.split('T')[0] : ''
            });
            setIsEditing(false);
        } else {
            setFormData(initialForm);
            setIsEditing(true);
        }
    }, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                dob: formData.dob ? new Date(formData.dob).toISOString() : new Date().toISOString()
            };

            if (selectedUser?.id) {
                await dispatch(updateUser({ id: selectedUser.id, data: payload })).unwrap();
            } else {
                await dispatch(addUser(payload)).unwrap();
            }
            dispatch(fetchUsers());
            onClose();
        } catch (err) { alert('Lỗi: ' + err.message); }
    };

    return (
        <div className="w-full h-full flex flex-col max-h-[90vh] bg-white font-sans">
            {/* HEADER */}
            <div className="p-8 flex justify-between items-center bg-white z-10 border-b border-dashed border-slate-200">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[18px] ${isEditing ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'} flex items-center justify-center shadow-lg transition-colors`}>
                        {isEditing ? <Edit3 size={20} /> : <User size={20} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {selectedUser ? (isEditing ? 'CHỈNH SỬA' : 'CHI TIẾT HỒ SƠ') : 'THÊM NHÂN SỰ'}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 tracking-wide">
                            ID: {selectedUser?.id || 'NEW'}
                        </p>
                    </div>
                </div>

                {selectedUser && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 rounded-[15px] bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition-colors mr-2 cursor-pointer">
                        <Edit3 size={16} /> <span>Sửa</span>
                    </button>
                )}

                <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer">
                    <X size={20} strokeWidth={3} />
                </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

                {/* 1. THÔNG TIN CÁ NHÂN */}
                <section>
                    <div className="flex items-center gap-3 mb-5 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center"><User size={16} strokeWidth={3} /></div>
                        <h3 className="font-black text-sm text-indigo-900 tracking-widest">THÔNG TIN CÁ NHÂN</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Họ Tên" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                            <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="SĐT" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                            <InputGroup label="Mật khẩu" name="password" type="password" value={formData.password} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />

                            <SelectGroup
                                label="Giới tính (Genre)" name="genre" value={formData.genre}
                                onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3"
                                options={genreOptions}
                            />

                            {/* 👇 DÙNG COMPONENT MÀU SẮC MỚI Ở ĐÂY 👇 */}
                            <ColorPickerGroup
                                label="Màu đại diện"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                disabled={!isEditing}
                                width="w-full md:w-1/3"
                            />
                        </div>
                        <InputGroup label="Avatar URL" name="avatar" value={formData.avatar} onChange={handleChange} disabled={!isEditing} />
                    </div>
                </section>

                {/* 2. CÔNG VIỆC */}
                <section>
                    <div className="flex items-center gap-3 mb-5 px-2 mt-2">
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center"><Briefcase size={16} strokeWidth={3} /></div>
                        <h3 className="font-black text-sm text-pink-900 tracking-widest">CÔNG VIỆC</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Công ty" name="company" value={formData.company} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                            <InputGroup label="Chức vụ" name="job" value={formData.job} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <SelectGroup
                                label="Loại công việc" name="typeofjob" value={formData.typeofjob}
                                onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2"
                                options={jobTypeOptions}
                            />
                            <InputGroup label="Mã JD" name="jd" value={formData.jd} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest ml-3">Mô tả chi tiết (Desc)</label>
                            <textarea
                                name="desc" value={formData.desc || ''} onChange={handleChange} rows="3"
                                disabled={!isEditing}
                                className={`w-full px-5 py-4 rounded-[20px] 
                                    ${!isEditing ? 'bg-transparent border-2 border-slate-100 text-slate-500' : `bg-[#f7f9fc] ${CLAY_IN_SHADOW} text-slate-700`} 
                                    font-medium outline-none resize-none transition-all disabled:cursor-not-allowed`}
                            ></textarea>
                        </div>
                    </div>
                </section>

                {/* 3. ĐỊA CHỈ & VỊ TRÍ */}
                <section>
                    <div className="flex items-center gap-3 mb-5 px-2 mt-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center"><MapPin size={16} strokeWidth={3} /></div>
                        <h3 className="font-black text-sm text-emerald-900 tracking-widest">ĐỊA CHỈ & VỊ TRÍ</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Tòa nhà" name="building" value={formData.building} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Đường" name="street" value={formData.street} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Thành phố" name="city" value={formData.city} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Bang/Tỉnh" name="state" value={formData.state} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Quốc gia" name="country" value={formData.country} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                            <InputGroup label="Múi giờ" name="timezone" value={formData.timezone} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                    </div>
                </section>

                {/* 4. THÔNG TIN KHÁC */}
                <section>
                    <div className="flex items-center gap-3 mb-5 px-2 mt-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center"><Hash size={16} strokeWidth={3} /></div>
                        <h3 className="font-black text-sm text-orange-900 tracking-widest">THÔNG TIN KHÁC</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Fincode" name="fincode" value={formData.fincode} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Sở thích âm nhạc" name="music" value={formData.music} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="IP Address" name="ip" value={formData.ip} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" placeholder="Tự động" />
                        </div>
                    </div>
                </section>
            </form>

            {/* FOOTER */}
            {isEditing && (
                <div className="p-6 flex justify-end gap-4 bg-white border-t border-dashed border-slate-200 z-10 animate-[fadeIn_0.2s_ease-out]">
                    <button
                        type="button"
                        onClick={() => selectedUser ? setIsEditing(false) : onClose()}
                        className="px-8 py-4 rounded-[20px] font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`flex items-center gap-3 px-10 py-4 rounded-[20px] bg-indigo-500 text-white font-black shadow-lg shadow-indigo-300 ${CLAY_BTN} disabled:opacity-50 cursor-pointer`}
                    >
                        {isLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Save size={20} strokeWidth={3} />}
                        <span>LƯU LẠI</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsersForm;