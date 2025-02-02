import { useCallback, useState } from 'react';

interface CartItem {
  variantId: string;
  quantity: number;
}

export function useCart() {
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

  const createCart = useCallback(async () => {
    try {
      setIsLoading(true);
      // Changed the endpoint to match the documentation
      const response = await fetch(
        `https://storefront-api.fourthwall.com/v1/carts?storefront_token=${STOREFRONT_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Modified the request body to match the API requirements
          body: JSON.stringify({
            items: [], // Empty array for initial cart creation
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Cart creation error response:', errorText);
        throw new Error(`Failed to create cart: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cart creation response:', data); // Debug log
      setCartId(data.id);
      return data.id;
    } catch (error) {
      console.error('Detailed cart creation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      try {
        setIsLoading(true);
        let currentCartId = cartId;

        if (!currentCartId) {
          currentCartId = await createCart();
        }

        console.log('Adding to cart with ID:', currentCartId); // Debug log

        const response = await fetch(
          `https://storefront-api.fourthwall.com/v1/carts/${currentCartId}/add?storefront_token=${STOREFRONT_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [
                {
                  variantId,
                  quantity,
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Add to cart error response:', errorText);
          throw new Error(`Failed to add item to cart: ${response.status}`);
        }

        const updatedCart = await response.json();
        console.log('Add to cart response:', updatedCart); // Debug log
        return updatedCart;
      } catch (error) {
        console.error('Detailed add to cart error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, createCart]
  );

  return {
    cartId,
    isLoading,
    createCart,
    addToCart,
  };
}
