const BASE = 'http://localhost:3000';

async function testCommentAuth() {
    console.log('=== Testing Create Comment with Auth ===\n');

    // 1. Sign In
    console.log('1. Signing in as admin4@admin.com...');
    const loginRes = await fetch(`${BASE}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
            email: "admin4@admin.com",
            password: "password123"
        })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    // Capture cookies
    const cookie = loginRes.headers.get('set-cookie');
    console.log('Login successful. Cookie:', cookie ? 'Fetched' : 'Missing');

    // 2. Get Post ID
    console.log('\n2. Fetching Post ID...');
    const postsRes = await fetch(`${BASE}/posts`);
    const postsData = await postsRes.json() as any;

    if (!postsData.success || postsData.data.items.length === 0) {
        console.error('No posts found.');
        return;
    }

    const postId = postsData.data.items[0].id;
    console.log(`Using Post ID: ${postId}`);

    // 3. Create Comment
    console.log('\n3. Creating Comment...');
    const commentRes = await fetch(`${BASE}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie || '' // Pass session cookie
        },
        body: JSON.stringify({
            content: "Authenticated Comment Test",
            postId: postId
            // authorId should be inferred from session now
        })
    });

    const commentData = await commentRes.json();
    console.log('Response:', JSON.stringify(commentData, null, 2));
}

testCommentAuth();
