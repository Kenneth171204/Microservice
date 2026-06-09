<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Kreait\Firebase\Factory;

class SyncFirebaseUsers extends Command
{
    protected $signature = 'firebase:sync-users';
    protected $description = 'Sync Firebase users to MySQL';

    public function handle()
    {
        $auth = (new Factory)
            ->withServiceAccount(storage_path('firebase.json'))
            ->createAuth();

        $users = $auth->listUsers();

        foreach ($users as $firebaseUser) {

            User::updateOrCreate(
                ['firebase_uid' => $firebaseUser->uid],
                [
                    'email' => $firebaseUser->email,
                    'name' => $firebaseUser->displayName ?? 'User',
                ]
            );
        }

        $this->info('Firebase users synced successfully');
    }
}