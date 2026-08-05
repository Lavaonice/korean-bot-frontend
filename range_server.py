"""Range-capable static file server for local preview.

Python's stdlib `http.server` (SimpleHTTPRequestHandler) does NOT honor HTTP
Range requests — it always responds 200 with the full body. Browsers require
range support to stream/seek <video>, so an MP4 served by it buffers a chunk
and then stalls forever. This handler adds Accept-Ranges / 206 Partial Content
and serves the current directory (used as the website root).
"""

import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            return super().send_head()

        try:
            fs = os.fstat(f.fileno())
            size = fs[6]
            range_header = self.headers.get("Range")
            start, end = 0, size - 1
            status = 200

            if range_header:
                m = re.match(r"bytes=(\d*)-(\d*)", range_header)
                if m:
                    g1, g2 = m.group(1), m.group(2)
                    if g1:
                        start = int(g1)
                    if g2:
                        end = int(g2)
                    else:
                        end = size - 1
                    if start > end or start >= size:
                        self.send_error(416, "Requested Range Not Satisfiable")
                        f.close()
                        return None
                    status = 206

            self.send_response(status)
            self.send_header("Content-type", self.guess_type(path))
            self.send_header("Content-Length", str(end - start + 1))
            if status == 206:
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()

            f.seek(start)
            remaining = end - start + 1
            chunk = 64 * 1024
            while remaining > 0:
                data = f.read(min(chunk, remaining))
                if not data:
                    break
                self.wfile.write(data)
                remaining -= len(data)
            f.close()
            return None
        except Exception:
            f.close()
            raise


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
    handler = RangeHTTPRequestHandler
    httpd = ThreadingHTTPServer(("0.0.0.0", port), handler)
    print(f"range-capable static server on http://localhost:{port}/", flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
