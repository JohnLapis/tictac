<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    App::setLocale(Request::getPreferredLanguage());
    return view('homepage');
});
