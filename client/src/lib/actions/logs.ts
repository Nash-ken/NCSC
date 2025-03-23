import { verifySession } from "../dal";

export const fetchLogs = async () => {
    const session = await verifySession(); 
    if (!session?.isAuth) return { error: { message: "User not authenticated" } };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/logs/all`, {
            headers: { Authorization: `Bearer ${session.cookie}` },
        });

        if (!response.ok) return { error: { message: "Failed to fetch logs from server" } };

        const data = await response.json();
        if (!Array.isArray(data)) return { error: { message: "Invalid log data format" } };

        const transformedData = data.map((log: any) => ({
            id: log.id.toString(),                // Ensure the ID is a string
            type: log.Type,                       // Map to 'type'
            user: log.User,                       // Map to 'user'
            source: log.Source,                   // Map to 'source'
            state: log.State,                     // Map to 'state'
            activity: log.Activity,               // Map to 'activity'
            browser: log.Browser,                 // Map to 'browser'
            createdAt: log.createdAt,             // Map to 'createdAt'
          }));

        return transformedData;
    } catch (error: any) {
        return { error: { message: "Error fetching logs: " + error.message } };
    }
};