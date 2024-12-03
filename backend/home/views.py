from django.shortcuts import render


def spa_index(request, resource):
    return render(request, 'spa.html')
