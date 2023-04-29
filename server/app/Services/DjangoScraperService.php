<?php
namespace App\Services;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class DjangoScraperService
{
    public function scrape(Request $request)
    {
        // Code to call the Django API and scrape data
        $validation = Validator::make($request->all(),["username" =>"required|string"]);
        if($validation->fails()){
            return response()->json($validation->errors()->all(),400);
        }

        $validated = $validation->validated();

    $client = new Client();

    $response = $client->post('http://127.0.0.1:5000/get-videos/', [
        'form_params' => [
            'username' => $validated["username"],
        ],
    ]);

    $data = json_decode($response->getBody(), true);
    return response()->json($data);
    }
    //! fix stuff here
}