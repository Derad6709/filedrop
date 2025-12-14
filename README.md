# filedrop

Available at: https://drop.lol/

Easy end-to-end encrypted, peer-to-peer file transfer.

**Features:**

- Fully end-to-end encrypted, including metadata and chat.
- Peer-to-peer wherever possible (using WebRTC).
- Simple chat function with copy and paste.
- Minimalist user interface.
- Available as a Progressive Web Application.
- Configurable STUN servers for WebRTC connections.

<p align="center">
    <a href="https://drop.lol/">
        <img src="https://raw.githubusercontent.com/mat-sz/filedrop/master/docs/filedrop.gif" alt="Screenshot">
    </a>
</p>

## Docs

- [Usage/self-hosting](./docs/usage.md)
- [FAQ](./docs/faq.md)
- [HTTPS setup](./docs/https/index.md)

## STUN Server Configuration

Filedrop allows users to choose which STUN servers are used for WebRTC connections. The STUN server switcher is directly accessible on the main page, below your name.

**Features:**
- Select from preset STUN server configurations (Google STUN, Cloudflare STUN)
- Add custom STUN servers with automatic validation
- Settings are persisted in browser storage
- Changes apply to new connections (existing transfers are not affected)

**Custom STUN URL Format:**
- Must use `stun://` or `stuns://` scheme
- Format: `stun://hostname:port` or `stuns://hostname:port`
- Port is optional (defaults to 3478 for standard STUN)

Example custom STUN URLs:
- `stun://stun.example.com:3478`
- `stuns://secure-stun.example.com:5349`
