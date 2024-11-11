export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          role: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          role?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          role?: string
          avatar_url?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          cpf_cnpj: string
          birth_date: string
          cep: string
          address: string
          address_number: string
          complement: string
          city: string
          state: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          cpf_cnpj: string
          birth_date: string
          cep: string
          address: string
          address_number: string
          complement: string
          city: string
          state: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          cpf_cnpj?: string
          birth_date?: string
          cep?: string
          address?: string
          address_number?: string
          complement?: string
          city?: string
          state?: string
          user_id?: string
        }
      }
    }
  }
}