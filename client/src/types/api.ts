export interface Drop {
  id: number;
  name: string;
  price: number;
  totalStock: number;
  availableStock: number;
  Purchases: Purchase[];
}

export interface User {
  id: number;
  username: string;
}

export interface Purchase {
  id: number;
  purchasedAt: Date;
  user: User;
}

export interface Reservation {
  id: number;
  status: 'reserved' | 'purchased' | 'expired';
  expiresAt: Date;
}
