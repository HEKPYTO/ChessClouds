import ChessBoard from '@/components/chess/ChessBoard'
import { Separator } from "@/components/ui/separator"

export default function Home() {

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Chess App</h1>
      
        <ChessBoard playingAs='w' />
      
      <Separator className="my-8" />
      
      <div className="text-center text-gray-500 text-sm">
        Built by ChessCloud Group
      </div>
    </div>
  )
}