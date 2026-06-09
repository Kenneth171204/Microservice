package main

import (
    "fmt"
    "net/http"
    "net/http/httputil"
    "net/url"
    "strings"
)

func proxyRequest(targetPort string, prefix string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        targetURL, _ := url.Parse("http://localhost:" + targetPort)
        proxy := httputil.NewSingleHostReverseProxy(targetURL)

        r.URL.Path = strings.TrimPrefix(r.URL.Path, prefix)
        
        if r.URL.Path == "" {
            r.URL.Path = "/"
        }

        proxy.ServeHTTP(w, r)
    }
}

func main() {
    http.HandleFunc("/api/user/", proxyRequest("8001", "/api/user"))
    http.HandleFunc("/api/restaurant/", proxyRequest("8002", "/api/restaurant"))
    http.HandleFunc("/api/order/", proxyRequest("8003", "/api/order"))
    http.HandleFunc("/api/delivery/", proxyRequest("8004", "/api/delivery"))

    fmt.Println("API Gateway siap mengarahkan lalu lintas di port 8080...")
    http.ListenAndServe(":8080", nil)
}