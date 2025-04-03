declare module 'react-chessground' {
  import { FC } from 'react'
  import { Square } from 'chess.js'

  interface ChessgroundProps {
    width?: string
    height?: string
    fen?: string
    orientation?: 'white' | 'black'
    turnColor?: 'white' | 'black'
    check?: boolean
    lastMove?: [Square, Square]
    selected?: Square
    coordinates?: boolean
    autoCastle?: boolean
    viewOnly?: boolean
    disableContextMenu?: boolean
    resizable?: boolean
    addPieceZIndex?: boolean
    highlight?: {
      lastMove?: boolean
      check?: boolean
    }
    animation?: {
      enabled?: boolean
      duration?: number
    }
    movable?: {
      free?: boolean
      color?: 'white' | 'black' | 'both'
      dests?: Map<Square, Square[]>
      showDests?: boolean
      events?: {
        after?: (orig: Square, dest: Square, metadata: any) => void
      }
    }
    premovable?: {
      enabled?: boolean
      showDests?: boolean
      castle?: boolean
      events?: {
        set?: (orig: Square, dest: Square, metadata: any) => void
        unset?: () => void
      }
    }
    drawable?: {
      enabled?: boolean
      visible?: boolean
      defaultSnapToValidMove?: boolean
      eraseOnClick?: boolean
      shapes?: any[]
      autoShapes?: any[]
      brushes?: any
      pieces?: {
        baseUrl?: string
      }
      onChange?: (shapes: any[]) => void
    }
    onMove?: (from: Square, to: Square) => void
    onSelect?: (square: Square) => void
    onMouseOverSquare?: (square: Square) => void
    onMouseOutSquare?: (square: Square) => void
    [key: string]: any
  }

  const Chessground: FC<ChessgroundProps>
  export default Chessground
}