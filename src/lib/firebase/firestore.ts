import {
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { adminDb } from "./admin";

/**
 * Create a new document in a collection
 */
export async function createDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T,
): Promise<string> {
  const docRef = await adminDb.collection(collectionName).add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

/**
 * Get a single document by ID
 */
export async function getDocument<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const docRef = adminDb.collection(collectionName).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() } as T;
}

/**
 * Update a document by ID
 */
export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: Partial<T>,
): Promise<void> {
  const docRef = adminDb.collection(collectionName).doc(id);
  await docRef.update({
    ...data,
    updatedAt: new Date(),
  });
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(
  collectionName: string,
  id: string,
): Promise<void> {
  const docRef = adminDb.collection(collectionName).doc(id);
  await docRef.delete();
}

/**
 * Query documents with filters
 */
export async function queryDocuments<T>(
  collectionName: string,
  filters: Record<string, unknown> = {},
  orderByField?: string,
  limitCount?: number,
): Promise<T[]> {
  let queryRef: Query = adminDb.collection(collectionName);

  // Apply filters
  Object.entries(filters).forEach(([field, value]) => {
    if (value !== undefined && value !== null) {
      queryRef = queryRef.where(field, "==", value);
    }
  });

  // Apply ordering
  if (orderByField) {
    queryRef = queryRef.orderBy(orderByField, "desc");
  }

  // Apply limit
  if (limitCount) {
    queryRef = queryRef.limit(limitCount);
  }

  const snapshot = await queryRef.get();
  return snapshot.docs.map(
    (doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }) as T,
  );
}

/**
 * Query documents with complex filters
 */
export async function queryDocumentsAdvanced<T>(
  collectionName: string,
  queryBuilder: (ref: CollectionReference) => Query,
): Promise<T[]> {
  const collectionRef = adminDb.collection(collectionName);
  const queryRef = queryBuilder(collectionRef);
  const snapshot = await queryRef.get();
  return snapshot.docs.map(
    (doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }) as T,
  );
}

/**
 * Count documents in a collection with filters
 */
export async function countDocuments(
  collectionName: string,
  filters: Record<string, unknown> = {},
): Promise<number> {
  let queryRef: Query | CollectionReference =
    adminDb.collection(collectionName);

  Object.entries(filters).forEach(([field, value]) => {
    if (value !== undefined && value !== null) {
      queryRef = queryRef.where(field, "==", value);
    }
  });

  const snapshot = await queryRef.get();
  return snapshot.size;
}

/**
 * Check if document exists
 */
export async function documentExists(
  collectionName: string,
  id: string,
): Promise<boolean> {
  const docRef = adminDb.collection(collectionName).doc(id);
  const doc = await docRef.get();
  return doc.exists;
}

/**
 * Batch create documents
 */
export async function batchCreateDocuments<T extends Record<string, unknown>>(
  collectionName: string,
  documents: T[],
): Promise<string[]> {
  const batch = adminDb.batch();
  const ids: string[] = [];

  documents.forEach((data) => {
    const docRef = adminDb.collection(collectionName).doc();
    ids.push(docRef.id);
    batch.set(docRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  await batch.commit();
  return ids;
}

/**
 * Batch update documents
 */
export async function batchUpdateDocuments(
  collectionName: string,
  updates: Array<{ id: string; data: Record<string, unknown> }>,
): Promise<void> {
  const batch = adminDb.batch();

  updates.forEach(({ id, data }) => {
    const docRef = adminDb.collection(collectionName).doc(id);
    batch.update(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  });

  await batch.commit();
}

/**
 * Batch delete documents
 */
export async function batchDeleteDocuments(
  collectionName: string,
  ids: string[],
): Promise<void> {
  const batch = adminDb.batch();

  ids.forEach((id) => {
    const docRef = adminDb.collection(collectionName).doc(id);
    batch.delete(docRef);
  });

  await batch.commit();
}
