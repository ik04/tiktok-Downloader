<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;

class UserController extends Controller
{
    public function signUp(Request $request){
        $validation = Validator::make($request->all(),[
            'first_name'=>'required|string',
            'last_name'=>'required|string',
            'username'=>'required|string|unique:users',
            'email'=>'required|unique:users|string',
            'password' =>'required|string|confirmed',
        ]);
        if($validation->fails()){
            return response()->json($validation->errors()->all(),400);
        }
        $validated = $validation->validated();
        

        $subcription = Subscription::create([
            "uuid" => Uuid::uuid4(),
        ]);
        $user = User::create([
            "first_name" =>$validated["first_name"],
            "last_name" =>$validated["last_name"],
            "username" =>$validated["username"],
            "email" =>$validated['email'],
            "password" =>Hash::make($validated['password']),
            "subscriptionId" =>$subcription->id,
            "uuid"=>Uuid::uuid4(),
        ]);
        return response()->json(['user'=>$user],201);   
    }

    public function getUsers(Request $request){
        $users = User::all();
        return response()->json(["users"=>$users],200);
    }
    public function signIn(Request $request){
        $validation = Validator::make($request->all(),[
            'email'=>'required|string',
            'password' =>'required|string',
        ]);
        if($validation->fails()){
            return response()->json($validation->errors()->all(),400);
        }
        $validated = $validation->validated();
       
        $user = User::where('email',$validated['email'])->first();
            if(!$user){
                return response()->json(['error'=>"Email Not registered"],400);

            }
        if(!Hash::check($validated['password'],$user->password)){
            return response()->json(["error"=>"Invalid Credentials"],401);
        }
        $token = $user->createToken('myapptoken')->plainTextToken;
        return response()->json(['user'=>$user,'token'=>$token],200)->withCookie(cookie()->forever('at',$token));
    }

    public function userData(Request $request){
        if(!$request->hasCookie("at")){
            return response()->json([
                'message' => "Unauthenticated"
            ],401);
        }
        if($token = \Laravel\Sanctum\PersonalAccessToken::findToken($request->cookie("at"))){
            $user = $token->tokenable;
        }
        else{
            return response()->json([
                'message' => "unauthenticated 1"
            ],401);
        }
        if(is_null($user)){
            return response()->json([
                'message' => "Unauthenticated 2"
            ]);
        }
        return response() -> json([
            'email' => $user->email,
            'first_name' => $user->first_name,
            'username' => $user->username,
            'uuid' => $user->uuid,  
            'subscriberId' => $user->subscriptionId,
            'access_token' => $request ->cookie('at'),
        ],200);
        //! sub id should be its uuid, run a query to fetch the uuid
    }
    public function logout(Request $request){

        $request->user()->currentAccessToken()->delete();
        $response =  [
            'message' => 'logged out'
        ];
        return response($response,200);

    }

    
    // todo: place checks for if paid or not
    // todo: if the subs id is null ask the user to renew membership and allow for an endpoint to run an update request todo the same (after pay has been implemented)
    // todo: allow the user to sign in through username or email
    // todo: persist user info but make the pay a separate function or keep it this way (refer armaan/ a senior)
    //*plan: 1) make the api call on a laravel route to a django api for the scrapping, 2) find a way to reliably persist the data 
    //! don't call the signup route till the transaction is complete
    
    // // todo: implement OAuth (prolly not)

}