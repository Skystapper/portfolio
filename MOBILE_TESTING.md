# Mobile Testing with Cloudflare Tunnel

This setup allows you to test your portfolio on mobile devices using Cloudflare's free tunnel service.

## Quick Start

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start mobile testing**:
   ```bash
   npm run mobile
   ```

3. **Access on mobile**: Look for the tunnel URL in the terminal output that looks like:
   ```
   https://xxx-xxx-xxx.trycloudflare.com
   ```

## Available Scripts

- `npm run mobile` - Complete setup with automatic config switching
- `npm run dev:tunnel` - Simple tunnel (localhost only)
- `npm run dev:mobile-tunnel` - Mobile-accessible tunnel
- `npm run dev:mobile` - Local network access without tunnel

## How it Works

1. **Automatic Config Switching**: The script temporarily switches to a development-friendly Next.js config
2. **Network Access**: Starts the dev server with `0.0.0.0` binding for network access
3. **Cloudflare Tunnel**: Creates a secure tunnel to your local development server
4. **Cleanup**: Automatically restores your original config when you stop the server

## Features

- ✅ **No signup required** - Uses Cloudflare's free tunnel service
- ✅ **HTTPS by default** - Secure connection for testing PWA features
- ✅ **Real mobile testing** - Test on actual devices over the internet
- ✅ **Automatic cleanup** - Restores your original config automatically
- ✅ **Fast setup** - One command to get started

## Troubleshooting

- **Tunnel not starting**: Make sure port 3000 is available
- **Mobile can't access**: Check that the tunnel URL is accessible in your browser first
- **Config issues**: The script automatically backs up and restores your config
- **Performance**: The tunnel adds some latency, this is normal for testing

## Security Note

The tunnel URL is temporary and changes each time you start the server. It's only accessible while your development server is running. 