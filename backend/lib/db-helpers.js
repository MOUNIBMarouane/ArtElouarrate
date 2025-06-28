import { query, transaction } from './database.js';
import crypto from 'crypto';

// ID generators (like Prisma cuid)
export const generateId = () => crypto.randomUUID().replace(/-/g, '').substring(0, 25);
export const generateArtworkId = () => 'art_' + generateId();
export const generateCategoryId = () => 'cat_' + generateId();
export const generateUserId = () => 'usr_' + generateId();
export const generateAdminId = () => 'adm_' + generateId();

// Database helpers that mimic Prisma API
export const db = {
  // Categories
  category: {
    findMany: async (options = {}) => {
      let queryText = 'SELECT * FROM categories';
      let params = [];
      
      if (options.where) {
        const conditions = [];
        let paramIndex = 1;
        
        if (options.where.isActive !== undefined) {
          conditions.push(`"isActive" = $${paramIndex++}`);
          params.push(options.where.isActive);
        }
        
        if (conditions.length > 0) {
          queryText += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      if (options.orderBy) {
        const orderClauses = [];
        if (Array.isArray(options.orderBy)) {
          options.orderBy.forEach(order => {
            Object.entries(order).forEach(([field, direction]) => {
              orderClauses.push(`"${field}" ${direction.toUpperCase()}`);
            });
          });
        } else {
          Object.entries(options.orderBy).forEach(([field, direction]) => {
            orderClauses.push(`"${field}" ${direction.toUpperCase()}`);
          });
        }
        if (orderClauses.length > 0) {
          queryText += ' ORDER BY ' + orderClauses.join(', ');
        }
      }
      
      const result = await query(queryText, params);
      return result.rows;
    },
    
    findUnique: async (options) => {
      let queryText = 'SELECT * FROM categories WHERE ';
      let params = [];
      
      if (options.where.id) {
        queryText += 'id = $1';
        params.push(options.where.id);
      }
      
      const result = await query(queryText, params);
      return result.rows[0] || null;
    },
    
    create: async (options) => {
      const id = generateCategoryId();
      const now = new Date();
      
      const result = await query(`
        INSERT INTO categories (id, name, description, color, "isActive", "sortOrder", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        id,
        options.data.name,
        options.data.description || '',
        options.data.color || '#6366f1',
        options.data.isActive !== undefined ? options.data.isActive : true,
        options.data.sortOrder || 0,
        now,
        now
      ]);
      
      return result.rows[0];
    },
    
    count: async (options = {}) => {
      let queryText = 'SELECT COUNT(*) as count FROM categories';
      let params = [];
      
      if (options.where) {
        const conditions = [];
        let paramIndex = 1;
        
        if (options.where.isActive !== undefined) {
          conditions.push(`"isActive" = $${paramIndex++}`);
          params.push(options.where.isActive);
        }
        
        if (conditions.length > 0) {
          queryText += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      const result = await query(queryText, params);
      return parseInt(result.rows[0].count);
    }
  },
  
  // Artworks
  artwork: {
    findMany: async (options = {}) => {
      let queryText = `
        SELECT a.*, c.name as category_name, c.color as category_color
        FROM artworks a 
        LEFT JOIN categories c ON a."categoryId" = c.id
      `;
      let params = [];
      let paramIndex = 1;
      
      if (options.where) {
        const conditions = [];
        
        if (options.where.isActive !== undefined) {
          conditions.push(`a."isActive" = $${paramIndex++}`);
          params.push(options.where.isActive);
        }
        
        if (options.where.isFeatured !== undefined) {
          conditions.push(`a."isFeatured" = $${paramIndex++}`);
          params.push(options.where.isFeatured);
        }
        
        if (conditions.length > 0) {
          queryText += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      if (options.orderBy) {
        queryText += ' ORDER BY a."createdAt" DESC';
      }
      
      if (options.take) {
        queryText += ` LIMIT ${options.take}`;
      }
      
      const result = await query(queryText, params);
      
      // Transform to match Prisma format
      return result.rows.map(row => ({
        ...row,
        category: row.category_name ? {
          name: row.category_name,
          color: row.category_color
        } : null
      }));
    },
    
    findUnique: async (options) => {
      const result = await query(`
        SELECT a.*, c.name as category_name, c.color as category_color
        FROM artworks a 
        LEFT JOIN categories c ON a."categoryId" = c.id
        WHERE a.id = $1
      `, [options.where.id]);
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        ...row,
        category: row.category_name ? {
          name: row.category_name,
          color: row.category_color
        } : null
      };
    },
    
    create: async (options) => {
      const id = generateArtworkId();
      const now = new Date();
      
      const result = await query(`
        INSERT INTO artworks (id, name, description, price, "originalPrice", "categoryId", "isActive", "isFeatured", medium, dimensions, year, status, "viewCount", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        id,
        options.data.name,
        options.data.description,
        options.data.price,
        options.data.originalPrice || null,
        options.data.categoryId,
        options.data.isActive !== undefined ? options.data.isActive : true,
        options.data.isFeatured || false,
        options.data.medium || null,
        options.data.dimensions || null,
        options.data.year || null,
        options.data.status || 'available',
        0, // viewCount
        now,
        now
      ]);
      
      return result.rows[0];
    },
    
    count: async (options = {}) => {
      let queryText = 'SELECT COUNT(*) as count FROM artworks';
      let params = [];
      
      if (options.where && options.where.isActive !== undefined) {
        queryText += ' WHERE "isActive" = $1';
        params.push(options.where.isActive);
      }
      
      const result = await query(queryText, params);
      return parseInt(result.rows[0].count);
    }
  },
  
  // Users
  user: {
    findUnique: async (options) => {
      let queryText = 'SELECT * FROM users WHERE ';
      let params = [];
      
      if (options.where.id) {
        queryText += 'id = $1';
        params.push(options.where.id);
      } else if (options.where.email) {
        queryText += 'email = $1';
        params.push(options.where.email);
      }
      
      const result = await query(queryText, params);
      return result.rows[0] || null;
    },
    
    create: async (options) => {
      const id = generateUserId();
      const now = new Date();
      
      const result = await query(`
        INSERT INTO users (id, email, "firstName", "lastName", password, "isActive", "isEmailVerified", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        id,
        options.data.email,
        options.data.firstName,
        options.data.lastName,
        options.data.password,
        options.data.isActive !== undefined ? options.data.isActive : true,
        options.data.isEmailVerified || false,
        now,
        now
      ]);
      
      return result.rows[0];
    },
    
    count: async () => {
      const result = await query('SELECT COUNT(*) as count FROM users');
      return parseInt(result.rows[0].count);
    }
  },
  
  // Admins
  admin: {
    findUnique: async (options) => {
      let queryText = 'SELECT * FROM admins WHERE ';
      let params = [];
      
      if (options.where.id) {
        queryText += 'id = $1';
        params.push(options.where.id);
      } else if (options.where.email) {
        queryText += 'email = $1';
        params.push(options.where.email);
      }
      
      const result = await query(queryText, params);
      return result.rows[0] || null;
    },
    
    count: async () => {
      const result = await query('SELECT COUNT(*) as count FROM admins');
      return parseInt(result.rows[0].count);
    }
  }
};

export default db;
