
import React from 'react';
import { Globe, Heart, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0d93f2] mb-6 block">Our Manifesto</span>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tightest max-w-5xl leading-[0.9]">
            Redefining the <br /> 
            <span className="text-[#0d93f2] italic font-serif lowercase">Editorial Voyage.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center">
          <div className="space-y-8">
            <p className="text-2xl md:text-3xl text-gray-900 font-serif italic leading-relaxed">
              "We believe travel is not about checking boxes, but about uncovering the soul of a place through raw, unfiltered perspectives."
            </p>
            <p className="text-gray-500 text-lg leading-relaxed">
              The Travel Guru was born from a desire to escape the generic travel guides of the past. We curate experiences that prioritize depth over speed, and authenticity over aesthetics (though we do appreciate beauty). Our team of nomads, photographers, and writers venture to the edges of the map to bring you stories that matter.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
              <div>
                <div className="text-4xl font-black text-gray-900 mb-2">120+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regions Explored</div>
              </div>
              <div>
                <div className="text-4xl font-black text-gray-900 mb-2">50k+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Nomads</div>
              </div>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
            <img 
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1000" 
              alt="Adventurer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-32">
          <h2 className="text-4xl font-black tracking-tighter mb-16 text-center">Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: 'Authenticity', desc: 'We only share stories from firsthand experiences. No fluff, just the real deal.' },
              { icon: Heart, title: 'Sustainability', desc: 'Promoting slow travel and supporting local communities wherever we go.' },
              { icon: Award, title: 'Excellence', desc: 'High-end editorial quality in every photo, word, and recommendation.' }
            ].map((pillar, i) => (
              <div key={i} className="bg-white p-12 rounded-[2.5rem] border border-gray-50 shadow-sm text-center flex flex-col items-center">
                <div className="size-16 rounded-2xl bg-[#0d93f2]/5 flex items-center justify-center text-[#0d93f2] mb-8">
                  <pillar.icon className="size-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">{pillar.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-16">The Architects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Elena Rossi', role: 'Editor in Chief', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
              { name: 'Marcus Thorne', role: 'Lead Photographer', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
              { name: 'Sofia Chen', role: 'Cultural Advisor', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400' },
              { name: 'Julian Vance', role: 'Field Researcher', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' }
            ].map((member, i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                  <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                </div>
                <h4 className="text-xl font-black mb-1">{member.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0d93f2]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
