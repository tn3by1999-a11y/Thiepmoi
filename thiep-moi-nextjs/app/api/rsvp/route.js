import Redis from 'ioredis';
import { NextResponse } from 'next/server';

// Khởi tạo Redis client trực tiếp từ REDIS_URL
let redis;
function getRedis() {
  if (!redis) {
    const connectionString = process.env.REDIS_URL;
    if (!connectionString) {
      throw new Error("Chưa cấu hình biến môi trường REDIS_URL!");
    }
    redis = new Redis(connectionString, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
    });
  }
  return redis;
}

export async function GET() {
  try {
    const client = getRedis();
    const rawList = await client.get('thiep_rsvp_entries');
    let entries = [];
    if (rawList) {
      entries = typeof rawList === 'string' ? JSON.parse(rawList) : rawList;
    }
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Lỗi GET RSVP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = getRedis();
    const body = await request.json();
    const { action, name, status } = body;

    const rawList = await client.get('thiep_rsvp_entries');
    let entries = [];
    if (rawList) {
      entries = typeof rawList === 'string' ? JSON.parse(rawList) : rawList;
    }

    if (action === 'DELETE') {
      const key = (name || '').toLowerCase();
      entries = entries.filter((e) => e.name.toLowerCase() !== key);
    } else {
      const n = (name || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      if (!n) {
        return NextResponse.json({ success: false, message: 'Vui lòng nhập tên' }, { status: 400 });
      }
      const key = n.toLowerCase();
      entries = entries.filter((e) => e.name.toLowerCase() !== key);
      entries.push({ name: n, status, at: Date.now() });
    }

    await client.set('thiep_rsvp_entries', JSON.stringify(entries));
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Lỗi POST RSVP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}