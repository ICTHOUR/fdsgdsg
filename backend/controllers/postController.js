const db = require('../config/db');
const slugify = require('slugify');

/**
 * Helper to generate URL-safe slug for Bangla and English text
 */
function createSlug(text) {
  if (!text) return `news-${Date.now()}`;
  // For English characters use slugify, for Bangla keep clean unicode dashes
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[\s\t\n]+/g, '-')
    .replace(/[^\w\u0980-\u09FF-]+/g, '')
    .replace(/--+/g, '-');
  return `${clean || 'news'}-${Date.now().toString().slice(-6)}`;
}

/**
 * @desc Get all news posts with pagination, category/tag/status filters & fulltext search
 * @route GET /api/v1/posts
 */
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const offset = (page - 1) * limit;

    const {
      category_id,
      category_slug,
      subcategory_id,
      tag_slug,
      status = 'published',
      is_lead,
      is_breaking,
      is_special,
      search,
      sort_by = 'published_at',
      order = 'DESC',
    } = req.query;

    let whereClauses = ['1=1'];
    let params = [];

    if (status !== 'all') {
      whereClauses.push('p.status = ?');
      params.push(status);
    }

    if (category_id) {
      whereClauses.push('p.category_id = ?');
      params.push(category_id);
    }

    if (category_slug) {
      whereClauses.push('c.slug = ?');
      params.push(category_slug);
    }

    if (subcategory_id) {
      whereClauses.push('p.subcategory_id = ?');
      params.push(subcategory_id);
    }

    if (is_lead !== undefined) {
      whereClauses.push('p.is_lead = ?');
      params.push(is_lead === 'true' || is_lead === '1' ? 1 : 0);
    }

    if (is_breaking !== undefined) {
      whereClauses.push('p.is_breaking = ?');
      params.push(is_breaking === 'true' || is_breaking === '1' ? 1 : 0);
    }

    if (is_special !== undefined) {
      whereClauses.push('p.is_special = ?');
      params.push(is_special === 'true' || is_special === '1' ? 1 : 0);
    }

    if (search) {
      whereClauses.push('(p.title LIKE ? OR p.summary LIKE ? OR p.content LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (tag_slug) {
      whereClauses.push(`p.id IN (
        SELECT pt.post_id FROM post_tags pt 
        JOIN tags t ON pt.tag_id = t.id 
        WHERE t.slug = ?
      )`);
      params.push(tag_slug);
    }

    const whereSql = whereClauses.join(' AND ');
    const allowedSortColumns = ['published_at', 'created_at', 'views', 'id'];
    const safeSort = allowedSortColumns.includes(sort_by) ? `p.${sort_by}` : 'p.published_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count Total
    const [countRows] = await db.query(
      `SELECT COUNT(DISTINCT p.id) as total 
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    // Fetch Posts
    const querySql = `
      SELECT 
        p.id, p.title, p.slug, p.summary, p.image, p.image_caption, p.video_url,
        p.views, p.is_lead, p.is_sub_lead, p.is_breaking, p.is_special, p.status,
        p.published_at, p.created_at,
        c.id AS category_id, c.name_bn AS category_name_bn, c.name_en AS category_name_en, c.slug AS category_slug, c.color_code AS category_color,
        sc.id AS subcategory_id, sc.name_bn AS subcategory_name_bn, sc.slug AS subcategory_slug,
        u.id AS reporter_id, u.name AS reporter_name, u.avatar AS reporter_avatar, u.designation AS reporter_designation
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN users u ON p.reporter_id = u.id
      WHERE ${whereSql}
      ORDER BY ${safeSort} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const [posts] = await db.query(querySql, [...params, limit, offset]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single post by slug or ID with related tags & increment view counter
 * @route GET /api/v1/posts/:slugOrId
 */
exports.getPostBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const isNumeric = /^\d+$/.test(slugOrId);

    const condition = isNumeric ? 'p.id = ?' : 'p.slug = ?';

    const [rows] = await db.query(
      `SELECT 
        p.*,
        c.name_bn AS category_name_bn, c.name_en AS category_name_en, c.slug AS category_slug, c.color_code AS category_color,
        sc.name_bn AS subcategory_name_bn, sc.slug AS subcategory_slug,
        u.name AS reporter_name, u.avatar AS reporter_avatar, u.designation AS reporter_designation, u.bio AS reporter_bio
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN users u ON p.reporter_id = u.id
      WHERE ${condition}
      LIMIT 1`,
      [slugOrId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'সংবাদটি খুঁজে পাওয়া যায়নি (News article not found)',
      });
    }

    const post = rows[0];

    // Atomically increment views
    await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [post.id]);
    post.views = Number(post.views) + 1;

    // Fetch Associated Tags
    const [tags] = await db.query(
      `SELECT t.id, t.name_bn, t.name_en, t.slug 
       FROM tags t
       JOIN post_tags pt ON t.id = pt.tag_id
       WHERE pt.post_id = ?`,
      [post.id]
    );
    post.tags = tags;

    // Fetch Related News in same category
    const [relatedPosts] = await db.query(
      `SELECT id, title, slug, image, published_at, views 
       FROM posts 
       WHERE category_id = ? AND id != ? AND status = 'published'
       ORDER BY published_at DESC LIMIT 5`,
      [post.category_id, post.id]
    );
    post.related_posts = relatedPosts;

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new news post
 * @route POST /api/v1/posts
 * @access Admin, Reporter
 */
exports.createPost = async (req, res, next) => {
  try {
    const {
      title,
      summary,
      content,
      category_id,
      subcategory_id,
      video_url,
      image_caption,
      is_lead = 0,
      is_sub_lead = 0,
      is_breaking = 0,
      is_special = 0,
      status = 'published',
      tags = [], // array of tag IDs or strings
    } = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'শিরোনাম, মূল সংবাদ এবং ক্যাটাগরি আবশ্যক (Title, content and category are required)',
      });
    }

    const slug = createSlug(title);
    const reporter_id = req.user ? req.user.id : 1;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || null;

    const result = await db.executeTransaction(async (conn) => {
      // If setting this post as lead, optionally demote previous lead
      if (Number(is_lead) === 1) {
        await conn.query('UPDATE posts SET is_lead = 0 WHERE is_lead = 1');
      }

      const [insertResult] = await conn.query(
        `INSERT INTO posts (
          title, slug, summary, content, category_id, subcategory_id, 
          reporter_id, image, image_caption, video_url, 
          is_lead, is_sub_lead, is_breaking, is_special, status, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          title,
          slug,
          summary || null,
          content,
          category_id,
          subcategory_id || null,
          reporter_id,
          image,
          image_caption || null,
          video_url || null,
          is_lead ? 1 : 0,
          is_sub_lead ? 1 : 0,
          is_breaking ? 1 : 0,
          is_special ? 1 : 0,
          status,
        ]
      );

      const postId = insertResult.insertId;

      // Attach tags if provided
      if (Array.isArray(tags) && tags.length > 0) {
        for (const tagItem of tags) {
          let tagId = tagItem;
          // If tag is a string name, insert or get
          if (typeof tagItem === 'string' && isNaN(Number(tagItem))) {
            const tagSlug = createSlug(tagItem);
            const [tResult] = await conn.query(
              'INSERT INTO tags (name_bn, name_en, slug) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
              [tagItem, tagItem, tagSlug]
            );
            tagId = tResult.insertId;
          }
          if (tagId) {
            await conn.query(
              'INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)',
              [postId, tagId]
            );
          }
        }
      }

      return postId;
    });

    res.status(201).json({
      success: true,
      message: 'সংবাদ সফলভাবে প্রকাশিত হয়েছে (News article published successfully)',
      postId: result,
      slug,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update an existing news post
 * @route PUT /api/v1/posts/:id
 * @access Admin, Reporter (Owner)
 */
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      content,
      category_id,
      subcategory_id,
      video_url,
      image_caption,
      is_lead,
      is_sub_lead,
      is_breaking,
      is_special,
      status,
      tags,
    } = req.body;

    const [existing] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'সংবাদটি পাওয়া যায়নি' });
    }

    const current = existing[0];
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || current.image;

    await db.executeTransaction(async (conn) => {
      if (is_lead !== undefined && Number(is_lead) === 1) {
        await conn.query('UPDATE posts SET is_lead = 0 WHERE is_lead = 1 AND id != ?', [id]);
      }

      await conn.query(
        `UPDATE posts SET 
          title = COALESCE(?, title),
          summary = COALESCE(?, summary),
          content = COALESCE(?, content),
          category_id = COALESCE(?, category_id),
          subcategory_id = ?,
          image = ?,
          image_caption = COALESCE(?, image_caption),
          video_url = COALESCE(?, video_url),
          is_lead = COALESCE(?, is_lead),
          is_sub_lead = COALESCE(?, is_sub_lead),
          is_breaking = COALESCE(?, is_breaking),
          is_special = COALESCE(?, is_special),
          status = COALESCE(?, status)
        WHERE id = ?`,
        [
          title,
          summary,
          content,
          category_id,
          subcategory_id !== undefined ? subcategory_id : current.subcategory_id,
          image,
          image_caption,
          video_url,
          is_lead,
          is_sub_lead,
          is_breaking,
          is_special,
          status,
          id,
        ]
      );

      if (Array.isArray(tags)) {
        await conn.query('DELETE FROM post_tags WHERE post_id = ?', [id]);
        for (const tagId of tags) {
          if (tagId) {
            await conn.query('INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [id, tagId]);
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'সংবাদ সফলভাবে আপডেট হয়েছে (Article updated successfully)',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a news post
 * @route DELETE /api/v1/posts/:id
 * @access Admin only
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'সংবাদটি পাওয়া যায়নি' });
    }

    res.json({
      success: true,
      message: 'সংবাদটি সফলভাবে মুছে ফেলা হয়েছে (Article deleted successfully)',
    });
  } catch (error) {
    next(error);
  }
};
