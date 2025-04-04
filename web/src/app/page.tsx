import ChessBoard from '@/components/chess/ChessBoard'
import PgnViewer from '@/components/chess/PgnViewer'
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const samplePgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6";

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Chess App</h1>
      
        <ChessBoard playingAs='b' />
      
      <Separator className="my-8" />
      
      <div className="text-center text-gray-500 text-sm">
        Built by ChessCloud Group
      </div>
    </div>
  )
}