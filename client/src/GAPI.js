export async function Inbox() {
    const response = await fetch(
        "https://127.0.0.1:8080/inbox",
        {
            credentials: "include"
        }
    );
    const result = await response.json();
    return result;
}