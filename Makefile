PORT?=3000
MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
NAME := $(notdir $(patsubst %/,%,$(dir $(MKFILE_PATH))))

build:
	@npm install
	@node build.mjs

serve:
	node build.mjs serve

k8s:
	node build.mjs k8s

clean:
	@rm -rf out

docker_build:
	docker build -t ${NAME}:latest .
	@echo "🛠️  - Docker build successful"

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

k8s_apply: k8s
ifeq ($(strip $(namespace)),)
	kubectl apply -f out/${NAME}.k8s.yaml
else
	kubectl apply -f out/${NAME}.k8s.yaml --namespace $(namespace)
endif

k8s_delete:
ifeq ($(strip $(namespace)),)
	kubectl delete -f out/${NAME}.k8s.yaml
else
	kubectl delete -f out/${NAME}.k8s.yaml --namespace $(namespace)
endif

release:
ifeq ($(strip $(version)),)
	@echo usage: make release version=1.0.0
else
	@git tag $(version)
	git push origin tag $(version)
	@echo 🎉 - Release $(version) created $$(git config --get remote.origin.url)
endif

release_delete:
ifeq ($(strip $(version)),)
	@echo usage: make delete_release version=1.0.0
else
	@git tag -d $(version)
	git push --delete origin $(version)
	@echo ❌ - Release $(version) deleted $$(git config --get remote.origin.url)
endif