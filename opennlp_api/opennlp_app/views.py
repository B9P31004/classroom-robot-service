from django.shortcuts import render

# Create your views here.
from django.http.response import HttpResponse
from nltk_opennlp.taggers import OpenNLPTagger

def opennlp_api(request):
    if request.method == "GET":
        return HttpResponse()
    else:
        phrase=request.body.decode()
        path_to_bin='/apache-opennlp/bin'
        path_to_model='/opennlp_models/en-pos-maxent.bin'
        tt = OpenNLPTagger(language='en',path_to_bin=path_to_bin,path_to_model=path_to_model)
        sentence = tt.tag(phrase)
    return HttpResponse(sentence)