import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'; // Import the NextRequest type
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

// Helper function to ensure URLs have the `https://` protocol
const ensureHttpsUrl = (url: string): string => {
  if (url.startsWith('https://')) {
    return url; // Valid HTTPS URL
  }
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://'); // Replace HTTP with HTTPS
  }
  return `https://${url}`; // Add HTTPS if no protocol is present
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Debugging: Log the incoming request body
    console.log('Received Body:', body);

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
      logo_base64,
      cover_photo_base64,
      socials,
      description,
    } = body;

    // Validation for required fields
    if (
      !title?.trim() ||
      !symbol?.trim() ||
      !chain?.trim() ||
      !dex?.trim() ||
      !category?.trim() ||
      !launch_type?.trim() ||
      !platform?.trim() ||
      !launch_date?.trim() ||
      !launch_time?.trim() ||
      !description?.trim() ||
      !logo_base64?.trim() || // Include logo as required
      !cover_photo_base64?.trim() // Include cover photo as required
    ) {
      return NextResponse.json(
        { error: 'Required fields are missing.' },
        { status: 400 }
      );
    }

    // Validate and normalize socials URLs to ensure HTTPS
    const validatedSocials = socials
      ? Object.keys(socials).reduce((acc, key) => {
          acc[key] = ensureHttpsUrl(socials[key]);
          return acc;
        }, {} as Record<string, string>)
      : null;

    const slug = `${chain.trim().toLowerCase().replace(/ /g, '-')}-${title
      .trim()
      .toLowerCase()
      .replace(/ /g, '-')}-${Date.now()}`;

    const client = await pool.connect();
    await client.query(
      `
      INSERT INTO posts (
        title, symbol, chain, dex, category, launch_type, platform,
        launch_date, launch_time, logo_base64, cover_photo_base64, socials,
        description, slug
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
        logo_base64.trim(),
        cover_photo_base64.trim(),
        validatedSocials ? JSON.stringify(validatedSocials) : null,
        description.trim(),
        slug,
      ]
    );
    client.release();

    return NextResponse.json({ message: 'Post added successfully!' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding post to database:', error.message);
      return NextResponse.json(
        { error: `Failed to add post: ${error.message}` },
        { status: 500 }
      );
    } else {
      console.error('Unknown error adding post:', error);
      return NextResponse.json(
        { error: 'Failed to add post due to an unknown error.' },
        { status: 500 }
      );
    }
  }
}


