'use client';

import { AlertTriangle } from 'lucide-react';

export function WarningBanner() {
  return (
    <div className="alert-warning flex items-center justify-center gap-2 mb-6">
      <AlertTriangle className="w-5 h-5" />
      <span>WARNING: Shmoo points are non-transferable and have no value.</span>
    </div>
  );
}
