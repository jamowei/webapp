ARG NODE_VERSION=22
ARG BUSYBOX_VERSION=1.37.0
ARG ALPINE_VERSION=3

#################################################################
####################### esbuild #################################
#################################################################
FROM node:${NODE_VERSION}-alpine as esbuild


COPY . /esbuild
WORKDIR /esbuild

RUN npm install && node build.mjs

##################################################################
####################### httpd ####################################
##################################################################
FROM alpine:${ALPINE_VERSION} AS httpd

# Install all dependencies required for compiling busybox
RUN apk add gcc musl-dev make perl

# Download busybox sources
ARG BUSYBOX_VERSION
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

##################################################################
####################### main #####################################
##################################################################
FROM scratch

# Copy over the user
COPY --from=httpd /etc/passwd /etc/passwd

# Use our non-root user
USER static
WORKDIR /home/static

# Copy httpd files
COPY --from=httpd --chown=static /busybox/busybox_HTTPD httpd
# Copy esbuild files
COPY --from=esbuild --chown=static /esbuild/out .

COPY --chown=static httpd.conf .

# port httpd runs on
EXPOSE 3000
STOPSIGNAL SIGINT

# Run busybox httpd
CMD ["/home/static/httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]