import React from 'react';
import { Project } from '../types';
import { Handshake } from 'lucide-react';

interface PartnerSliderProps {
    projects: Project[];
}

const PartnerSlider: React.FC<PartnerSliderProps> = ({ projects }) => {
    // Lấy logos từ 10 dự án
    const logos = projects.slice(0, 10).map(p => p.logo);

    return (
        <div className="py-16 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Handshake size={24} className="text-blue-600" />
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                            Các đối tác AFF của chúng tôi
                        </h3>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Hợp tác cùng các tổ chức tài chính uy tín hàng đầu Việt Nam
                    </p>
                </div>

                {/* Slider Track */}
                <div className="relative">
                    {/* Gradient overlays for fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                    {/* Scrolling container */}
                    <div className="slider-container overflow-hidden">
                        <div className="slider-track flex gap-12 items-center">
                            {/* Duplicate logos for seamless loop */}
                            {logos.concat(logos).map((logo, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0 w-32 h-20 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-center hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={logo}
                                        alt={`partner-${idx}`}
                                        className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .slider-track {
          animation: scroll 30s linear infinite;
          width: fit-content;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .slider-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .slider-track {
            animation-duration: 20s;
          }
        }
      `}</style>
        </div>
    );
};

export default PartnerSlider;
