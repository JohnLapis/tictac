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
        //
    }
}
