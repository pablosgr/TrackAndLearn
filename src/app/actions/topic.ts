'use server'

import { createClient } from "@/lib/supabaseServerClient";

export async function fetchTopics() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('topic').select()
  if (error) throw error
  return data
}

export async function addTopic(name: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('topic').insert({ name })
  if (error) throw error
}

export async function deleteTopic(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('topic').delete().eq('id', id)
  if (error) throw error
}
