import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET: Fetch all posts from the database
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT id, title, slug, logo_base64, cover_photo_base64, symbol, chain, dex, category, launch_type, platform, launch_date, launch_time
      FROM posts
      ORDER BY created_at DESC
    `);
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}



// POST: Insert a new post into the database

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      symbol,
      chain,
      dex,
      category,
      launch_type,
      platform,
      launch_date,
      launch_time,
    } = body;

    // Validation
    if (
      !title?.trim() ||
      !symbol?.trim() ||
      !chain?.trim() ||
      !dex?.trim() ||
      !category?.trim() ||
      !launch_type?.trim() ||
      !platform?.trim() ||
      !launch_date?.trim() ||
      !launch_time?.trim()
    ) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = `${chain.trim().toLowerCase().replace(/ /g, '-')}-${title
      .trim()
      .toLowerCase()
      .replace(/ /g, '-')}-${Date.now()}`;

    // Insert into the database
    const client = await pool.connect();
    await client.query(
      `
      INSERT INTO posts (title, symbol, chain, dex, category, launch_type, platform, launch_date, launch_time, slug)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        title.trim(),
        symbol.trim(),
        chain.trim(),
        dex.trim(),
        category.trim(),
        launch_type.trim(),
        platform.trim(),
        launch_date.trim(),
        launch_time.trim(),
        slug, // Add slug
      ]
    );
    client.release();

    return NextResponse.json({ message: 'Post added successfully!' });
  } catch (error) {
    console.error('Error adding post:', error);
    return NextResponse.json({ error: 'Failed to add post' }, { status: 500 });
  }
}
