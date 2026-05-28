<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;

class FirebaseAuthService
{
    protected Auth $auth;

    public function __construct()
    {
        $factory = (new Factory)
            ->withServiceAccount(
                env('FIREBASE_CREDENTIALS')
            );

        $this->auth = $factory->createAuth();
    }

    public function createUser(
        string $name,
        string $email,
        string $password
    ) {
        return $this->auth->createUser([
            'displayName' => $name,
            'email' => $email,
            'password' => $password
        ]);
    }

    public function signIn(
        string $email,
        string $password
    ) {
        return $this->auth
            ->signInWithEmailAndPassword(
                $email,
                $password
            );
    }

    public function getUser($uid)
    {
        return $this->auth->getUser($uid);
    }
}