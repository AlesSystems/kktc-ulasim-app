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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-700">
        {showSuccess ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Teşekkürler!
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Bildiriminiz alındı
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Bu Seferle İlgili Sorun Ne?
                </h2>
                <button
                  onClick={onClose}
                  className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                {routeInfo}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Sorun Türü
                </label>
                <div className="space-y-2">
                  {issueTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="issueType"
                        value={type.value}
                        checked={issueType === type.value}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-zinc-900 dark:text-zinc-100">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Açıklama (İsteğe Bağlı)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                  placeholder="İlave bilgi ekleyin..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
