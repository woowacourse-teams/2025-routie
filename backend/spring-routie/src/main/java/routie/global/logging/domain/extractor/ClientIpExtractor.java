package routie.global.logging.domain.extractor;

import jakarta.servlet.http.HttpServletRequest;

public final class ClientIpExtractor {

    private static final String UNKNOWN_IP = "unknown";
    private static final String[] IP_HEADERS = {
            "X-Forwarded-For", "X-Real-IP", "Proxy-Client-IP", "WL-Proxy-Client-IP"
    };

    public static String extractClientIp(final HttpServletRequest request) {
        for (final String header : IP_HEADERS) {
            String ip = request.getHeader(header);
            if (isValidIp(ip)) {
                return ip.split(",")[0].trim();
            }
        }

        String remoteAddr = request.getRemoteAddr();
        return remoteAddr == null ? UNKNOWN_IP : remoteAddr;
    }

    private static boolean isValidIp(final String ip) {
        return ip != null && !ip.isEmpty() && !UNKNOWN_IP.equalsIgnoreCase(ip);
    }
}
