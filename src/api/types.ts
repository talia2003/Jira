export type ApiBoard = {
    id: string
    name: string
    created_at: string
    owner_id: string
}

export type ApiColumn = {
    id: string
    board_id: string
    title: string
    position: number
}

export type ApiTicket = {
    id: string
    board_id: string
    column_id: string
    title: string
    position: number
}

export type BoardDetailResponse = {
    board: ApiBoard
    columns: ApiColumn[]
    tickets: ApiTicket[]
}