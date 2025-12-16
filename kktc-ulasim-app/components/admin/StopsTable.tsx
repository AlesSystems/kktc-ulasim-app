'use client';

import { useState } from 'react';
import { Edit, Trash2, MapPin, Plus, X } from 'lucide-react';
import type { Stop } from '@/types';

interface StopsTableProps {
  initialStops: Stop[];
}

export default function StopsTable({ initialStops }: StopsTableProps) {
  const [stops, setStops] = useState(initialStops);
  const [loading, setLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });

  const resetForm = () => {
    setFormData({ name: '', latitude: '', longitude: '' });
    setEditingStop(null);
    setShowModal(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (stop: Stop) => {
    setEditingStop(stop);
    setFormData({
      name: stop.name,
      latitude: stop.latitude?.toString() || '',
      longitude: stop.longitude?.toString() || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('submit');

    try {
      const url = editingStop
        ? '/api/admin/stops/update'
        : '/api/admin/stops/create';

      const body = editingStop
        ? {
            stopId: editingStop.id,
            name: formData.name,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude
              ? parseFloat(formData.longitude)
              : null,
          }
        : {
            name: formData.name,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude
              ? parseFloat(formData.longitude)
              : null,
          };

      const response = await fetch(url, {
        method: editingStop ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        if (editingStop) {
          setStops(
            stops.map((s) =>
              s.id === editingStop.id
                ? {
                    ...s,
                    name: formData.name,
                    latitude: formData.latitude
                      ? parseFloat(formData.latitude)
                      : undefined,
                    longitude: formData.longitude
                      ? parseFloat(formData.longitude)
                      : undefined,
                  }
                : s
            )
          );
        } else {
          setStops([...stops, result.stop]);
        }
        resetForm();
      } else {
        alert('İşlem başarısız');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (stopId: string) => {
    if (!confirm('Bu durağı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(stopId);

    try {
      const response = await fetch('/api/admin/stops/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stopId }),
      });

      if (response.ok) {
        setStops(stops.filter((s) => s.id !== stopId));
      } else {
        alert('Silme başarısız');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Durak Ekle
          </button>
        </div>

        {stops.length === 0 ? (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-16 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Kayıtlı durak bulunamadı.
            </p>
          </div>
        ) : (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200/50 dark:border-gray-700/50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Durak Adı
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Enlem
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Boylam
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {stops.map((stop) => (
                    <tr
                      key={stop.id}
                      className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <td className="px-8 py-5 text-sm text-gray-900 dark:text-gray-300">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium">{stop.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-mono">
                        {stop.latitude?.toFixed(6) || '-'}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-mono">
                        {stop.longitude?.toFixed(6) || '-'}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(stop)}
                          disabled={loading !== null}
                          className="inline-flex items-center px-4 py-2 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
                        >
                          <Edit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(stop.id)}
                          disabled={loading === stop.id}
                          className="inline-flex items-center px-4 py-2 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
                        >
                          <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          {loading === stop.id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingStop ? 'Durak Düzenle' : 'Yeni Durak Ekle'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durak Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Örn: Lefkoşa Terminal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enlem (Latitude)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Örn: 35.185566"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Boylam (Longitude)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Örn: 33.382275"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading === 'submit'}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === 'submit'
                    ? 'Kaydediliyor...'
                    : editingStop
                    ? 'Güncelle'
                    : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

