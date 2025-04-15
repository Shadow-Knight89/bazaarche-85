
from django.contrib import admin
from .models import Product, Category, Comment, Purchase, PurchaseItem

class PurchaseItemInline(admin.TabularInline):
    model = PurchaseItem
    extra = 0

class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total', 'createdAt')
    list_filter = ('createdAt',)
    search_fields = ('user__username',)
    inlines = [PurchaseItemInline]

# Register models
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(PurchaseItem)

# Note: GiftCode, Purchase, and Admin models don't exist yet in your models.py
# If you need these features, create these models first, then uncomment:
# admin.site.register(GiftCode)
# admin.site.register(Purchase)
# admin.site.register(Admin)
