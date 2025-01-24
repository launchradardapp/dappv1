import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `
      SELECT id, title, symbol, chain, dex, category, launch_type, platform, launch_date, launch_time,
             logo_base64, cover_photo_base64, description, socials, contract_address
      FROM posts
      WHERE id = $1
      `,
      [id]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ error: 'Failed to fetch project details' }, { status: 500 });
  }
}
