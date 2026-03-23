export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Vegetables' | 'Fruits' | 'Flowers' | 'Grains';
  image: string;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  items: CartItem[];
  total: number;
  orderId: string;
  date: string;
}
