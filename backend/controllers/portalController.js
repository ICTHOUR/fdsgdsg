const db = require('../config/db');

/**
 * @desc Get Breaking News Ticker (সর্বশেষ ব্রেকিং নিউজ)
 * @route GET /api/v1/portal/breaking
 */
exports.getBreakingNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await db.query(
      `SELECT id, title, slug, published_at, category_id
       FROM posts 
       WHERE is_breaking = 1 AND status = 'published'
       ORDER BY published_at DESC 
       LIMIT ?`,
      [limit]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Top Lead News and Sub-Leads (প্রধান শিরোনাম ও উপ-প্রধান খবর)
 * @route GET /api/v1/portal/lead
 */
exports.getLeadNews = async (req, res, next) => {
  try {
    // 1. Fetch Main Lead (1 post)
    const [mainLead] = await db.query(
      `SELECT p.id, p.title, p.slug, p.summary, p.image, p.published_at, p.views,
              c.name_bn AS category_name_bn, c.slug AS category_slug, c.color_code AS category_color,
              u.name AS reporter_name
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.reporter_id = u.id
       WHERE p.is_lead = 1 AND p.status = 'published'
       ORDER BY p.published_at DESC 
       LIMIT 1`
    );

    // Fallback to latest post if no explicit is_lead
    const mainLeadPost = mainLead.length > 0 ? mainLead[0] : null;

    // 2. Fetch Sub Leads (4 posts)
    const [subLeads] = await db.query(
      `SELECT p.id, p.title, p.slug, p.summary, p.image, p.published_at, p.views,
              c.name_bn AS category_name_bn, c.slug AS category_slug, c.color_code AS category_color
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE (p.is_sub_lead = 1 OR (p.is_lead = 0 AND p.id != ?)) AND p.status = 'published'
       ORDER BY p.published_at DESC 
       LIMIT 4`,
      [mainLeadPost ? mainLeadPost.id : 0]
    );

    // 3. Fetch Side Latest Headlines (5 items)
    const [latestSide] = await db.query(
      `SELECT p.id, p.title, p.slug, p.published_at, c.name_bn AS category_name_bn
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC 
       LIMIT 6`
    );

    res.json({
      success: true,
      data: {
        main_lead: mainLeadPost,
        sub_leads: subLeads,
        latest_headlines: latestSide,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Most Read News (সর্বাধিক পঠিত)
 * @route GET /api/v1/portal/most-read
 * @query timeframe=24h | 7d | all
 */
exports.getMostRead = async (req, res, next) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit) || 8);
    const timeframe = req.query.timeframe || '7d';

    let intervalSql = '';
    if (timeframe === '24h') {
      intervalSql = 'AND p.published_at >= NOW() - INTERVAL 1 DAY';
    } else if (timeframe === '7d') {
      intervalSql = 'AND p.published_at >= NOW() - INTERVAL 7 DAY';
    } else if (timeframe === '30d') {
      intervalSql = 'AND p.published_at >= NOW() - INTERVAL 30 DAY';
    }

    const [rows] = await db.query(
      `SELECT p.id, p.title, p.slug, p.image, p.views, p.published_at,
              c.name_bn AS category_name_bn, c.slug AS category_slug, c.color_code AS category_color
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published' ${intervalSql}
       ORDER BY p.views DESC, p.published_at DESC 
       LIMIT ?`,
      [limit]
    );

    res.json({
      success: true,
      timeframe,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Video Gallery (ভিডিও গ্যালারি)
 * @route GET /api/v1/portal/videos
 */
exports.getVideoGallery = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const [rows] = await db.query(
      `SELECT p.id, p.title, p.slug, p.video_url, p.image, p.published_at, p.views,
              c.name_bn AS category_name_bn
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE p.video_url IS NOT NULL AND TRIM(p.video_url) != '' AND p.status = 'published'
       ORDER BY p.published_at DESC 
       LIMIT ?`,
      [limit]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Trending Tags (ট্রেন্ডিং টপিকস)
 * @route GET /api/v1/portal/trending-tags
 */
exports.getTrendingTags = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT t.id, t.name_bn, t.name_en, t.slug, t.is_trending, COUNT(pt.post_id) AS post_count
       FROM tags t
       LEFT JOIN post_tags pt ON t.id = pt.tag_id
       GROUP BY t.id
       ORDER BY t.is_trending DESC, post_count DESC
       LIMIT 12`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Complete Homepage Aggregated Bundle (হোমপেজ অল-ইন-ওয়ান বান্ডিল)
 * Optimizes mobile and desktop page loads by returning lead, breaking, categories, most read, and ads in 1 payload
 * @route GET /api/v1/portal/home
 */
exports.getHomeBundle = async (req, res, next) => {
  try {
    // 1. Breaking
    const [breaking] = await db.query(
      "SELECT id, title, slug FROM posts WHERE is_breaking = 1 AND status = 'published' ORDER BY published_at DESC LIMIT 8"
    );

    // 2. Lead & Sub leads
    const [leadNews] = await db.query(
      `SELECT p.id, p.title, p.slug, p.summary, p.image, p.published_at, p.views,
              c.name_bn AS category_name_bn, c.slug AS category_slug, c.color_code AS category_color
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published'
       ORDER BY p.is_lead DESC, p.published_at DESC 
       LIMIT 5`
    );

    // 3. Most read
    const [mostRead] = await db.query(
      `SELECT p.id, p.title, p.slug, p.image, p.views, p.published_at,
              c.name_bn AS category_name_bn, c.slug AS category_slug
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published'
       ORDER BY p.views DESC LIMIT 8`
    );

    // 4. Category-wise latest 4 news each (National, Politics, Sports, Entertainment, Economy, Chattogram)
    const [categories] = await db.query(
      "SELECT id, name_bn, name_en, slug, color_code FROM categories WHERE status = 'active' ORDER BY order_index ASC LIMIT 8"
    );

    const categoryNews = {};
    for (const cat of categories) {
      const [catPosts] = await db.query(
        `SELECT id, title, slug, summary, image, published_at, views 
         FROM posts 
         WHERE category_id = ? AND status = 'published' 
         ORDER BY published_at DESC LIMIT 4`,
        [cat.id]
      );
      categoryNews[cat.slug] = {
        category: cat,
        posts: catPosts,
      };
    }

    // 5. Active Ads
    const [ads] = await db.query(
      "SELECT id, title, slot, type, image_url, redirect_url, ad_code FROM ads WHERE status = 'active'"
    );

    res.json({
      success: true,
      data: {
        breaking_ticker: breaking,
        lead_section: {
          main: leadNews[0] || null,
          sub_leads: leadNews.slice(1, 5),
        },
        most_read: mostRead,
        categories_news: categoryNews,
        ads,
      },
    });
  } catch (error) {
    next(error);
  }
};
