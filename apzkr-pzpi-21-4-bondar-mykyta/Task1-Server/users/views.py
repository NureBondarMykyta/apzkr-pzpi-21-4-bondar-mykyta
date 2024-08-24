
from datetime import datetime
from django.shortcuts import render
from django.contrib import auth, messages
from django.http import  HttpResponseRedirect
from django.http import JsonResponse
import subprocess
from django.urls import reverse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated

from locations.models import Location
from users.forms import UserLoginForm, UserRegistrationForm, UserSettingsForm


def login(request):
    if request.method == 'POST':
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            user = auth.authenticate(username=username, password=password)
            if user:
                auth.login(request, user)
                return HttpResponseRedirect(reverse('users:profile'))
    else:
        form = UserLoginForm()
    context = {'form' : form}
    return render(request, 'users/login.html', context)

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(reverse('users:login'))

def registration(request):
    if request.method == 'POST':
        form = UserRegistrationForm(data=request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'You have successfully registered ✅')
            return HttpResponseRedirect(reverse('users:login'))
    else:
        form = UserRegistrationForm()

    context = {'form': form}
    return render(request, 'users/registration.html', context)

def profile(request):
    user = request.user
    locations = Location.objects.filter(user_id=user.id)
    if user.is_active:
        context = {'user' : user, 'locations' : locations}
        return render(request, 'users/profile.html', context)
    else:
        return HttpResponseRedirect(reverse('users:login'))


def settings(request):
    if request.method == 'POST':
        form = UserSettingsForm(instance=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('users:settings'))
        else:
            print(form.errors)
    else:
        form = UserSettingsForm(instance=request.user)
    context = {'form' : form}
    return render(request, 'users/settings.html', context)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def backup_database(request):
    if not request.user.is_superuser:
        return JsonResponse({'status': 'error', 'message': 'Access denied. Admins only.'}, status=403)

    try:
        now = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        backup_file = f'backup/backup_{now}.sql'

        pg_dump_path = '/opt/homebrew/opt/postgresql@16/bin/pg_dump'

        with open(backup_file, 'w') as f:
            result = subprocess.run(
                [pg_dump_path, 'ecosystem'],
                stdout=f,
                stderr=subprocess.PIPE,
                check=True
            )

        return JsonResponse({'status': 'success', 'message': f'Backup created successfully! File: {backup_file}'})

    except subprocess.CalledProcessError as e:
        return JsonResponse({'status': 'error', 'message': f'Failed to create backup: {e.stderr.decode()}'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'An unexpected error occurred: {str(e)}'})