require 'eventmachine'
require 'em-websocket'
require 'http/parser'
require 'uri'

module Guard
  class LiveReload
    class WebSocket < EventMachine::WebSocket::Connection

      def dispatch(data)
        parser = Http::Parser.new
        parser << data
        # prepend with '.' to make request url usable as a file path
        request_path = '.' + URI.parse(parser.request_url).path
        request_path += '/index.html' if File.directory? request_path
        if parser.http_method != 'GET' || parser.upgrade?
          super #pass the request to websocket
        elsif request_path == './livereload.js'
          _serve_file(_livereload_js_file)
        elsif File.readable?(request_path) && !File.directory?(request_path)
          _serve_file(request_path)
        else
          send_data("HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 13\r\n\r\n404 Not Found")
          close_connection_after_writing
        end
      end

      private

      def _serve_file(path)
        UI.debug "Serving file #{path}"
        send_data "HTTP/1.1 200 OK\r\nContent-Type: #{_content_type(path)}\r\nContent-Length: #{File.size path}\r\n\r\n"
        stream_file_data(path).callback { close_connection_after_writing }
      end

      def _content_type(path)
        case File.extname(path).downcase
        when '.html', '.htm' then 'text/html'
        when '.css' then 'text/css'
        when '.js' then 'application/ecmascript'
        when '.gif' then 'image/gif'
        when '.jpeg', '.jpg' then 'image/jpeg'
        when '.png' then 'image/png'
        else; 'text/plain'
        end
      end

      def _livereload_js_file
        File.expand_path("../../../../js/livereload.js", __FILE__)
      end

    end
  end
end
