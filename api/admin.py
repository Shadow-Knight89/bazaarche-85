
from django.contrib import admin
from .models import Product, Category, Comment

# Register models
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Comment)

# Note: GiftCode, Purchase, and Admin models don't exist yet in your models.py
# If you need these features, create these models first, then uncomment:
# admin.site.register(GiftCode)
# admin.site.register(Purchase)
# admin.site.register(Admin)
