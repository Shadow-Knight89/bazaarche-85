const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
  // Check if customId already exists
  if (product.customId && products.some(p => p.customId === product.customId)) {
    toast({
      title: "خطا",
      description: "شناسه سفارشی تکراری است. لطفا شناسه دیگری انتخاب کنید.",
      variant: "destructive",
    });
    return;
  }

  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  console.log("New product added:", newProduct);
  setProducts((prev) => [...prev, newProduct]);
  toast({
    title: "محصول جدید",
    description: "محصول با موفقیت اضافه شد",
  });
};