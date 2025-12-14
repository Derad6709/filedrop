# Usage

## Docker

### Requirements

- docker
- docker-compose
- bash
- openssl
- git

### Installation

1. Ensure that your user is in the `docker` group.
1. Run the following commands in terminal:
   1. `git clone https://github.com/mat-sz/filedrop`
   2. `chmod +x ./docker-start.sh`
   3. `./docker-start.sh`

TURN uses TCP port 3478 and UDP ports 49152-65535.

### docker-start.sh arguments

| Option       | Description                                     |
| ------------ | ----------------------------------------------- |
| `-n <name>`  | Sets application name.                          |
| `-e <email>` | Sets contact email.                             |
| `-p <port>`  | Sets port for the application to be exposed at. |
| `-f`         | Enables WS_USE_X_FORWARDED_FOR.                 |
| `-s`         | Enables WS_REQUIRE_CRYPTO.                      |

## Manual

### Requirements

- TURN server, ideally with HMAC authentication, example: [coturn](https://github.com/coturn/coturn)
- node.js 18.x.x, 20+
- git

### Installation

1. Set up and configure your TURN server and note down the secret for next steps.
2. Run the following in terminal:
   1. `git clone https://github.com/mat-sz/filedrop`
   2. `corepack yarn install`
   3. `corepack yarn build`
   4. `corepack yarn start`

## Environment variables

The following variables are used in the build process of the frontend:

| Variable        | Default value | Description                                                                                       |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `VITE_APP_NAME` | `filedrop`    | Default application title (while connecting). Set to name provided by the server upon connection. |

The following variables are used in the WebSockets server:

| Variable                 | Default value                   | Description                                                                                                               |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `WS_APP_NAME`            | `filedrop`                      | Application title.                                                                                                        |
| `WS_ABUSE_EMAIL`         | null                            | E-mail to show in the Abuse section.                                                                                      |
| `WS_HOST`                | `127.0.0.1`                     | IP address to bind to.                                                                                                    |
| `WS_PORT`                | `5000`                          | Port to bind to.                                                                                                          |
| `WS_USE_X_FORWARDED_FOR` | `0`                             | Set to `1` if you want the application to respect the `X-Forwarded-For` header.                                           |
| `WS_MAX_SIZE`            | `65536`                         | The limit should accommodate preview images (100x100 thumbnails).                                                         |
| `WS_MAX_NETWORK_CLIENTS` | `64`                            | Limits the amount of clients that can connect to one room.                                                                |
| `WS_REQUIRE_CRYPTO`      | `0`                             | Set to `1` if you want to ensure that all communication between clients is encrypted. HTTPS is required for this to work. |
| `WS_STATIC_ROOT`         | `../web/build`                  | Location of frontend build files relative to `./ws`                                                                       |
| `STUN_SERVER`            | `stun:stun1.l.google.com:19302` | STUN server address.                                                                                                      |
| `TURN_MODE`              | `default`                       | `default` for static credentials, `hmac` for time-limited credentials.                                                    |
| `TURN_SERVER`            | null                            | TURN server address.                                                                                                      |
| `TURN_USERNAME`          | null                            | TURN username.                                                                                                            |
| `TURN_CREDENTIAL`        | null                            | TURN credential (password).                                                                                               |
| `TURN_SECRET`            | null                            | TURN secret (required for `hmac`).                                                                                        |
| `TURN_EXPIRY`            | `3600`                          | TURN token expiration time (when in `hmac` mode), in seconds.                                                             |
| `NOTICE_TEXT`            | null                            | Text of the notice to be displayed for all clients.                                                                       |
| `NOTICE_URL`             | null                            | URL the notice should link to.                                                                                            |

## Client-Side STUN Server Configuration

In addition to the server-side STUN configuration, users can customize their STUN servers directly in the web interface:

1. **Location**: The STUN server selector is located on the main page, below your name display.

2. **Preset Options**:
   - **Google STUN**: Uses Google's public STUN servers (default)
   - **Cloudflare STUN**: Uses Cloudflare's public STUN server
   - **Custom**: Allows you to add your own STUN server URLs

3. **Adding Custom STUN Servers**:
   - Select "Custom" from the dropdown
   - Enter STUN URL in the format: `stun://hostname:port` or `stuns://hostname:port`
   - Click the "+" button to add the URL
   - Multiple STUN servers can be added for fallback

4. **URL Validation**:
   - Must start with `stun://` or `stuns://`
   - Must include a valid hostname
   - Port is optional (defaults to 3478)
   - Invalid URLs are rejected with inline feedback

5. **Important Notes**:
   - Settings are stored in browser's localStorage and persist across sessions
   - Changes only affect new connections; existing transfers are not interrupted
   - Custom STUN settings override server-provided STUN servers
   - TURN servers from the server configuration are always included alongside user-selected STUN servers

**Example Custom STUN URLs**:
```
stun://stun.example.com:3478
stuns://secure-stun.example.com:5349
stun://stun.myserver.org
```
