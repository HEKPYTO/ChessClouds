import SocketGameComponent from "@/components/SocketGameComponent";

export default async function SocketPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const gameId = (await searchParams).game_id;
  const playAs = (await searchParams).playas;

  if (typeof (gameId) !== 'string' || typeof (playAs) !== 'string' || !(playAs === 'w' || playAs === 'b')) {
    return <div>Invalid search params</div>
  }

  return <SocketGameComponent gameId={gameId} playingAs={playAs} />
}
