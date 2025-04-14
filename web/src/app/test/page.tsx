'use client'
export type InitBody = { game_id: string, white_user_id: string, black_user_id: string, };

export default function Test() {
  return <div onClick={async () => {
    const init_body: InitBody = { game_id: "a", white_user_id: "w", black_user_id: "b" }
    const res = await fetch('http://localhost:8000/init', {
      method: "POST", headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, body: JSON.stringify(init_body)
    });

  }}>
    Fetch
  </div>
}