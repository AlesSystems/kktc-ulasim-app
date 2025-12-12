'use client';

import { useState } from 'react';
import { submitReport } from '@/src/lib/supabaseClient';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  routeInfo: string;
}

export default function ReportModal({ isOpen, onClose, scheduleId, routeInfo }: ReportModalProps) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const issueTypes = [
    { value: 'bus_not_arrived', label: 'Otobüs Gelmedi' },
    { value: 'wrong_time', label: 'Saat Yanlış' },
    { value: 'delay', label: 'Gecikme Var' },
    { value: 'other', label: 'Diğer' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueType) {
      alert('Lütfen bir sorun türü seçin');
      return;
    }

    setIsSubmitting(true);
    
    const success = await submitReport(scheduleId, issueType, description);
    
    setIsSubmitting(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIssueType('');
        setDescription('');
        onClose();
      }, 2000);
    } else {
      alert('Bildirim gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-zinc-200/50 dark:border-zinc-700/50 transform transition-all scale-100">
        {showSuccess ? (
          <div className="p-10 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Teşekkürler!
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Bildiriminiz başarıyla alındı.
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Sorun Bildir
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 pl-1">
                {routeInfo}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider">
                  Sorun Türü
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issueTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        issueType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issueType"
                        value={type.value}
                        checked={issueType === type.value}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        issueType === type.value ? 'border-blue-600' : 'border-zinc-400'
                      }`}>
                        {issueType === type.value && (
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        issueType === type.value ? 'text-blue-900 dark:text-blue-100' : 'text-zinc-700 dark:text-zinc-300'
                      }`}>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                  Açıklama (İsteğe Bağlı)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all resize-none"
                  placeholder="Detaylı bilgi verin..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 disabled:from-zinc-400 disabled:to-zinc-500 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95 font-semibold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    'Raporla'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
