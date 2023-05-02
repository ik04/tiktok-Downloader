<?php

use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use App\Services\DjangoScraperService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post("/signup",[UserController::class,"signUp"]);
Route::post("/signin",[UserController::class,"signIn"]);
Route::get("/user",[UserController::class,"userData"]);


Route::group(['middleware'=>['auth:sanctum']],function(){
    Route::post("/scrape/search",[DjangoScraperService::class,"scrape"]);
    Route::post("/scrape/download",[DjangoScraperService::class,"downloadVideo"]);
    Route::post("/isLog", function () {  
        return response()->noContent();
    });
    Route::post("/logout",[UserController::class,"logout"]);
});


Route::get("/users",[UserController::class,"getUsers"]);
Route::get("/subs",[SubscriptionController::class,"getSubscriptions"]);