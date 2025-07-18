
from rest_framework import serializers
from .models import Product, Comment, Category, Purchase, PurchaseItem, ShippingAddress
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=False)  # Make email optional
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # Add id to the serializer fields
    id = serializers.IntegerField(read_only=True)
    category_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'discountedPrice', 'category', 'category_name', 'images', 'createdAt', 'customId']
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'address', 'city', 'postalCode', 'phoneNumber', 'isDefault']
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        
        # If this is marked as default, unmark other addresses
        if validated_data.get('isDefault', False):
            ShippingAddress.objects.filter(user=user, isDefault=True).update(isDefault=False)
            
        return super().create(validated_data)

class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = PurchaseItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']
    
    def get_product_name(self, obj):
        return obj.product.name if obj.product else None

class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    username = serializers.SerializerMethodField()
    shipping_address = ShippingAddressSerializer(source='shippingAddress', read_only=True)
    shippingAddressId = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Purchase
        fields = ['id', 'user', 'username', 'items', 'total', 'createdAt', 'shipping_address', 'shippingAddressId']
    
    def get_username(self, obj):
        return obj.user.username if obj.user else None
    
    def create(self, validated_data):
        items_data = self.context.get('items', [])
        shipping_address_id = validated_data.pop('shippingAddressId', None)
        
        purchase = Purchase.objects.create(
            user=self.context['request'].user,
            total=validated_data.get('total', 0),
            shippingAddress_id=shipping_address_id
        )
        
        for item_data in items_data:
            PurchaseItem.objects.create(
                purchase=purchase,
                product_id=item_data.get('product'),
                quantity=item_data.get('quantity', 1),
                price=item_data.get('price', 0)
            )
        
        return purchase
