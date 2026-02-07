
import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="py-32 px-6 text-center bg-white border-t border-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Stay Informed</h2>
        <p className="text-gray-500 font-medium text-lg mb-12 leading-relaxed">
          Join 50,000+ travel enthusiasts. Receive the world's most beautiful destinations and exclusive guides in your inbox every Sunday.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 mb-10 max-w-xl mx-auto" onSubmit={e => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Email address"
            className="flex-1 px-8 py-4 rounded-[12px] bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:outline-none transition-all placeholder-gray-400 font-medium"
          />
          <button className="bg-[#0a1128] text-white px-10 py-4 rounded-[12px] font-bold hover:bg-black transition-all shadow-xl">
            Subscribe
          </button>
        </form>

        <div className="text-[10px] font-extrabold text-gray-300 tracking-[0.6em] uppercase">
          END-TO-END INSPIRATION
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
