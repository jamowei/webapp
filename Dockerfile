ARG ALPINE_VERSION=3.20

FROM alpine:${ALPINE_VERSION} AS builder

ARG BUSYBOX_VERSION=1.36.1

# Install all dependencies required for compiling busybox
RUN apk add gcc musl-dev make perl

# Download busybox sources
RUN wget https://busybox.net/downloads/busybox-${BUSYBOX_VERSION}.tar.bz2 \
  && tar xf busybox-${BUSYBOX_VERSION}.tar.bz2 \
  && mv /busybox-${BUSYBOX_VERSION} /busybox

WORKDIR /busybox

# Copy the busybox build config (limited to httpd)
COPY .busybox .config

# Compile
RUN make && ./make_single_applets.sh

# Create a non-root user to own the files and run our server
RUN adduser -D static

# Switch to the scratch image
FROM scratch

# Copy over the user
COPY --from=builder /etc/passwd /etc/passwd

# Copy the static binary
COPY --from=builder /busybox/busybox_HTTPD /httpd

# Use our non-root user
USER static
WORKDIR /home/static

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
# NOTE: Commented out since this will also copy the .config file
COPY out .

# port httpd runs on
EXPOSE 3000

# Run busybox httpd
CMD ["/httpd", "-f", "-p", "3000"]