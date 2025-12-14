import { MapPin, Construction } from 'lucide-react';

export default function StopsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <MapPin className="w-7 h-7 mr-3" />
          Durak Yönetimi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Durakları görüntüle ve yönet
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Yakında Gelecek
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Durak yönetim modülü şu anda geliştirilme aşamasındadır.
        </p>
      </div>
    </div>
  );
}
