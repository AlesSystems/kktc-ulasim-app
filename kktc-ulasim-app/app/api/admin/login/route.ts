import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey, setAdminSession } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secretKey } = body;

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Gizli anahtar gerekli' },
        { status: 400 }
      );
    }

    if (!verifyAdminKey(secretKey)) {
      return NextResponse.json(
        { error: 'Geçersiz gizli anahtar' },
        { status: 401 }
      );
    }

    await setAdminSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
