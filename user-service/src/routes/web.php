<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'User Service',
        'status' => 'berhasil jalan',
        'pesan' => 'welcome'
    ]);
});

require __DIR__.'/auth.php';
