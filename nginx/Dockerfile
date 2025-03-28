# Use the official Nginx image as a base
FROM nginx:alpine

# Install necessary packages
RUN apk update && apk add --no-cache \
    certbot \
    bash \
    curl \
    openssl \
    && rm -rf /var/cache/apk/*

# Copy your custom Nginx config into the container
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy script for obtaining SSL
COPY ./obtain_ssl.sh /usr/local/bin/obtain_ssl.sh
RUN chmod +x /usr/local/bin/obtain_ssl.sh

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start the container
CMD ["sh", "-c", "/usr/local/bin/obtain_ssl.sh"]
