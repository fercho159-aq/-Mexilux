/**
 * Cart Store - Zustand store for cart management
 * Syncs with backend API and provides optimistic updates
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    frameId: string;
    name: string;
    slug: string;
    brand: string;
    colorVariantId: string;
    colorName: string;
    image: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    lensConfigurationId?: string | null;
    addedAt: string;
}

export interface CartState {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    couponCode: string | null;
    itemCount: number;
    isLoading: boolean;
    error: string | null;
    lastSynced: Date | null;
}

interface CartActions {
    // Fetch cart from API
    fetchCart: () => Promise<void>;

    // Add item to cart
    addItem: (item: {
        frameId: string;
        colorVariantId: string;
        quantity?: number;
        lensConfigurationId?: string;
    }) => Promise<void>;

    // Update item quantity
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;

    // Remove item from cart
    removeItem: (itemId: string) => Promise<void>;

    // Clear entire cart
    clearCart: () => Promise<void>;

    // Apply coupon
    applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;

    // Remove coupon
    removeCoupon: () => Promise<void>;

    // Set loading state
    setLoading: (loading: boolean) => void;

    // Set error
    setError: (error: string | null) => void;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    couponCode: null,
    itemCount: 0,
    isLoading: false,
    error: null,
    lastSynced: null,
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            fetchCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/cart');
                    if (!response.ok) {
                        throw new Error('Error al cargar el carrito');
                    }
                    const data = await response.json();
                    set({
                        items: data.items || [],
                        subtotal: data.subtotal || 0,
                        discount: data.discount || 0,
                        shipping: data.shipping || 0,
                        tax: data.tax || 0,
                        total: data.total || 0,
                        couponCode: data.couponCode || null,
                        itemCount: data.itemCount || 0,
                        isLoading: false,
                        lastSynced: new Date(),
                    });
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error desconocido',
                    });
                }
            },

            addItem: async ({ frameId, colorVariantId, quantity = 1, lensConfigurationId }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            frameId,
                            colorVariantId,
                            quantity,
                            lensConfigurationId,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al agregar al carrito');
                    }

                    const data = await response.json();

                    // Refresh full cart to ensure consistency
                    await get().fetchCart();

                    // Dispatch event for other components (e.g., header cart count)
                    window.dispatchEvent(new CustomEvent('cart-updated', {
                        detail: { itemCount: data.cart?.itemCount }
                    }));

                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error desconocido',
                    });
                    throw error;
                }
            },

            updateQuantity: async (itemId: string, quantity: number) => {
                const { items } = get();

                // Optimistic update
                const optimisticItems = items.map(item =>
                    item.id === itemId
                        ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
                        : item
                );
                set({ items: optimisticItems });

                try {
                    const response = await fetch(`/api/cart/${itemId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al actualizar cantidad');
                    }

                    const data = await response.json();

                    // Update totals from response
                    set({
                        subtotal: data.cart.subtotal,
                        shipping: data.cart.shipping,
                        total: data.cart.total,
                        itemCount: data.cart.itemCount,
                    });

                    window.dispatchEvent(new CustomEvent('cart-updated', {
                        detail: { itemCount: data.cart.itemCount }
                    }));

                } catch (error) {
                    // Revert on error
                    await get().fetchCart();
                    set({
                        error: error instanceof Error ? error.message : 'Error desconocido',
                    });
                }
            },

            removeItem: async (itemId: string) => {
                const { items } = get();

                // Optimistic update
                const optimisticItems = items.filter(item => item.id !== itemId);
                set({ items: optimisticItems });

                try {
                    const response = await fetch(`/api/cart/${itemId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al eliminar del carrito');
                    }

                    const data = await response.json();

                    set({
                        subtotal: data.cart.subtotal,
                        shipping: data.cart.shipping,
                        total: data.cart.total,
                        itemCount: data.cart.itemCount,
                    });

                    window.dispatchEvent(new CustomEvent('cart-updated', {
                        detail: { itemCount: data.cart.itemCount }
                    }));

                } catch (error) {
                    // Revert on error
                    await get().fetchCart();
                    set({
                        error: error instanceof Error ? error.message : 'Error desconocido',
                    });
                }
            },

            clearCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/cart', {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Error al vaciar el carrito');
                    }

                    set({
                        ...initialState,
                        lastSynced: new Date(),
                    });

                    window.dispatchEvent(new CustomEvent('cart-updated', {
                        detail: { itemCount: 0 }
                    }));

                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error desconocido',
                    });
                }
            },

            applyCoupon: async (code: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/cart/coupon', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        set({ isLoading: false });
                        return { success: false, error: data.error || 'Cupón inválido' };
                    }

                    set({
                        couponCode: data.coupon.code,
                        subtotal: data.cart.subtotal,
                        discount: data.cart.discount,
                        shipping: data.cart.shipping,
                        total: data.cart.total,
                        isLoading: false,
                    });

                    return { success: true };

                } catch (error) {
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Error al aplicar cupón'
                    };
                }
            },

            removeCoupon: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/cart/coupon', {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Error al remover cupón');
                    }

                    const data = await response.json();

                    set({
                        couponCode: null,
                        discount: 0,
                        subtotal: data.cart.subtotal,
                        shipping: data.cart.shipping,
                        total: data.cart.total,
                        isLoading: false,
                    });

                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error desconocido',
                    });
                }
            },

            setLoading: (loading: boolean) => set({ isLoading: loading }),

            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'mexilux-cart',
            // Only persist essential data, not loading state
            partialize: (state) => ({
                items: state.items,
                subtotal: state.subtotal,
                discount: state.discount,
                shipping: state.shipping,
                total: state.total,
                couponCode: state.couponCode,
                itemCount: state.itemCount,
            }),
        }
    )
);

// Helper hook for cart count (for header)
export const useCartCount = () => useCartStore((state) => state.itemCount);

// Helper hook for cart total
export const useCartTotal = () => useCartStore((state) => state.total);
