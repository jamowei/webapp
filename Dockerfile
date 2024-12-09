ARG NODE_VERSION=22
ARG BUSYBOX_VERSION=1.36.1
ARG ALPINE_VERSION=3.20

#################################################################
####################### NodeJs ##################################
#################################################################
FROM node:${NODE_VERSION}-alpine as webapp


COPY . /webapp
WORKDIR /webapp

RUN npm install && node build.mjs

##################################################################
####################### HTTPD ####################################
##################################################################
FROM alpine:${ALPINE_VERSION} AS webserver

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
####################### WebApp ###################################
##################################################################
FROM scratch

# Copy over the user
COPY --from=webserver /etc/passwd /etc/passwd

# Use our non-root user
USER static
WORKDIR /home/static

# Copy webserver files
COPY --from=webserver --chown=static /busybox/busybox_HTTPD httpd
# Copy webapp files
COPY --from=webapp --chown=static /webapp/out .

# port httpd runs on
EXPOSE 3000

# Run busybox httpd
CMD ["/home/static/httpd", "-f", "-p", "3000"]