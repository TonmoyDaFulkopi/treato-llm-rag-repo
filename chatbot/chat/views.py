from django.shortcuts import render

from django.http import JsonResponse

def index(request):
    return render(request, 'chat/index.html')

def chatbot(request):
    user_message = request.GET.get('message')
    # Call your chatbot's logic here to get the response
    response_message = "This is a response from the chatbot"
    return JsonResponse({'response': response_message})