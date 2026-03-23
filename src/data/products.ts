import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { initialProducts } from './initialProducts';

export { initialProducts };
export const products = initialProducts;

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
};

export const seedProducts = async () => {
  for (const product of initialProducts) {
    const { id, ...data } = product;
    await setDoc(doc(db, 'products', id), data);
  }
  console.log('Products seeded successfully');
};
