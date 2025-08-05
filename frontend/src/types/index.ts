export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    displayName: string;
    avatar?: string;
    bio?: string;
    location?: string;
    joinDate: Date;
  };
  gameCollection: CollectionItem[];
  wishlist: WishlistItem[];
  reputation: {
    rating: number;
    totalRatings: number;
    completedTransactions: number;
  };
}

export interface Game {
  _id: string;
  title: string;
  platform: string;
  releaseDate?: Date;
  developer?: string;
  publisher?: string;
  genres: string[];
  description?: string;
  coverImage?: string;
  screenshots?: string[];
  barcode?: string;
  region?: string;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Ultra Rare';
  averageRating?: number;
  variations?: GameVariation[];
}

export interface GameVariation {
  name: string;
  description: string;
  barcode?: string;
  coverImage?: string;
}

export interface CollectionItem {
  _id: string;
  game: Game;
  condition: 'Mint' | 'Near Mint' | 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  completeness: 'CIB' | 'No Manual' | 'Cart Only' | 'Disc Only' | 'Digital';
  notes?: string;
  purchasePrice?: number;
  purchaseDate?: Date;
  forSale: boolean;
  salePrice?: number;
  photos?: string[];
  addedDate: Date;
}

export interface WishlistItem {
  _id: string;
  game: Game;
  priority: 'Low' | 'Medium' | 'High';
  maxPrice?: number;
  notes?: string;
  addedDate: Date;
}

export interface MarketplaceListing {
  _id: string;
  seller: Pick<User, 'id' | 'username' | 'profile' | 'reputation'>;
  game: Game;
  title: string;
  description?: string;
  condition: string;
  completeness: string;
  price: number;
  shipping: {
    price?: number;
    methods?: string[];
    estimatedDays?: string;
  };
  photos: string[];
  status: 'Active' | 'Sold' | 'Cancelled' | 'Pending';
  views: number;
  watchers: string[];
  offers: Offer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  _id: string;
  buyer: Pick<User, 'id' | 'username'>;
  amount: number;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  createdAt: Date;
}