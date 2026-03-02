/**
 * HTTP Client with timeout, redirect following, and error handling
 */

export interface HttpResponse {
    url: string; // final URL after redirects
    status: number;
    ok: boolean;
    html: string;
    error?: string;
}

const DEFAULT_TIMEOUT = 5000; // 5 seconds

export async function httpGet(
    url: string,
    timeout = DEFAULT_TIMEOUT
): Promise<HttpResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "Cache-Control": "no-cache",
            },
        });

        const html = await response.text();

        return {
            url: response.url,
            status: response.status,
            ok: response.status >= 200 && response.status < 400,
            html,
        };
    } catch (err) {
        const error = err as Error;

        if (error.name === "AbortError") {
            return { url, status: 0, ok: false, html: "", error: "TIMEOUT" };
        }

        return {
            url,
            status: 0,
            ok: false,
            html: "",
            error: error.message || "NETWORK_ERROR",
        };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Check if a domain/subdomain resolves (via a quick fetch)
 */
export async function checkDns(hostname: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`https://${hostname}`, {
            method: "HEAD",
            redirect: "follow",
            signal: controller.signal,
        });

        clearTimeout(timer);
        return response.status > 0;
    } catch {
        return false;
    }
}
