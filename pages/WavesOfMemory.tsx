
import React from 'react';
import { TIMELINE_DATA } from '../constants';

const WavesOfMemory: React.FC = () => {
  return (
    <div className="min-h-screen bg-sky-50 p-6 pt-[118px] pb-40 md:p-12 md:pt-[150px] md:pb-32">
      <div className="max-w-4xl mx-auto">
        <header className="mb-[90px] text-center">
          <h1 className="text-3xl md:text-5xl text-sky-800 mb-4 font-jua">파도의 기억</h1>
          <p className="text-sky-600">출렁이는 바다 물결처럼 흐르는 부산의 역사를 따라가보세요.</p>
        </header>

        <div className="relative border-l-4 border-sky-200 ml-4 md:ml-0 md:flex md:flex-col md:items-center md:border-l-0">
          {TIMELINE_DATA.map((event, index) => (
            <div 
              key={index} 
              className={`mb-16 relative w-full md:w-1/2 ${
                index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'
              }`}
            >
              {/* Dot */}
              <div className="absolute top-0 -left-6 md:left-auto md:right-auto w-8 h-8 bg-sky-400 rounded-full border-4 border-white shadow-md z-10 
                md:left-1/2 md:-translate-x-1/2"></div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-sky-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-bold mb-4">
                  {event.year}
                </span>
                <h3 className="text-2xl font-jua text-slate-800 mb-4">{event.title}</h3>
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-48 object-cover rounded-2xl mb-5 shadow-inner"
                />
                <p className="text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* Timeline Connector for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-sky-200 -translate-x-1/2 -z-0"></div>
        </div>
      </div>
    </div>
  );
};

export default WavesOfMemory;
