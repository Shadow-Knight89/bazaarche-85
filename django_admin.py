
from django.contrib import admin
from .models import Product, Category, Comment

# Register your models
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Comment)

# Note: The GiftCode, Purchase, and Admin models don't exist in your current Django models
# If you need these features, you'll need to create these models in models.py first
# Then you can uncomment these lines:
# admin.site.register(GiftCode)
# admin.site.register(Purchase)
# admin.site.register(Admin)
