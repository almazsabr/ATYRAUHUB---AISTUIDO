import React from 'react';
import { SPECIALIST_BIO, SPECIALIST_PORTRAIT } from '../data/mockData';
import { Mail, Send, Phone, MapPin, Award, CheckCircle2, Terminal, Cpu } from 'lucide-react';

interface ExperienceBioProps {
  onOpenBooking: () => void;
}

export const ExperienceBio: React.FC<ExperienceBioProps> = ({ onOpenBooking }) => {
  return (
    <section id="experience" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Portrait & Quick Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
              <img
                src={SPECIALIST_PORTRAIT}
                alt={SPECIALIST_BIO.name}
                className="w-full h-96 object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-mono text-amber-400 block mb-0.5">Личный эксперт</span>
                <h3 className="text-xl font-bold text-white">{SPECIALIST_BIO.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{SPECIALIST_BIO.role}</p>
              </div>
            </div>

            {/* Quick Contact Badges */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{SPECIALIST_BIO.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${SPECIALIST_BIO.contacts.email}`} className="hover:text-amber-300 transition-colors">
                  {SPECIALIST_BIO.contacts.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Send className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`https://t.me/${SPECIALIST_BIO.contacts.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:text-sky-300 transition-colors">
                  {SPECIALIST_BIO.contacts.telegram} (Прямой контакт)
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{SPECIALIST_BIO.contacts.phone}</span>
              </div>
            </div>
          </div>

          {/* Experience Narrative & Competencies */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase">
                <span>Профессиональный опыт</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>9+ лет в Data Science & АСУ ТП</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Инженерный мост между передовым ML и реальным производством
              </h2>
            </div>

            <div className="text-sm text-slate-300 space-y-4 leading-relaxed">
              <p>
                Я специализируюсь на внедрении систем машинного обучения в жесткие условия реального промышленного производства: высокие температуры, вибрации, оптические помехи, запыленность и строгие требования к надежности (24/7/365).
              </p>
              <p>
                В отличие от теоретических ML-исследователей, мой подход строится от физики технологического процесса и промышленной автоматизации (АСУ ТП, PLC, SCADA, Modbus, OPC UA). Решение не считается готовым, пока не подтвержден экономический эффект в тоннах сэкономленного сырья и миллионах рублей предотвращенных простоев.
              </p>
            </div>

            {/* Credentials / Milestones */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Ключевые квалификации и опыт:</span>
              </h4>
              <div className="space-y-2">
                {SPECIALIST_BIO.credentials.map((cred, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Highlights 4-box */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Технологический стек:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALIST_BIO.stackHighlights.map((group, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-white block mb-2">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {group.items.map((item, i) => (
                        <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA bar */}
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <span>Обсудить аудит вашей линии</span>
              </button>
              <a
                href="#contact"
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
              >
                Отправить техническое задание
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
