import React, { useState } from 'react';
import { X, Database, ShieldCheck, Download, RefreshCw, HardDrive, Clock, CheckCircle2, AlertTriangle, ArrowDownToLine, Lock } from 'lucide-react';
import { BackupSnapshot } from '../types';
import { INITIAL_BACKUPS } from '../data/mockData';

interface BackupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const BackupManagerModal: React.FC<BackupManagerModalProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
}) => {
  const [backups, setBackups] = useState<BackupSnapshot[]>(INITIAL_BACKUPS);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [schedule, setSchedule] = useState<'daily' | '6hours' | 'realtime'>('daily');
  const [storageTarget, setStorageTarget] = useState('S3 Cold Glacier (Encrypted AES-256)');
  const [retentionDays, setRetentionDays] = useState(90);

  if (!isOpen) return null;

  const handleCreateInstantBackup = () => {
    setIsBackingUp(true);
    onTriggerToast('Создание дампа базы данных...', 'Блокировка таблиц на чтение, экспорт SQL схемы и данных...', 'info');

    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 12);
      const newBackup: BackupSnapshot = {
        id: `snap-${dateStr}`,
        timestamp: `${now.toLocaleDateString('ru-RU')}, ${now.toLocaleTimeString('ru-RU')} МСК`,
        fileName: `prom_ai_backup_manual_${dateStr}.enc.sql.gz`,
        size: '143.4 МБ',
        tablesCount: 14,
        recordsCount: 186120,
        sha256: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
        type: 'manual',
        storageTarget,
        status: 'verified',
      };

      setBackups([newBackup, ...backups]);
      setIsBackingUp(false);
      onTriggerToast(
        'Резервная копия создана!',
        `Снимок базы (${newBackup.size}) успешно сохранен в ${storageTarget}. Хэш проверен.`,
        'success'
      );
    }, 1200);
  };

  const handleDownloadSnapshot = (snap: BackupSnapshot) => {
    onTriggerToast(
      'Выгрузка резервной копии',
      `Файл ${snap.fileName} (${snap.size}) скачан. Требуется закрытый ключ AES-256 для дешифрования.`,
      'success'
    );
  };

  const handleRestoreSimulation = (snap: BackupSnapshot) => {
    onTriggerToast(
      'Тест восстановления из копии',
      `Снимок ${snap.fileName} от ${snap.timestamp} успешно верифицирован в тестовой песочнице (Staging DB). Ошибок целостности нет.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Автоматическое резервное копирование БД
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> AES-256 Encryption
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Защита проектов, договоров, логов телеметрии и клиентских документов
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Quick Action Top Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Мгновенный снимок всей базы данных</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Включает таблицы проектов, заявок, историю взаимодействий и журналы телеметрии.
              </p>
            </div>

            <button
              onClick={handleCreateInstantBackup}
              disabled={isBackingUp}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
              <span>{isBackingUp ? 'Экспорт дампа...' : 'Создать копию сейчас'}</span>
            </button>
          </div>

          {/* Schedule & Retention Config */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Расписание и параметры автоматического резервирования:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-300 font-medium block">Регламент запуска:</span>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-400 text-xs"
                >
                  <option value="daily">Раз в сутки в 03:00 МСК</option>
                  <option value="6hours">Каждые 6 часов</option>
                  <option value="realtime">При каждом изменении (WAL)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-300 font-medium block">Хранилище дампов:</span>
                <select
                  value={storageTarget}
                  onChange={(e) => setStorageTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-400 text-xs truncate"
                >
                  <option value="S3 Cold Glacier (Encrypted AES-256)">S3 Cold Glacier (AES-256)</option>
                  <option value="On-Premise Isolated Storage">Локальный изолированный сервер</option>
                  <option value="Yandex Cloud Object Storage">Yandex Cloud (ЦОД Москва)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-300 font-medium block">Срок хранения архивов:</span>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-400 text-xs"
                >
                  <option value={30}>30 дней ротации</option>
                  <option value={90}>90 дней (рекомендовано)</option>
                  <option value={365}>365 дней (ГОСТ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Backup Snapshots History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Архив контрольных точек базы данных ({backups.length}):
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Целостность проверена (SHA-256 OK)
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">Снимок БД & Время</th>
                    <th className="p-3 hidden sm:table-cell">Объем / Записей</th>
                    <th className="p-3 hidden md:table-cell">SHA-256 Checksum</th>
                    <th className="p-3 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {backups.map((snap) => (
                    <tr key={snap.id} className="hover:bg-slate-900/50">
                      <td className="p-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white block">{snap.fileName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{snap.timestamp}</span>
                            <span className="text-[10px] text-slate-500 block">{snap.storageTarget}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell font-mono">
                        <div className="text-slate-200">{snap.size}</div>
                        <div className="text-[11px] text-slate-500">{snap.recordsCount.toLocaleString('ru-RU')} строк</div>
                      </td>
                      <td className="p-3 hidden md:table-cell font-mono text-[11px] text-slate-400">
                        <span className="truncate block max-w-[180px]" title={snap.sha256}>
                          {snap.sha256.slice(0, 16)}...
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDownloadSnapshot(snap)}
                            className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors"
                            title="Скачать зашифрованный дамп"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRestoreSimulation(snap)}
                            className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                          >
                            Тест восстановления
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <Lock className="w-3 h-3 text-emerald-400" />
            Дампы зашифрованы ключом ГОСТ Р 34.12-2015 (Кузнечик) / AES-256
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
