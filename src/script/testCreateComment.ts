const BASE_URL = 'http://localhost:3000';

async function testCreateComment() {
    console.log('=== Testing Create Comment ===\n');

    // 1. Get a valid Post ID and Author ID (User ID)
    const postsRes = await fetch(`${BASE_URL}/posts`);
    const postsData = await postsRes.json() as any;

    if (!postsData.success || postsData.data.items.length === 0) {
        console.error('No posts found to comment on.');
        return;
    }

    const postId = postsData.data.items[0].id;
    const authorId = postsData.data.items[0].authorID; // Using exist post author as comment author for test

    console.log(`Using Post ID: ${postId}`);
    console.log(`Using Author ID: ${authorId}`);

    // 2. Send POST request
    const payload = {
        content: "Root Comment Verified",
        postId: postId,
        authorId: authorId // Manually provided since auth is disabled
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    const res = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('\nResponse:', JSON.stringify(data, null, 2));
}

testCreateComment();
