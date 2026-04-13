export type State = {
  id: string
  nome: string
  sigla: string
}

export type Region = {
  id: string
  nome: string
}

export type City = {
  id: string
  nome: string
  regiaoId: string
}

