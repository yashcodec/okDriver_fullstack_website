from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile

import re

@api_view(['POST'])
def register_user(request):
    data = request.data
    
    if UserProfile.objects.filter(email=data.get('email')).exists():
        return Response({'detail': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        
    password = data.get('password', '')
    if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'\d', password) or not re.search(r'[^a-zA-Z0-9]', password):
        return Response({'detail': 'Password must be at least 8 chars, 1 uppercase, 1 number, and 1 special character.'}, status=status.HTTP_400_BAD_REQUEST)
        
    phone = data.get('phone', '')
    if not re.match(r'^\+\d{1,4}\d{10}$', phone):
        return Response({'detail': 'Phone must have a country code followed by exactly 10 digits.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = UserProfile.objects.create(
        name=data.get('name'),
        email=data.get('email'),
        phone=phone,
        password=password
    )
    return Response({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    data = request.data
    user = UserProfile.objects.filter(email=data.get('email')).first()
    if not user or user.password != data.get('password'):
        return Response({'detail': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone
        }
    })

@api_view(['PUT'])
def update_user(request, user_id):
    data = request.data
    
    # Handle frontend bug where user.id might be undefined in localStorage
    if user_id == 'undefined':
        email = data.get('email')
        if not email:
            return Response({'detail': 'Email required to find user'}, status=status.HTTP_400_BAD_REQUEST)
        user = UserProfile.objects.filter(email=email).first()
    else:
        user = UserProfile.objects.filter(id=user_id).first()
        
    if not user:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if 'name' in data: user.name = data['name']
    if 'email' in data: user.email = data['email']
    if 'phone' in data: user.phone = data['phone']
    
    if 'password' in data and data['password']:
        pw = data['password']
        if len(pw) < 8 or not re.search(r'[A-Z]', pw) or not re.search(r'\d', pw) or not re.search(r'[^a-zA-Z0-9]', pw):
            return Response({'detail': 'New password must be at least 8 chars, 1 uppercase, 1 number, and 1 special character.'}, status=status.HTTP_400_BAD_REQUEST)
        user.password = pw
        
    user.save()
    
    return Response({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone
    })
