<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Petition;
use App\Models\Image;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ImageController extends Controller
{

    public function image(Request $request) {
        $dataUri = [];
        $images = Image::where(['petition_id' => $request->get('id')])->get()->all();
        foreach ($images as $item) {
            $image = storage_path().'/uploads/petitions/images/'.$request->get('id').'/'.$item->name;
            $type = pathinfo($image, PATHINFO_EXTENSION);
            $data = file_get_contents($image);
            array_push($dataUri, 'data:image/' . $type . ';base64,' . base64_encode($data));
        }

        return response()->json(['data' => $dataUri]);
    }

    public function imageClear(Request $request) {
        $user = Auth::user();
        $petition = Petition::where(['id' => $request->get('id')])->get()->first();
        if (!$user || $petition->created_by !== Auth::id() && !$user->can('edit petitions')) {
            return response()->json(['message' => 'User can not edit petitions', 'errors' => []]);
        }

        if($petition) {
            $path = strval(storage_path().'/uploads/petitions/images/'.$request->get('id').'/*');
            $files = glob($path); 
            foreach($files as $file){ 
                if(is_file($file)) {
                    unlink($file); 
                }
            }
            Image::where(['petition_id' => $request->get('id')])->delete();
            return response()->json(['message' => 'Old images were cleared successfully']);
        }
        return response()->json(['message' => 'Petition was not found']);
    }
        

    public function imageSave(Request $request) {
        $user = Auth::user();
        $petition = Petition::where(['id' => $request->get('id')])->get()->first();
        if (!$user || $petition->created_by !== Auth::id() && !$user->can('edit petitions')) {
            return response()->json(['message' => 'User can not edit petitions', 'errors' => []]);
        }

        $path = strval(storage_path().'/uploads/petitions/images'.$request->get('id'));
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $image = $request->get('image');
        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $imageName = Str::random(10).'.'.'png';
        
        \File::put($path.'/'.$imageName, base64_decode($image));      
        Image::insert(['petition_id' => $request->get('id'), 'name' => $imageName, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]);
        return response()->json($image);
    }

}
