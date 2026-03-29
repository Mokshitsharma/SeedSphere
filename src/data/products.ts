import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { initialProducts } from './initialProducts';

export { initialProducts };
export const products = initialProducts;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const firestoreProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    
    // If Firestore is empty, return initialProducts
    if (firestoreProducts.length === 0) {
      return initialProducts;
    }
    
    return firestoreProducts;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return initialProducts; // Fallback to initial products on error
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    // If not in Firestore, check initialProducts
    return initialProducts.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return initialProducts.find(p => p.id === id) || null;
  }
};

export const seedProducts = async () => {
  for (const product of initialProducts) {
    const { id, ...data } = product;
    await setDoc(doc(db, 'products', id), data);
  }
  console.log('Products seeded successfully');
};
