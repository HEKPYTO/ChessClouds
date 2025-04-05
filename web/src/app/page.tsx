import Pane from "@/components/chess/GamePane";

export default function Game() {

  return (
    <div className="container mx-auto py-8 px-4">
      <Pane playingAs="w"></Pane>
      
      <div className="text-center text-gray-500 text-sm py-10">
        Built by ChessCloud Group
      </div>  
    </div>
  );
}