type ApiResponse = {
    success: boolean;
    message: string;
    data: {
        items: Array<{
            title: string;
            createdAt: string;
            [key: string]: any;
        }>;
        total: number;
        searchQuery: string | null;
        tags: string[];
    };
};

const BASE_URL = 'http://localhost:3000/posts';

async function testPagination() {
    console.log('--- Testing Pagination & Sorting ---');

    console.log('\n1. Testing Default Pagination (Page 1, Limit 10, Default Sort)');
    try {
        const res = await fetch(`${BASE_URL}`);
        const data = await res.json() as ApiResponse;
        console.log(`Status: ${res.status}`);
        if (data.success) {
            console.log(`Returned Items: ${data.data.items.length}`);
            console.log(`Total: ${data.data.total}`);
            if (data.data.items.length > 0) {
                console.log(`First Item Title: ${data.data.items[0].title}`);
                console.log(`First Item CreatedAt: ${data.data.items[0].createdAt}`);
            }
        } else {
            console.log('Error:', data);
        }
    } catch (e) {
        console.error('Test 1 Failed:', e);
    }

    console.log('\n2. Testing Custom Page & Limit (Page 2, Limit 2)');
    try {
        const res = await fetch(`${BASE_URL}?page=2&limit=2`);
        const data = await res.json() as ApiResponse;
        console.log(`Status: ${res.status}`);
        if (data.success) {
            console.log(`Returned Items: ${data.data.items.length}`);
            if (data.data.items.length > 0) {
                console.log(`First Item Title: ${data.data.items[0].title}`);
            }
        } else {
            console.log('Error:', data);
        }
    } catch (e) {
        console.error('Test 2 Failed:', e);
    }

    console.log('\n3. Testing Sorting (SortBy Title, SortOrder Asc)');
    try {
        const res = await fetch(`${BASE_URL}?sortBy=title&sortOrder=asc&limit=5`);
        const data = await res.json() as ApiResponse;
        console.log(`Status: ${res.status}`);
        if (data.success) {
            console.log(`Returned Items: ${data.data.items.length}`);
            if (data.data.items.length > 0) {
                console.log(`First Item Title: ${data.data.items[0].title}`);
            }
            if (data.data.items.length > 1) {
                console.log(`Second Item Title: ${data.data.items[1].title}`);
            }
        } else {
            console.log('Error:', data);
        }
    } catch (e) {
        console.error('Test 3 Failed:', e);
    }
}

testPagination();
