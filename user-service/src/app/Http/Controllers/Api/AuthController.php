<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\FirebaseAuthService;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected FirebaseAuthService $firebase;

    public function __construct(
        FirebaseAuthService $firebase
    ) {
        $this->firebase = $firebase;
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|email',
            'password'=>'required|min:6'
        ]);

        $firebaseUser =
            $this->firebase->createUser(
                $request->name,
                $request->email,
                $request->password
            );

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'firebase_uid' => $firebaseUser->uid,
        ]);

        $token =
            $user->createToken(
                'auth_token'
            )->plainTextToken;

        return response()->json([
            'message'=>'Register success',
            'user'=>$user,
            'token'=>$token
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);

        $signIn =
            $this->firebase->signIn(
                $request->email,
                $request->password
            );

        $user = User::where(
            'email',
            $request->email
        )->first();

        $token =
            $user->createToken(
                'auth_token'
            )->plainTextToken;

        return response()->json([
            'message'=>'Login success',
            'token'=>$token,
            'firebase_token'=>
                $signIn->idToken(),
            'user'=>$user
        ]);
    }

    public function profile(
        Request $request
    ) {
        return response()->json([
            'user'=>$request->user()
        ]);
    }

    public function logout(
        Request $request
    ) {
        $request
            ->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message'=>'Logout success'
        ]);
    }
}