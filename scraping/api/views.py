import json
import requests
from threading import Thread

from django.http import JsonResponse
from django.http import FileResponse
from django.views.decorators.csrf import csrf_exempt
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from rest_framework.decorators import api_view

@csrf_exempt
@api_view(["POST"])
def tiktok_videos(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        driver = webdriver.Chrome()
        driver.get(f"https://www.tiktok.com/@{username}")
        last_height = driver.execute_script("return document.body.scrollHeight")

        try:
            captcha = driver.find_element(By.XPATH, ".//*[@class='verify-bar-close--icon']")
            captcha.click()
            print('closed captcha')
            time.sleep(1)
        except:
            pass

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        time.sleep(2)

        new_height = driver.execute_script("return document.body.scrollHeight")

        try:
            captcha = driver.find_element(By.XPATH, ".//*[@class='verify-bar-close--icon']")
            captcha.click()
            print('closed captcha')
            time.sleep(1)
        except:
            if new_height == last_height:
                pass

        video_elements = driver.find_elements(By.TAG_NAME, 'a')

        video_links = []
        for video_element in video_elements:
            if video_element == None:
                continue
            try:
                if video_element.get_attribute("href").startswith(f"https://www.tiktok.com/@{username}/"):
                    image = video_element.find_element(By.TAG_NAME, "img")
                    print(image.get_attribute("src"))
                    video_link = video_element.get_attribute("href")
                    video_links.append(video_link)
            except Exception as e:
                print(e)
                continue

        data = {
            'username': username,
            'video_links': video_links
        }
        return JsonResponse(data)

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

def download_async(vid_id):
    download = Thread(target=download_video, args=[vid_id])
    download.start()

def download_video(vid_id):
    url = 'https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id='+vid_id

    response = requests.get(url, headers=headers)
    json_data = json.loads(response.text)

    new_url = json_data['aweme_list'][0]['video']['play_addr']['url_list'][0]

    file_name = f'{vid_id}.mp4'
    download_file = requests.get(new_url, headers=headers).content

    chunk_size = 1024

    with open(file_name, 'wb') as file:
        for i in range(0, len(download_file), chunk_size):
            chunk = download_file[i:i+chunk_size]
            file.write(chunk)

@api_view(["POST"])
def download_video_view(request):
    vid_id = request.POST.get("vid_id")
    download_async(vid_id)
    response_data = {'status': 'success'}
    
    
    return JsonResponse(response_data)
# todo: send a file response with the video to laravel
    
    # file_path = f'{vid_id}.mp4'
    # file = open(file_path, 'rb')
    # response = FileResponse(file, content_type='application/octet-stream')
    # response['Content-Disposition'] = f'attachment; filename="{file_path}"'
    # return response

