from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timedelta

class UserProgress(models.Model):
    """Enhanced user model with comprehensive learning tracking"""
    username = models.CharField(max_length=100, unique=True)
    password_hash = models.CharField(max_length=255)
    character = models.CharField(max_length=10, default='👤')
    stars = models.IntegerField(default=0)
    total_points = models.IntegerField(default=0)
    voice_gender = models.CharField(max_length=10, choices=[('boy', 'Boy'), ('girl', 'Girl')], default='boy')
    voice_pitch = models.FloatField(default=1.0)
    voice_rate = models.FloatField(default=1.0)
    theme = models.CharField(max_length=20, default='light')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    total_playtime_minutes = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.username} - ⭐{self.stars}"
    
    def set_password(self, raw_password):
        """Hash and set password"""
        self.password_hash = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Verify password hash"""
        return check_password(raw_password, self.password_hash)
    
    def add_stars(self, amount):
        """Add stars with achievement checking"""
        self.stars += amount
        self.total_points += amount * 10
        self.save()
        return self.get_achievement_unlock()
    
    def get_achievement_unlock(self):
        """Check if new achievement unlocked"""
        achievements = {
            10: "First Step 🎉",
            50: "Quick Learner ⭐",
            100: "Super Smart 🧠",
            250: "Genius Mode 🎓",
            500: "Champion 👑"
        }
        for threshold, badge in achievements.items():
            if self.stars == threshold:
                return badge
        return None

class ChapterProgress(models.Model):
    """Track progress per chapter/lesson"""
    user = models.ForeignKey(UserProgress, on_delete=models.CASCADE, related_name='chapters')
    chapter_id = models.CharField(max_length=50)
    chapter_name = models.CharField(max_length=255, default='')
    score = models.IntegerField(default=0)
    max_score = models.IntegerField(default=100)
    attempts = models.IntegerField(default=0)
    best_attempt = models.IntegerField(default=0)
    time_spent_minutes = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'chapter_id']
        ordering = ['chapter_id']
        indexes = [
            models.Index(fields=['user', 'chapter_id']),
            models.Index(fields=['is_completed']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.chapter_name}: {self.score}%"
    
    def mark_completed(self):
        """Mark chapter as completed and record timestamp"""
        self.is_completed = True
        self.completion_date = datetime.now()
        self.save()

class Achievement(models.Model):
    """Achievement/Badge system for gamification"""
    ACHIEVEMENT_TYPES = [
        ('stars', 'Star Collector'),
        ('speed', 'Speed Learner'),
        ('accuracy', 'Perfect Score'),
        ('streak', 'Learning Streak'),
        ('milestone', 'Major Milestone'),
    ]
    
    user = models.ForeignKey(UserProgress, on_delete=models.CASCADE, related_name='achievements')
    badge_name = models.CharField(max_length=100)
    badge_icon = models.CharField(max_length=10)
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    description = models.CharField(max_length=255)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-earned_at']
        unique_together = ['user', 'badge_name']
    
    def __str__(self):
        return f"{self.user.username} - {self.badge_name} {self.badge_icon}"

class LessonData(models.Model):
    """Structured lesson data for each chapter"""
    lesson_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50)  # alphabet, phonics, numbers, etc.
    content = models.JSONField()  # Stores all lesson content
    difficulty_level = models.IntegerField(choices=[(1, 'Beginner'), (2, 'Easy'), (3, 'Medium'), (4, 'Hard')])
    pronunciation_guide = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.category} - {self.title}"

class PronunciationLog(models.Model):
    """Track pronunciation learning progress"""
    user = models.ForeignKey(UserProgress, on_delete=models.CASCADE, related_name='pronunciation_logs')
    item = models.CharField(max_length=100)  # Letter, word, phrase, etc.
    times_heard = models.IntegerField(default=0)
    times_practiced = models.IntegerField(default=0)
    proficiency_level = models.IntegerField(default=0, choices=[(0, 'New'), (1, 'Beginner'), (2, 'Intermediate'), (3, 'Advanced'), (4, 'Mastered')])
    last_practiced = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'item']
        ordering = ['-last_practiced']
    
    def __str__(self):
        return f"{self.user.username} - {self.item} (Proficiency: {self.proficiency_level})"