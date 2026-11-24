# syntax=docker/dockerfile:1.7
#
# Hardened MongoDB image based on the official mongo:7 image.
#
# The official image ships a few components with known, already-fixed
# vulnerabilities that its own release cycle has not picked up yet:
#   - Ubuntu base packages (glibc, ...)        -> upgraded below
#   - gosu (built with Go 1.24.6)              -> removed, we run as `mongodb`
#   - /js-yaml.js 3.13.1 (used by entrypoint)  -> replaced with 3.15.2
FROM mongo:7

# Pull the latest Ubuntu security updates (fixes libc6 / libc-bin CVEs).
RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Replace the js-yaml copy the entrypoint uses to read --config files.
ADD --checksum=sha256:85a1fdcd7fa1e971550192012a5882a2d731eb45fd9135663fed715d646a693a \
    https://cdn.jsdelivr.net/npm/js-yaml@3.15.2/dist/js-yaml.js /tmp/js-yaml.js
RUN rm -rf /opt/js-yaml /js-yaml.js \
    && mkdir -p /opt/js-yaml \
    && mv /tmp/js-yaml.js /opt/js-yaml/js-yaml.js \
    && chmod 0644 /opt/js-yaml/js-yaml.js \
    && ln -s /opt/js-yaml/js-yaml.js /js-yaml.js

# gosu is only used by the entrypoint to drop root privileges. Running the
# container directly as the unprivileged `mongodb` user (uid 999, which already
# owns /data/db) makes it unnecessary, so we drop the vulnerable binary.
RUN rm -f /usr/local/bin/gosu

USER mongodb
