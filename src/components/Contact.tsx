
import React, { useState } from 'react';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import { sanitizeInput } from '../utils/security.ts';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = {
      name: sanitizeInput(formData.name, 100),
      email: sanitizeInput(formData.email, 255),
      subject: sanitizeInput(formData.subject, 100),
      message: sanitizeInput(formData.message, 2000)
    };
    console.log('Contact form submission:', cleanData);
    // In a real app, send to API
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {submitted && (
          <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl animate-in slide-in-from-top duration-500">
            ✅ Message sent securely!
          </div>
        )}
        <div className="mb-24 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0d93f2] mb-6 block">Get in Touch</span>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tightest leading-[0.9]">
            Let’s start a <br /> 
            <span className="text-[#0d93f2] italic font-serif lowercase">Conversation.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 space-y-12">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Editorial Inquiries</h3>
                <div className="flex items-center gap-4 text-xl font-bold text-gray-900">
                  <Mail className="size-5 text-[#0d93f2]" />
                  editor@thetravelguru.com
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Partnerships</h3>
                <div className="flex items-center gap-4 text-xl font-bold text-gray-900">
                  <Mail className="size-5 text-[#0d93f2]" />
                  partners@thetravelguru.com
                </div>
              </div>
              <div className="pt-8 border-t border-gray-50 flex items-start gap-4">
                <MapPin className="size-6 text-[#0d93f2] shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Milan Studio</h4>
                  <p className="text-gray-400 text-sm mt-1">Via della Spiga, 22<br />20121 Milan, Italy</p>
                </div>
              </div>
            </div>

            <div className="px-12 py-8 bg-[#0a1128] rounded-[2rem] text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Phone className="size-5 text-[#0d93f2]" />
                <span className="font-bold">+39 02 123 4567</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Mon — Fri</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form className="bg-white p-12 md:p-16 rounded-[3rem] border border-gray-100 shadow-xl space-y-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 outline-none transition-all font-bold" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 outline-none transition-all font-bold" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Subject</label>
                <select 
                  className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 outline-none transition-all font-bold appearance-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option>General Inquiry</option>
                  <option>Press & Media</option>
                  <option>Business Partnership</option>
                  <option>Contribute</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Message</label>
                <textarea 
                  className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 outline-none transition-all font-bold h-48 resize-none" 
                  placeholder="Tell us about your next project..." 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button className="w-full bg-[#0d93f2] text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30">
                Send Message
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
