# Create your views here.
from DeepImageSearch import Index, LoadData, SearchImage
from django.http import HttpResponse
from django.shortcuts import render

from base_app.models import CustomerImage


def main(request):
    return HttpResponse(
        """<iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/1yhVLCFqvjIAARRbzbhY30?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>""")


def render_index(request):
    return render(request, "index.html")


def image_search(request):
    context = None
    is_result = False
    if request.method == 'POST' and request.FILES['upload']:
        upload = request.FILES['upload']
        cust_img = CustomerImage.objects.create(image=upload)
        print(type(upload))
        image_list = LoadData().from_folder(['media/dataset_images'])
        Index(image_list).Start()
        list_of_images = SearchImage().get_similar_images(image_path=cust_img.image.path, number_of_images=21)
        image_list = []
        for x in list_of_images.values():
            image_name = x.split('\\')[1]
            image_list.append(image_name)
        print(image_list)
        context = {'images': image_list, 'is_result': True}
        return render(request, "image_input.html", context=context)
    return render(request, "image_input.html")
