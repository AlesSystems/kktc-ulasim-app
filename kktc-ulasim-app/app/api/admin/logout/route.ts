import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/adminAuth';

export async function POST() {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
