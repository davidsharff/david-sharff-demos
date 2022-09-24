import { useState } from 'react';
import { Game } from '@david-sharff-demos/static-caas-data';

// TODO: add error handling to methods
export function Home() {
  const [apiResponse, setApiResponse] = useState<Game | null>(null);

  const handleCreateGame = async () => {
    fetch('/api/game/create', {
      method: 'POST',
    })
      .then((r) => r.json())
      .then((r: Game) => setApiResponse(r));
  };

  const handleGetGame = async () => {
    const gameId = Math.round(Math.random() * 10);
    fetch(`/api/game/${gameId}`)
      .then((r) => r.json())
      .then((r: Game) => setApiResponse(r));
  };

  return (
    <div>
      <h1>Chess as a Service Sandbox</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      <button onClick={handleGetGame}>Get Game</button>
      {!!apiResponse && (
        <div>
          <h3>Response:</h3>
          <div>{JSON.stringify(apiResponse)}</div>
        </div>
      )}
    </div>
  );
}
