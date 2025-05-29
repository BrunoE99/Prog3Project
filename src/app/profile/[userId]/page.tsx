export default async function UserInformation({ 
    params, 
}: {
    params: Promise<{ userId: string }>;
}) {
    // I need to make a GET with the ID of the user I want to display, and show that information on the profile page.

    const userId = (await params).userId;
    return <p>This is the user information {userId}</p>
}