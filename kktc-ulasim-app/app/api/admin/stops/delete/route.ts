import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stopId } = await request.json();

    if (!stopId) {
      return NextResponse.json(
        { error: 'Stop ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from('stops').delete().eq('id', stopId);

    if (error) {
      console.error('Error deleting stop:', error);
      return NextResponse.json({ error: 'Failed to delete stop' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in stop deletion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

