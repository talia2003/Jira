import {api} from './client'
import type { ApiBoard, BoardDetailResponse } from './types'

export function listBoards(){
    return api.get<{boards:ApiBoard[]}>('/api/boards')
}

export function createBoard(name: string) {
  return api.post<{ board: ApiBoard }>('/api/boards', { name })
}

export function getBoard(boardId: string){
    return api.get<BoardDetailResponse>(`/api/boards/${boardId}`)
}