import SocketGameComponent from '@/components/SocketGameComponent';
import ErrorPage from '@/components/Error';
import UnauthorizedPage from '@/components/Unauthorized';

export default async function SocketPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const gameId = searchParams.game_id;
  const playAs = searchParams.playas;

  if (!gameId) {
    return <ErrorPage message="No game ID provided" code="400" />;
  }

  if (!playAs || (playAs !== 'w' && playAs !== 'b')) {
    return <ErrorPage message="Invalid player role specified" code="400" />;
  }

  if (typeof gameId !== 'string') {
    return <UnauthorizedPage />;
  }

  return (
    <SocketGameComponent gameId={gameId} playingAs={playAs as 'w' | 'b'} />
  );
}
