import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin();
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, latitude, longitude } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Stop name is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('stops')
      .insert({
        name,
        latitude: latitude || null,
        longitude: longitude || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating stop:', error);
      return NextResponse.json({ error: 'Failed to create stop' }, { status: 500 });
    }

    return NextResponse.json({ success: true, stop: data });
  } catch (error) {
    console.error('Error in stop creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

