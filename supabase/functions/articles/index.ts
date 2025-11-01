import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, handleCORS } from '../_shared/cors.ts'

interface Article {
  id?: string
  title: string
  excerpt: string
  content: string
  image_url: string
  category: string
  author: string
  published_at?: string
  status: 'published' | 'draft' | 'pending'
  tags: string[]
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCORS(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req

    switch (method) {
      case 'GET':
        return handleGetArticles(supabaseClient, req)
      case 'POST':
        return handleCreateArticle(supabaseClient, req)
      case 'PUT':
        return handleUpdateArticle(supabaseClient, req)
      case 'DELETE':
        return handleDeleteArticle(supabaseClient, req)
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { 
            status: 405, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleGetArticles(supabaseClient: any, req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')
  const status = url.searchParams.get('status') || 'published'
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const offset = parseInt(url.searchParams.get('offset') || '0')

  let query = supabaseClient
    .from('articles')
    .select('*')
    .eq('status', status)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  return new Response(
    JSON.stringify({ articles: data }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

async function handleCreateArticle(supabaseClient: any, req: Request) {
  const article: Article = await req.json()

  const { data, error } = await supabaseClient
    .from('articles')
    .insert([{
      ...article,
      published_at: article.status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    }])
    .select()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  return new Response(
    JSON.stringify({ article: data[0] }),
    { 
      status: 201, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

async function handleUpdateArticle(supabaseClient: any, req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const article: Article = await req.json()

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Article ID is required' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  const { data, error } = await supabaseClient
    .from('articles')
    .update({
      ...article,
      updated_at: new Date().toISOString(),
      published_at: article.status === 'published' && !article.published_at 
        ? new Date().toISOString() 
        : article.published_at
    })
    .eq('id', id)
    .select()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  return new Response(
    JSON.stringify({ article: data[0] }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

async function handleDeleteArticle(supabaseClient: any, req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Article ID is required' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  const { error } = await supabaseClient
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  return new Response(
    JSON.stringify({ message: 'Article deleted successfully' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}
