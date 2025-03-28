#!/bin/sh

DOMAIN="northwcharity.duckdns.org"
EMAIL="k2325823@kingston.ac.uk"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

# Ensure Let's Encrypt directory exists
mkdir -p /etc/letsencrypt

# Check if SSL certificate already exists
if [ ! -f "$CERT_PATH" ]; then
    echo "Obtaining SSL certificate for $DOMAIN..."
    certbot certonly --standalone --non-interactive --agree-tos --email "$EMAIL" -d "$DOMAIN"
else
    echo "SSL certificate already exists."
fi

# Start Nginx
nginx -g 'daemon off;'
