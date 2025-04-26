export default function Page() {
  return (
    <div>
      <h1>
        NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT:{' '}
        {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT}
      </h1>
      <h1>DATABASE_URL: {process.env.DATABASE_URL}</h1>
      <h1>
        NEXT_PUBLIC_ENGINE_API_URL: {process.env.NEXT_PUBLIC_ENGINE_API_URL}
      </h1>
      <h1>
        NEXT_PUBLIC_WS_SERVER_URL: {process.env.NEXT_PUBLIC_WS_SERVER_URL}
      </h1>
      <h1>
        NEXT_PUBLIC_MATCHMAKING_SERVER_URL:{' '}
        {process.env.NEXT_PUBLIC_MATCHMAKING_SERVER_URL}
      </h1>
    </div>
  );
}
