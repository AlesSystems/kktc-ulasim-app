import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stopId, name, latitude, longitude } = await request.json();

    if (!stopId || !name) {
      return NextResponse.json(
        { error: 'Stop ID and name are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('stops')
      .update({
        name,
        latitude: latitude || null,
        longitude: longitude || null,
      })
      .eq('id', stopId)
      .select()
      .single();

    if (error) {
      console.error('Error updating stop:', error);
      return NextResponse.json({ error: 'Failed to update stop' }, { status: 500 });
    }

    return NextResponse.json({ success: true, stop: data });
  } catch (error) {
    console.error('Error in stop update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

