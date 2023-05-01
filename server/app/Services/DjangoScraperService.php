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
    public function downloadVideo(Request $request)
    {
        $validation = Validator::make($request->all(), ["vid_id" => "required|string"]);
        if ($validation->fails()) {
            return response()->json($validation->errors()->all(), 400);
        }
    
        $validated = $validation->validated();
    
        $client = new Client();
    
        $response = $client->post('http://127.0.0.1:5000/download-video/', [
            'form_params' => [
                'vid_id' => $validated["vid_id"],
            ],
        ]);
    
        $data = json_decode($response->getBody(), true);
    
        $storagePath = storage_path('app/public/videos/' . $data['file_name']);
        $url = $data['file_path'];
        $client = new Client();
        $response = $client->get('http://127.0.0.1:5000' . $url);
        $fileContent = $response->getBody();
        file_put_contents($storagePath, $fileContent);
    
        return response()->download($storagePath, $data['file_name']);
    }

    
}