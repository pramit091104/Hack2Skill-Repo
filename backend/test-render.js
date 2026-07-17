async function test() {
  try {
    const res = await fetch('https://nutrismart-ai-backend-x6ub.onrender.com/api/v1/ai/analyze/image', {
      method: 'POST',
      body: JSON.stringify({ base64Image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/" }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log(res.status, data);
  } catch (err) {
    console.error(err);
  }
}
test();
