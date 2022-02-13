<?php

use Illuminate\Support\Facades\Route;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;

Route::get('/', function () {
    App::setLocale(Request::getPreferredLanguage());
    return view('homepage');
});

WebSocketsRouter::webSocket('/websocket', \App\WebSocketHandler::class);
