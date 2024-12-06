PORT?=3000
MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
NAME := $(notdir $(patsubst %/,%,$(dir $(MKFILE_PATH))))
ARGS = $(foreach a,$($(subst -,_,$1)_args),$(if $(value $a),$a="$($a)"))

build:
	npm install
	node build.mjs
	docker build -t ${NAME}:latest .
	@echo "🛠️ - Docker build successful"

serve:
	npm install
	node build.mjs serve

docker_run: build
	@docker run --name ${NAME} -dt --rm --init -p ${PORT}:3000 ${NAME}:latest > /dev/null
	@docker container ls
	@echo "🚀 - Container '${NAME}' started. Running at http://localhost:${PORT}/"

docker_stop:
	@docker container stop ${NAME} > /dev/null
	@echo "☠️ - Container '${NAME}' stopped"

docker_clean:
	@docker image prune -f
	@echo "🧹 - Docker Images cleaned"

helm_install:
	@helm upgrade --install --wait --create-namespace --namespace ${NAME} ${NAME} ./helm
	@echo "☸️ - Helm Release '${NAME}' deployed"

helm_uninstall:
	@helm uninstall --namespace ${NAME} ${NAME}
	@echo "☸️ - Helm Release '${NAME}' uninstalled"

release:
ifeq ($(strip $(version)),)
	@echo usage: make release version=v1.0
else
	@git tag $(version)
	git push origin tag $(version)
	@echo 🎉 - Release $(version) created $$(git config --get remote.origin.url)
endif

release_delete:
ifeq ($(strip $(version)),)
	@echo usage: make delete_release version=v1.0
else
	@git tag -d $(version)
	git push --delete origin $(version)
	@echo ❌ - Release $(version) deleted $$(git config --get remote.origin.url)
endif