package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func proxyRequest(targetPort string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		targetURL, _ := url.Parse("http://localhost:" + targetPort)
		proxy := httputil.NewSingleHostReverseProxy(targetURL)
		proxy.ServeHTTP(w, r)
	}
}

func main() {
	http.HandleFunc("/api/user/", proxyRequest("8001"))
	http.HandleFunc("/api/restaurant/", proxyRequest("8002"))
	http.HandleFunc("/api/order/", proxyRequest("8003"))
	http.HandleFunc("/api/delivery/", proxyRequest("8004"))

	fmt.Println("API Gateway siap mengarahkan lalu lintas di port 8080...")
	http.ListenAndServe(":8080", nil)
}