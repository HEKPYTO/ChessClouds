declare module 'lichess-pgn-viewer' {
    export default function LichessPgnViewer(
      container: HTMLElement,
      options: {
        pgn: string
        [key: string]: any
      }
    ): any
  }