export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Helper to get Supabase client (server-side)
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.log('Supabase error:', error)
      return NextResponse.json({ clients: [] })
    }

    return NextResponse.json({ clients: data || [] })
  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json({ clients: [] })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, name, ndisNumber } = await request.json()

    if (!userId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        name,
        ndis_number: ndisNumber || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ client: data })
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, userId, name, ndisNumber } = await request.json()

    if (!id || !userId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('clients')
      .update({ name, ndis_number: ndisNumber || null })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ client: data })
  } catch (error) {
    console.error('Update client error:', error)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete client error:', error)
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}
