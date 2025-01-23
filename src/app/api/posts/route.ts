import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const client = await pool.connect();
    await client.query('INSERT INTO posts (title) VALUES ($1)', [title.trim()]);
    client.release();

    return NextResponse.json({ message: 'Post added successfully!' });
  } catch (error) {
    console.error('Error adding post:', error);
    return NextResponse.json({ error: 'Failed to add post' }, { status: 500 });
  }
}
