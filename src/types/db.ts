export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      regioes_minas: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
          id?: string
          nome?: string
        }
        Relationships: []
      }
      cidades: {
        Row: {
          id: string
          nome: string
          regiao_id: string
          populacao: number | null
        }
        Insert: {
          id?: string
          nome: string
          regiao_id: string
          populacao?: number | null
        }
        Update: {
          id?: string
          nome?: string
          regiao_id?: string
          populacao?: number | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
          id?: string
          nome?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          id: string
          categoria_id: string
          nome: string
          nome_responsavel_compras: string | null
          telefone_principal: string | null
          whatsapp: string | null
          status_validacao: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          categoria_id: string
          nome: string
          nome_responsavel_compras?: string | null
          telefone_principal?: string | null
          whatsapp?: string | null
          status_validacao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          categoria_id?: string
          nome?: string
          nome_responsavel_compras?: string | null
          telefone_principal?: string | null
          whatsapp?: string | null
          status_validacao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lojas: {
        Row: {
          id: string
          empresa_id: string
          nome_estabelecimento: string
          cidade_id: string
          categoria_id: string
          telefone_principal: string | null
          whatsapp: string | null
          nome_responsavel_compras: string | null
          endereco: string | null
          status_validacao: string | null
        }
        Insert: {
          id?: string
          empresa_id: string
          nome_estabelecimento: string
          cidade_id: string
          categoria_id: string
          telefone_principal?: string | null
          whatsapp?: string | null
          nome_responsavel_compras?: string | null
          endereco?: string | null
          status_validacao?: string | null
        }
        Update: {
          id?: string
          empresa_id?: string
          nome_estabelecimento?: string
          cidade_id?: string
          categoria_id?: string
          telefone_principal?: string | null
          whatsapp?: string | null
          nome_responsavel_compras?: string | null
          endereco?: string | null
          status_validacao?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

