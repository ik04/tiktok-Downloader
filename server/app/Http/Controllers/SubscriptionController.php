<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function handleExpiredSubscriptions()
    {
        $expiredSubscriptions = Subscription::where('endingTimeStamp', '<', now())->get();
    
        foreach ($expiredSubscriptions as $subscription) {
            $user = $subscription->user;
    
            if ($user) {
                $user->subscriberId = null;
                $user->save();
            }
    
            $subscription->delete();
        }
    }

    public function getSubscriptions(Request $request){
        $subs = Subscription::all();
        return response()->json(["subs"=>$subs]);
    }
}