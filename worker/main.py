from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from openai import OpenAI

HOST = "0.0.0.0"
PORT = 8000

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_tiktok_script(product: str) -> str:
    prompt = f"""
Tu es un expert TikTok Ads et UGC.

Produit : {product}

Écris un script TikTok viral en français pour vendre ce produit.
Règles :
- court
- concret
- orienté vente
- 5 à 8 lignes max
- avec hook + problème + solution + CTA
- pas de blabla
"""

    response = client.responses.create(
        model="gpt-5.4",
        input=prompt
    )

    return response.output_text.strip()


class AppHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        if self.path == "/" or self.path == "/health":
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "ok": True,
                "message": "WORKER OK 🔥",
                "ai": bool(os.getenv("OPENAI_API_KEY"))
            }, ensure_ascii=False).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({
                "ok": False,
                "error": "Route not found"
            }, ensure_ascii=False).encode())

    def do_POST(self):
        if self.path == "/generate":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)

            try:
                data = json.loads(body.decode())
            except Exception:
                self._set_headers(400)
                self.wfile.write(json.dumps({
                    "ok": False,
                    "error": "Invalid JSON"
                }, ensure_ascii=False).encode())
                return

            product = data.get("product", "Produit inconnu")

            try:
                script = generate_tiktok_script(product)

                response = {
                    "ok": True,
                    "data": {
                        "product": product,
                        "script": script,
                        "status": "ready_ai"
                    }
                }

                self._set_headers(200)
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode())

            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({
                    "ok": False,
                    "error": str(e)
                }, ensure_ascii=False).encode())

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({
                "ok": False,
                "error": "Route not found"
            }, ensure_ascii=False).encode())


def run():
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"🚀 Worker running on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()