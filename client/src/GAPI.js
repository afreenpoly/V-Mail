export async function Inbox() {
    const response = await fetch(
        "http://localhost:5000/inbox",
        {
            headers: {'Content-Type': 'application/json'},
            method: "GET",
        }
    );
    const result = await response.json();
    return result;
}