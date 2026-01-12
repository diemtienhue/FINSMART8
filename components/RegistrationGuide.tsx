import React, { useState } from 'react';
import { Project } from '../types';
import { ChevronDown, ChevronRight, BookOpen, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';

interface RegistrationGuideProps {
    projects: Project[];
}

const RegistrationGuide: React.FC<RegistrationGuideProps> = ({ projects }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Lấy 10 project đầu tiên để làm guides
    const guideProjects = projects.slice(0, 10);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="max-w-5xl mx-auto px-3 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-200">
                    <FileText size={36} strokeWidth={2.5} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Hướng dẫn đăng ký</h2>
                <p className="text-slate-600 font-medium max-w-2xl mx-auto text-sm leading-relaxed">
                    Hướng dẫn chi tiết từng bước để đăng ký các sản phẩm vay và thẻ tín dụng.<br />
                    Chọn sản phẩm bạn quan tâm để xem hành trình đăng ký cụ thể.
                </p>
            </div>

            {/* Guide Cards */}
            <div className="space-y-3">
                {guideProjects.map((project) => {
                    const isExpanded = expandedId === project.id;

                    return (
                        <div
                            key={project.id}
                            className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-lg hover:border-blue-200"
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleExpand(project.id)}
                                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-black text-slate-800">Hướng dẫn {project.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1">
                                            {project.type === 'LOAN' ? 'Vay tiêu dùng' : 'Thẻ tín dụng'} • {project.steps.length} bước
                                        </p>
                                    </div>
                                </div>
                                <div className={`p-2 bg-slate-100 rounded-full transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                    {isExpanded ? <ChevronDown size={20} className="text-blue-600" /> : <ChevronRight size={20} className="text-slate-400" />}
                                </div>
                            </button>

                            {/* Accordion Content */}
                            {isExpanded && (
                                <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                                    {/* Product Info */}
                                    <div className="bg-blue-50 p-5 rounded-2xl mb-6 border border-blue-100">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-blue-500 font-black mb-1">Hạn mức</p>
                                                <p className="text-sm font-black text-blue-900">{project.limit}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-blue-500 font-black mb-1">Lãi suất</p>
                                                <p className="text-sm font-black text-blue-900">{project.interestRate}</p>
                                            </div>
                                        </div>
                                        {project.referralCode && (
                                            <div className="bg-white/70 p-3 rounded-xl border border-blue-200">
                                                <p className="text-[10px] uppercase tracking-wider text-blue-500 font-black mb-1">Mã giới thiệu</p>
                                                <p className="text-sm font-black text-blue-900">{project.referralCode}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Registration Steps */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BookOpen size={18} className="text-emerald-600" />
                                            <h4 className="text-sm font-black text-slate-800 uppercase">Hành trình đăng ký</h4>
                                        </div>

                                        <div className="space-y-4">
                                            {project.steps.map((step, idx) => (
                                                <div key={idx} className="flex gap-4">
                                                    <div className="shrink-0">
                                                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">
                                                            {idx + 1}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-black text-slate-800 mb-1">{step.title}</h5>
                                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{step.description}</p>
                                                        {step.image && (
                                                            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                                                                <img src={step.image} alt={step.title} className="w-full h-32 object-cover" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Eligibility */}
                                    {project.eligibility && project.eligibility.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <CheckCircle2 size={18} className="text-blue-600" />
                                                <h4 className="text-sm font-black text-slate-800 uppercase">Điều kiện đăng ký</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {project.eligibility.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    <a
                                        href={project.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100 uppercase"
                                    >
                                        Đăng ký ngay {project.name}
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="mt-12 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl border border-slate-200">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800 mb-2">Lưu ý quan trọng</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            Tất cả hướng dẫn được cập nhật theo quy trình mới nhất từ các đơn vị phát hành.
                            Nếu gặp khó khăn trong quá trình đăng ký, vui lòng liên hệ bộ phận hỗ trợ của Finsmart
                            để được tư vấn chi tiết.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationGuide;
