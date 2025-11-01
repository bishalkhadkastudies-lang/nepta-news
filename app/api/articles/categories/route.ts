import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('name')
      .order('name')

    if (error) {
      throw error
    }

    const categoryNames = (categories || []).map((cat: any) => cat.name)

    return NextResponse.json({
      categories: categoryNames
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', categories: [] },
      { status: 500 }
    )
  }
}
