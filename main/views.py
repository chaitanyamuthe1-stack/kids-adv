from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import UserProgress, ChapterProgress, Achievement, PronunciationLog, LessonData

def home(request):
    """Render the main kids learning app"""
    return render(request, 'main/Home.html')

@csrf_exempt
@require_http_methods(["POST"])
def api_register(request):
    """
    Register a new user with enhanced features.
    POST body: { "username": str, "password": str, "character": str }
    """
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '')
        character = data.get('character', '👤')

        if not username or len(username) < 3:
            return JsonResponse({'ok': False, 'error': 'Username must be at least 3 characters'}, status=400)
        
        if not password or len(password) < 4:
            return JsonResponse({'ok': False, 'error': 'Password must be at least 4 characters'}, status=400)

        # Check if user already exists
        if UserProgress.objects.filter(username=username).exists():
            return JsonResponse({'ok': False, 'error': 'User already exists'}, status=400)

        # Create new user with password hashing
        user = UserProgress.objects.create(
            username=username,
            character=character,
            stars=0,
            voice_gender='boy'
        )
        user.set_password(password)
        user.save()

        return JsonResponse({
            'ok': True,
            'message': 'User created successfully',
            'user': {
                'username': user.username,
                'character': user.character,
                'stars': user.stars,
                'created_at': user.created_at.isoformat(),
                'voice_gender': user.voice_gender
            }
        })
    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def api_login(request):
    """
    Login a user with enhanced tracking.
    POST body: { "username": str, "password": str }
    """
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return JsonResponse({'ok': False, 'error': 'Username and password required'}, status=400)

        try:
            user = UserProgress.objects.get(username=username)
            if user.check_password(password):
                user.last_login = timezone.now()
                user.save()
                
                return JsonResponse({
                    'ok': True,
                    'user': {
                        'username': user.username,
                        'character': user.character,
                        'stars': user.stars,
                        'voice_gender': user.voice_gender,
                        'voice_pitch': user.voice_pitch,
                        'voice_rate': user.voice_rate,
                        'theme': user.theme,
                        'created_at': user.created_at.isoformat()
                    }
                })
            else:
                return JsonResponse({'ok': False, 'error': 'Invalid password'}, status=401)
        except UserProgress.DoesNotExist:
            return JsonResponse({'ok': False, 'error': 'User not found'}, status=404)

    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)

@require_http_methods(["GET"])
def api_progress(request, username):
    """
    Get comprehensive user progress.
    GET /main/api/progress/<username>/
    """
    try:
        user = UserProgress.objects.get(username=username)
        chapters = ChapterProgress.objects.filter(user=user)
        achievements = Achievement.objects.filter(user=user)
        
        chapter_data = {}
        total_score = 0
        completed_chapters = 0
        
        for chapter in chapters:
            chapter_data[chapter.chapter_id] = {
                'name': chapter.chapter_name,
                'score': chapter.score,
                'attempts': chapter.attempts,
                'best_attempt': chapter.best_attempt,
                'is_completed': chapter.is_completed
            }
            if chapter.is_completed:
                completed_chapters += 1
            total_score += chapter.score
        
        achievement_badges = [
            {
                'badge_name': ach.badge_name,
                'badge_icon': ach.badge_icon,
                'earned_at': ach.earned_at.isoformat()
            } for ach in achievements
        ]
        
        return JsonResponse({
            'ok': True,
            'user': {
                'username': user.username,
                'character': user.character,
                'stars': user.stars,
                'total_points': user.total_points,
                'created_at': user.created_at.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None
            },
            'statistics': {
                'total_chapters': chapters.count(),
                'completed_chapters': completed_chapters,
                'total_score': total_score,
                'playtime_minutes': user.total_playtime_minutes
            },
            'chapters': chapter_data,
            'achievements': achievement_badges
        })
    except UserProgress.DoesNotExist:
        return JsonResponse({'ok': False, 'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def api_save_progress(request):
    """
    Save user progress with enhanced data.
    POST body: { "username": str, "chapter_id": str, "score": int, "chapter_name": str, "is_completed": bool }
    """
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        chapter_id = data.get('chapter_id', '').strip()
        score = data.get('score', 0)
        chapter_name = data.get('chapter_name', '')
        is_completed = data.get('is_completed', False)

        if not username or not chapter_id:
            return JsonResponse({'ok': False, 'error': 'Username and chapter_id required'}, status=400)

        try:
            user = UserProgress.objects.get(username=username)
            
            # Create or update chapter progress
            chapter_prog, created = ChapterProgress.objects.update_or_create(
                user=user,
                chapter_id=chapter_id,
                defaults={
                    'score': score,
                    'chapter_name': chapter_name,
                    'is_completed': is_completed
                }
            )
            
            if not created:
                chapter_prog.attempts += 1
                if score > chapter_prog.best_attempt:
                    chapter_prog.best_attempt = score
                chapter_prog.save()
            
            if is_completed:
                chapter_prog.mark_completed()
                user.add_stars(10)

            return JsonResponse({
                'ok': True,
                'message': 'Progress saved',
                'user': {
                    'username': user.username,
                    'stars': user.stars,
                    'total_points': user.total_points
                },
                'chapter': {
                    'id': chapter_prog.chapter_id,
                    'score': chapter_prog.score,
                    'attempts': chapter_prog.attempts
                }
            })
        except UserProgress.DoesNotExist:
            return JsonResponse({'ok': False, 'error': 'User not found'}, status=404)

    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def api_log_pronunciation(request):
    """
    Log pronunciation practice for tracking progress.
    POST body: { "username": str, "item": str, "proficiency_level": int }
    """
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        item = data.get('item', '').strip()
        proficiency_level = data.get('proficiency_level', 0)

        if not username or not item:
            return JsonResponse({'ok': False, 'error': 'Username and item required'}, status=400)

        try:
            user = UserProgress.objects.get(username=username)
            
            log, created = PronunciationLog.objects.update_or_create(
                user=user,
                item=item,
                defaults={'proficiency_level': proficiency_level, 'last_practiced': timezone.now()}
            )
            
            if not created:
                log.times_practiced += 1
                log.proficiency_level = max(log.proficiency_level, proficiency_level)
                log.last_practiced = timezone.now()
                log.save()

            return JsonResponse({
                'ok': True,
                'message': 'Pronunciation logged',
                'item': item,
                'proficiency_level': log.proficiency_level
            })
        except UserProgress.DoesNotExist:
            return JsonResponse({'ok': False, 'error': 'User not found'}, status=404)

    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def api_unlock_achievement(request):
    """
    Unlock an achievement for the user.
    POST body: { "username": str, "badge_name": str, "badge_icon": str, "description": str, "achievement_type": str }
    """
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        badge_name = data.get('badge_name', '').strip()
        badge_icon = data.get('badge_icon', '⭐')
        description = data.get('description', '')
        achievement_type = data.get('achievement_type', 'milestone')

        if not username or not badge_name:
            return JsonResponse({'ok': False, 'error': 'Username and badge_name required'}, status=400)

        try:
            user = UserProgress.objects.get(username=username)
            
            achievement, created = Achievement.objects.get_or_create(
                user=user,
                badge_name=badge_name,
                defaults={
                    'badge_icon': badge_icon,
                    'description': description,
                    'achievement_type': achievement_type
                }
            )

            if created:
                return JsonResponse({
                    'ok': True,
                    'message': f'Achievement unlocked: {badge_name} {badge_icon}',
                    'achievement': {
                        'badge_name': achievement.badge_name,
                        'badge_icon': achievement.badge_icon,
                        'earned_at': achievement.earned_at.isoformat()
                    }
                })
            else:
                return JsonResponse({
                    'ok': False,
                    'message': 'Achievement already unlocked'
                }, status=400)

        except UserProgress.DoesNotExist:
            return JsonResponse({'ok': False, 'error': 'User not found'}, status=404)

    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def api_update_settings(request):
    """
    Update user settings (voice, theme, etc.).
    POST body: { "username": str, "voice_gender": str, "voice_pitch": float, "voice_rate": float, "theme": str }
    """
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()

        if not username:
            return JsonResponse({'ok': False, 'error': 'Username required'}, status=400)

        try:
            user = UserProgress.objects.get(username=username)
            
            # Update settings if provided
            if 'voice_gender' in data:
                user.voice_gender = data['voice_gender']
            if 'voice_pitch' in data:
                user.voice_pitch = min(2.0, max(0.5, float(data['voice_pitch'])))
            if 'voice_rate' in data:
                user.voice_rate = min(1.5, max(0.5, float(data['voice_rate'])))
            if 'theme' in data:
                user.theme = data['theme']
            
            user.save()

            return JsonResponse({
                'ok': True,
                'message': 'Settings updated',
                'settings': {
                    'voice_gender': user.voice_gender,
                    'voice_pitch': user.voice_pitch,
                    'voice_rate': user.voice_rate,
                    'theme': user.theme
                }
            })

        except UserProgress.DoesNotExist:
            return JsonResponse({'ok': False, 'error': 'User not found'}, status=404)

    except Exception as e:
        return JsonResponse({'ok': False, 'error': str(e)}, status=500)