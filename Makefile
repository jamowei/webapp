PORT?=3000
MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
NAME := $(notdir $(patsubst %/,%,$(dir $(MKFILE_PATH))))

build:
	npm install
	node build.mjs
	docker build -t ${NAME}:latest .
	@echo "🛠️ Docker build successful"

serve:
	npm install
	node build.mjs serve

run: build
	@docker run --name ${NAME} -dt --rm --init -p ${PORT}:3000 ${NAME}:latest > /dev/null
	@echo "🚀 Serving at http://localhost:${PORT}/"

stop:
	@docker container stop ${NAME} > /dev/null
	@echo "☠️ Container ${NAME} stopped"