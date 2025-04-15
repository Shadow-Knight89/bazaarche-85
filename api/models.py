
from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discountedPrice = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    images = models.JSONField(default=list, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    customId = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    text = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.product.name}"

class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Purchase #{self.id} by {self.user.username}"

class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of purchase
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
