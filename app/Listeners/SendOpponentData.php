<?php

namespace App\Listeners;

use App\Events\SearchForOpponent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOpponentData
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\SearchForOpponent  $event
     * @return void
     */
    public function handle(SearchForOpponent $event)
    {
        echo "here\n.";
        $user = $event->user;

        if (len($app->matchQueue) == 0) {
            return push($app->matchQueue, $user->id);
        }
        // Intuition tells us that we should use a queue, but the list doesn't tend
        // to get long.
        $opponent = pop($app->matchQueue);
        $firstPlayerId = rand(0, 1) ? $user->id : $opponent->id;
        $user->connection->send(json_encode([
            'event' => 'opponentFound',
            'opponent' => [
                'id' => $opponent->id,
                'symbol' => $opponent->symbol,
            ],
            'firstPlayerId' => $firstPlayerId,
        ]));
        $opponent->connection->send(json_encode([
            'event' => 'opponentFound',
            'opponent' => [
                'id' => $user->id,
                'symbol' => $user->symbol,
            ],
            'firstPlayerId' => $firstPlayerId,
        ]));
    }
}
