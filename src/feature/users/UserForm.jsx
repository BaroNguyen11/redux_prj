import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser, fetchUsers } from './userSlice';
import { Save, X, User, Briefcase, MapPin, Edit3, Hash, Palette, ChevronDown, AlertCircle, Globe, Search } from "lucide-react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownMenuItem
} from '../../components/ui/dropdown';

// --- STYLE CONSTANTS ---
const SHADOW_INSET_BLUE = "shadow-[inset_0px_-2px_10px_0px_hsl(214,72%,35%)]";
const CLAY_BTN = "hover:scale-[1.02] active:scale-[0.98] transition-all";
const ERROR_TEXT = "text-red-500 text-[10px] font-bold mt-1 ml-2 flex items-center gap-1";

// Base Class cho Input/Select/Color để đồng bộ kích thước
const BASE_INPUT_CLASS = `w-full h-11 px-4 rounded-[12px] text-sm font-medium outline-none transition-all flex items-center`;

const getInputClass = (disabled, error, isInputTag = false) => {
    const stateStyle = disabled
        ? 'bg-transparent border-2 border-slate-100 text-slate-400 cursor-not-allowed'
        : `bg-[#f7f9fc] ${SHADOW_INSET_BLUE} text-slate-700 focus:ring-2 focus:ring-indigo-200`;

    const errorStyle = error ? 'ring-2 ring-red-400 bg-red-50' : '';
    const layout = isInputTag ? "py-2.5" : "";

    return `${BASE_INPUT_CLASS} ${stateStyle} ${errorStyle} ${layout}`;
};

// --- SUB-COMPONENTS ---

// 1. Input thường
const InputGroup = ({ label, name, type = "text", value, onChange, disabled, width = "w-full", placeholder = "", error }) => (
    <div className={width}>
        <label className="block text-[11px] font-black text-slate-400 mb-1.5 uppercase tracking-widest ml-1">
            {label} {error && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type} name={name} value={value || ''}
            onChange={onChange} placeholder={placeholder} disabled={disabled}
            className={getInputClass(disabled, error, true)}
        />
        {error && <p className={ERROR_TEXT}><AlertCircle size={10} /> {error}</p>}
    </div>
);

// 2. Select Dropdown (Có tìm kiếm)
const SelectGroup = ({ label, name, value, onChange, disabled, options, width = "w-full", error, placeholder = "-- Chọn --", searchable = false }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Reset search khi options thay đổi (ví dụ đổi quốc gia thì list tp đổi -> reset search tp)
    useEffect(() => { setSearchTerm(""); }, [options]);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setSearchTerm("");
    };

    // Lọc options
    const filteredOptions = searchable
        ? options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    return (
        <div className={width}>
            <label className="block text-[11px] font-black text-slate-400 mb-1.5 uppercase tracking-widest ml-1">
                {label} {error && <span className="text-red-500">*</span>}
            </label>
            <Dropdown>
                <DropdownTrigger
                    type="button" disabled={disabled}
                    className={`${getInputClass(disabled, error)} justify-between text-left cursor-pointer group`}
                >
                    <span className={`truncate capitalize ${!value ? 'text-slate-400' : ''}`}>{value || placeholder}</span>
                    <ChevronDown size={16} className="text-slate-400 opacity-70 shrink-0 ml-2 group-hover:text-indigo-500 transition-colors" />
                </DropdownTrigger>

                <DropdownContent align="start" className="bg-white rounded-xl border border-slate-100 shadow-xl p-2 w-full min-w-[200px] z-50">
                    {/* Ô tìm kiếm */}
                    {searchable && (
                        <div className="px-2 py-2 mb-1 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-200">
                                <Search size={14} className="text-slate-400" />
                                <input
                                    type="text"
                                    className="bg-transparent outline-none text-xs w-full text-slate-700 placeholder-slate-400"
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <DropdownMenuItem
                                    key={opt} onClick={() => handleSelect(opt)}
                                    className={`cursor-pointer rounded-lg px-3 py-2 font-medium mb-1 last:mb-0 text-sm capitalize ${value === opt ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {opt}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-xs text-slate-400 italic text-center">Không tìm thấy kết quả</div>
                        )}
                    </div>
                </DropdownContent>
            </Dropdown>
            {error && <p className={ERROR_TEXT}><AlertCircle size={10} /> {error}</p>}
        </div>
    );
};

// 3. Color Picker
const ColorPickerGroup = ({ label, name, value, onChange, disabled, width = "w-full" }) => (
    <div className={width}>
        <label className="block text-[11px] font-black text-slate-400 mb-1.5 uppercase tracking-widest ml-1">{label}</label>
        <div className={`${getInputClass(disabled, false)} relative gap-3 cursor-pointer p-2`}>
            <div className="w-7 h-7 rounded-full border-4 border-white shadow-sm shrink-0 transition-colors duration-300" style={{ backgroundColor: value || '#000000' }}></div>
            <div className="flex flex-col justify-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Mã màu</span>
                <span className={`text-xs font-bold ${disabled ? 'text-slate-400' : 'text-slate-700'} uppercase font-mono leading-none`}>{value || '#000000'}</span>
            </div>
            <input type="color" name={name} value={value || '#000000'} onChange={onChange} disabled={disabled} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
            {!disabled && <Palette size={16} className="absolute right-4 text-slate-400 pointer-events-none" />}
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const UsersForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const { selectedUser, status } = useSelector((state) => state.users);
    const isLoading = status === 'loading';
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    // API Location State
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [timezones, setTimezones] = useState(["GMT-12:00", "GMT-05:00", "GMT+00:00", "GMT+07:00", "GMT+08:00", "GMT+09:00"]); // Demo timezone

    // Options tĩnh
    const genreOptions = ["Male", "Female", "Other"];
    const jobTypeOptions = ["Consultant", "Full-time", "Part-time", "Freelance", "Contract", "Director", "Executive"];

    const initialForm = {
        name: '', email: '', phone: '', avatar: '', color: '#6366f1',
        password: '', dob: '', genre: '',
        job: '', company: '', typeofjob: '', jd: '', desc: '',
        country: '', city: '', state: '', street: '', address: '', building: '', zipcode: '', timezone: '',
        music: '', fincode: '', ip: ''
    };

    const [formData, setFormData] = useState(initialForm);

    // 1. API: Lấy danh sách Quốc gia
    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries/iso')
            .then(res => res.json())
            .then(data => !data.error && setCountries(data.data.map(c => c.name)))
            .catch(console.error);
    }, []);

    // 2. API: Lấy Thành phố khi chọn Quốc gia
    useEffect(() => {
        if (!formData.country) {
            setCities([]);
            return;
        }
        setIsLoadingLocation(true);
        fetch('https://countriesnow.space/api/v0.1/countries/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: formData.country })
        })
            .then(res => res.json())
            .then(data => setCities(!data.error ? data.data : []))
            .catch(() => setCities([]))
            .finally(() => setIsLoadingLocation(false));
    }, [formData.country]);

    // 3. Fill Data khi Edit
    useEffect(() => {
        setErrors({});
        if (selectedUser) {
            setFormData({ ...initialForm, ...selectedUser, dob: selectedUser.dob ? selectedUser.dob.split('T')[0] : '' });
            setIsEditing(false);
        } else {
            setFormData(initialForm);
            setIsEditing(true);
        }
    }, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === 'country') return { ...prev, [name]: value, city: '' }; // Reset city
            return { ...prev, [name]: value };
        });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Bắt buộc";
        if (!formData.email.trim()) newErrors.email = "Bắt buộc";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email sai";
        if (!formData.phone.trim()) newErrors.phone = "Bắt buộc";
        if (!formData.country) newErrors.country = "Chọn QG";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const payload = {
                ...formData,
                dob: formData.dob ? new Date(formData.dob).toISOString() : new Date().toISOString()
            };
            if (selectedUser?.id) await dispatch(updateUser({ id: selectedUser.id, data: payload })).unwrap();
            else await dispatch(addUser(payload)).unwrap();
            dispatch(fetchUsers());
            onClose();
        } catch (err) { alert('Lỗi: ' + err.message); }
    };

    return (
        <div className="w-full h-full flex flex-col max-h-[90vh] bg-white font-sans">
            {/* HEADER */}
            <div className="p-6 flex justify-between items-center bg-white z-10 border-b border-dashed border-slate-200">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[18px] ${isEditing ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'} flex items-center justify-center shadow-lg transition-colors`}>
                        {isEditing ? <Edit3 size={20} /> : <User size={20} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {selectedUser ? (isEditing ? 'CHỈNH SỬA' : 'CHI TIẾT') : 'THÊM NHÂN SỰ'}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 tracking-wide">ID: {selectedUser?.id || 'NEW'}</p>
                    </div>
                </div>

                {selectedUser && !isEditing && (
                    <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition-colors mr-2 cursor-pointer">
                        <Edit3 size={16} /> <span>Sửa</span>
                    </button>
                )}
                <button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer">
                    <X size={20} strokeWidth={3} />
                </button>
            </div>

            {/* FORM BODY */}
            <form className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar no-scrollbar">



                {/* SECTION 1: THÔNG TIN CÁ NHÂN */}
                <section>
                    <div className="flex items-center gap-3 mb-5 px-2 mt-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center"><User size={16} strokeWidth={3} /></div>
                        <h3 className="font-black text-sm text-indigo-900 tracking-widest">THÔNG TIN CÁ NHÂN</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Họ Tên" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" error={errors.name} />
                            <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" error={errors.email} />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="SĐT" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" error={errors.phone} />
                            <InputGroup label="Mật khẩu" name="password" type="password" value={formData.password} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <SelectGroup label="Giới tính" name="genre" value={formData.genre} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" options={genreOptions} />
                            <ColorPickerGroup label="Màu đại diện" name="color" value={formData.color} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                        </div>
                        <InputGroup label="Avatar URL" name="avatar" value={formData.avatar} onChange={handleChange} disabled={!isEditing} />
                    </div>
                </section>
                {/* SECTION 2: ĐỊA CHỈ & KHU VỰC */}
                <section>
                    <div className="flex items-center gap-3 mb-5 px-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center"><Globe size={16} strokeWidth={3} /></div>
                        <h3 className="font-black text-sm text-emerald-900 tracking-widest">ĐỊA CHỈ & KHU VỰC</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <SelectGroup
                                label="Quốc gia" name="country" value={formData.country}
                                onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3"
                                options={countries} placeholder="Chọn Quốc gia" error={errors.country}
                                searchable={true} // ✅ Bật tìm kiếm
                            />
                            <SelectGroup
                                label={isLoadingLocation ? "Đang tải..." : "Tỉnh / Thành phố"} name="city" value={formData.city}
                                onChange={handleChange} disabled={!isEditing || !formData.country} width="w-full md:w-1/3"
                                options={cities} placeholder={formData.country ? "Chọn Thành phố" : "Chọn QG trước"}
                                searchable={true} // ✅ Bật tìm kiếm
                            />
                            <InputGroup label="Mã bưu điện" name="zipcode" value={formData.zipcode} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Bang / Vùng" name="state" value={formData.state} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                            <SelectGroup label="Múi giờ" name="timezone" value={formData.timezone} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" options={timezones} placeholder="Chọn Múi giờ" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Số nhà / Tòa nhà" name="building" value={formData.building} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Tên đường" name="street" value={formData.street} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Địa chỉ cụ thể" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                        </div>
                    </div>
                </section>
                {/* SECTION 3: CÔNG VIỆC & KHÁC */}
                <section>
                    <div className="flex items-center gap-3 mb-5 px-2 mt-2">
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center"><Briefcase size={16} strokeWidth={3} /></div>
                        <h3 className="font-black text-sm text-pink-900 tracking-widest">CÔNG VIỆC & KHÁC</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-5">
                            <InputGroup label="Công ty" name="company" value={formData.company} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                            <InputGroup label="Chức vụ" name="job" value={formData.job} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <SelectGroup label="Loại công việc" name="typeofjob" value={formData.typeofjob} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" options={jobTypeOptions} />
                            <InputGroup label="Mã JD" name="jd" value={formData.jd} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/2" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5 mt-2">
                            <InputGroup label="Fincode" name="fincode" value={formData.fincode} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="Sở thích âm nhạc" name="music" value={formData.music} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" />
                            <InputGroup label="IP Address" name="ip" value={formData.ip} onChange={handleChange} disabled={!isEditing} width="w-full md:w-1/3" placeholder="Tự động" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-[11px] font-black text-slate-400 mb-1.5 uppercase tracking-widest ml-1">Mô tả chi tiết</label>
                            <textarea
                                name="desc" value={formData.desc || ''} onChange={handleChange} rows="3" disabled={!isEditing}
                                className={`${getInputClass(!isEditing, false)} h-auto min-h-[80px] resize-none py-4`}
                            ></textarea>
                        </div>
                    </div>
                </section>
            </form>

            {/* FOOTER */}
            {isEditing && (
                <div className="px-6 py-4 flex justify-end gap-4 bg-white border-t border-dashed border-slate-200 z-10 animate-[fadeIn_0.2s_ease-out]">
                    <button type="button" onClick={() => selectedUser ? setIsEditing(false) : onClose()} className={`px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 cursor-pointer ${SHADOW_INSET_BLUE} hover:shadow-none border border-slate-200 transition-all`}>Hủy</button>
                    <button onClick={handleSubmit} disabled={isLoading} className={`flex items-center gap-3 px-6 py-3 rounded-xl bg-[#3189fb] text-white font-black ${SHADOW_INSET_BLUE} ${CLAY_BTN} disabled:opacity-50 cursor-pointer`}>
                        {isLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Save size={20} strokeWidth={3} />}
                        <span>LƯU LẠI</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsersForm;