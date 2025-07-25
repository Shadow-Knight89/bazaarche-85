
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppContextProvider } from "./contexts/AppProvider";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Create a client outside of the component render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route
                path="*"
                element={
                  <>
                    <Header />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/products/:productId" element={<ProductDetail />} />
                      <Route path="/products/custom/:customId" element={<ProductDetail />} />
                      <Route path="/p/:customId" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/change-password" element={<ChangePassword />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AppContextProvider>
  </QueryClientProvider>
);

export default App;
